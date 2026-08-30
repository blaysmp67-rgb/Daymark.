import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("You must be signed in");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Invalid login");

    const { reminderId, action = "schedule" } = await req.json();
    if (!reminderId) throw new Error("Missing reminder ID");

    const { data: reminder, error: reminderError } = await supabase
      .from("reminders")
      .select("id,user_id,title,reminder_at,notification_id,notification_scheduled")
      .eq("id", reminderId)
      .single();

    if (reminderError || !reminder) throw new Error("Reminder not found");
    if (reminder.user_id !== user.id) throw new Error("Not authorized");

    const appId = Deno.env.get("ONESIGNAL_APP_ID");
    const apiKey = Deno.env.get("ONESIGNAL_REST_API_KEY");
    if (!appId || !apiKey) throw new Error("OneSignal secrets are missing");

    async function cancelExisting() {
      if (!reminder.notification_id) return;
      await fetch(
        `https://api.onesignal.com/notifications/${reminder.notification_id}?app_id=${appId}`,
        { method: "DELETE", headers: { Authorization: `Key ${apiKey}` } }
      );
    }

    if (action === "delete") {
      await cancelExisting();
      const { error } = await supabase.from("reminders").delete().eq("id", reminder.id);
      if (error) throw error;
      return json({ success: true, deleted: true });
    }

    if (action === "cancel") {
      await cancelExisting();
      const { error } = await supabase.from("reminders").update({
        notification_id: null,
        notification_scheduled: false,
      }).eq("id", reminder.id);
      if (error) throw error;
      return json({ success: true, cancelled: true });
    }

    const sendTime = new Date(reminder.reminder_at);
    if (Number.isNaN(sendTime.getTime()) || sendTime.getTime() <= Date.now()) {
      throw new Error("Reminder must be scheduled in the future");
    }

    await cancelExisting();

    const osResponse = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_aliases: { external_id: [user.id] },
        target_channel: "push",
        headings: { en: "Daymark" },
        contents: { en: reminder.title },
        send_after: sendTime.toISOString(),
        url: "https://daymark-3.onrender.com/"
      }),
    });

    const result = await osResponse.json();
    if (!osResponse.ok || !result.id) throw new Error("OneSignal scheduling failed: " + JSON.stringify(result));

    const { error: updateError } = await supabase.from("reminders").update({
      notification_id: result.id,
      notification_scheduled: true,
    }).eq("id", reminder.id);
    if (updateError) throw updateError;

    return json({ success: true, notificationId: result.id });
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
