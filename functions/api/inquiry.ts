const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function clean(value: unknown) {
  return String(value || "").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context: any) {
  const env = context.env || {};
  const resendApiKey = env.RESEND_API_KEY;
  const toEmail = env.INQUIRY_TO_EMAIL || "info@travelgateway.in";
  const fromEmail = env.INQUIRY_FROM_EMAIL || "Travel Gateway <inquiry@travelgateway.in>";

  if (!resendApiKey) {
    return jsonResponse(
      {
        ok: false,
        error: "Email service is not configured. Please add RESEND_API_KEY in Cloudflare Pages environment variables.",
      },
      500
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid inquiry payload." }, 400);
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const phone = clean(payload.phone);
  const destination = clean(payload.destination) || "Not specified";
  const travelDate = clean(payload.travel_date) || "Not specified";
  const travelMonth = clean(payload.travel_month) || "Not specified";
  const urgency = clean(payload.urgency) || "Planning ahead";
  const adults = clean(payload.adults) || "1";
  const children = clean(payload.children) || "0";
  const infants = clean(payload.infants) || "0";
  const wheelchairSupport = clean(payload.wheelchair_support) || "Not required";
  const specialAssistance = clean(payload.special_assistance) || "None shared";
  const budget = clean(payload.budget_per_person) || "Not specified";
  const preferredContact = clean(payload.preferred_contact) || "Not specified";
  const message = clean(payload.message) || "No additional notes shared.";
  const sourcePage = clean(payload.source_page) || "Website contact form";
  const submittedAt = clean(payload.submitted_at) || new Date().toISOString();

  if (!name || !email || !phone || travelDate === "Not specified") {
    return jsonResponse({ ok: false, error: "Name, email, phone, and exact travel date are required." }, 400);
  }

  const urgentPrefix = urgency === "Same-day travel" || urgency === "Within 72 hours"
    ? `[URGENT: ${urgency.toUpperCase()}] `
    : "";
  const subject = `${urgentPrefix}Travel Gateway Inquiry: ${name} - ${destination} - ${travelDate}`;
  const text = [
    urgentPrefix ? `${urgentPrefix.trim()} TRAVEL REQUEST` : "New Travel Gateway Inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Destination: ${destination}`,
    `Exact Travel Date: ${travelDate}`,
    `Travel Month: ${travelMonth}`,
    `Urgency: ${urgency}`,
    `Passengers: ${adults} adult(s), ${children} child(ren), ${infants} infant(s)`,
    `Wheelchair Support: ${wheelchairSupport}`,
    `Special Assistance: ${specialAssistance}`,
    `Budget Per Person: ${budget}`,
    `Preferred Contact: ${preferredContact}`,
    `Message: ${message}`,
    `Source Page: ${sourcePage}`,
    `Submitted At: ${submittedAt}`,
  ].join("\n");

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Destination", destination],
    ["Exact Travel Date", travelDate],
    ["Travel Month", travelMonth],
    ["Urgency", urgency],
    ["Passengers", `${adults} adult(s), ${children} child(ren), ${infants} infant(s)`],
    ["Wheelchair Support", wheelchairSupport],
    ["Special Assistance", specialAssistance],
    ["Budget Per Person", budget],
    ["Preferred Contact", preferredContact],
    ["Message", message],
    ["Source Page", sourcePage],
    ["Submitted At", submittedAt],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5">
      <h2 style="margin:0 0 16px;color:${urgentPrefix ? "#b91c1c" : "#0f172a"}">${urgentPrefix ? escapeHtml(`${urgentPrefix.trim()} TRAVEL REQUEST`) : "New Travel Gateway Inquiry"}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #e2e8f0;padding:10px;font-weight:700;background:#f8fafc;width:180px">${escapeHtml(label)}</td>
                <td style="border:1px solid #e2e8f0;padding:10px">${escapeHtml(value)}</td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    return jsonResponse(
      {
        ok: false,
        error: result?.message || "Email provider rejected the inquiry. Please check RESEND_API_KEY in Cloudflare Pages.",
      },
      200
    );
  }

  return jsonResponse({ ok: true, id: result?.id || null });
}
