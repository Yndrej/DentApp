const DEFAULT_RECIPIENTS = ["stevo@dentall.sk", "obchod@dentall.sk", "dentall@dentall.sk"];

function json(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function lines(items = []) {
  return items.length ? items.join("\n") : "-";
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    json(response, 405, { error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    json(response, 503, { error: "RESEND_API_KEY is not configured" });
    return;
  }

  const payload = await readBody(request);
  const recipients = Array.isArray(payload.recipients) && payload.recipients.length
    ? payload.recipients
    : DEFAULT_RECIPIENTS;
  const protocolNumber = payload.protocolNumber || "bez cisla";
  const subject = `DentApp: ${payload.kind || "Protokol"} ${protocolNumber} - ${payload.clientName || "ambulancia"}`;
  const deviceLines = (payload.devices || []).map((device) => `- ${device.label || "Zariadenie"}${device.serial ? ` (${device.serial})` : ""}`);
  const text = [
    "V DentApp bol ulozeny novy protokol.",
    "",
    `Cislo protokolu: ${protocolNumber}`,
    `Typ: ${payload.kind || ""}`,
    `Nazov: ${payload.title || ""}`,
    `Datum: ${payload.date || ""}`,
    `Ambulancia: ${payload.clientName || ""}`,
    `Adresa: ${payload.clientAddress || ""}`,
    `Technik: ${payload.technician || ""}`,
    "",
    "Zariadenia:",
    lines(deviceLines),
    "",
    `DentApp: ${payload.url || ""}`,
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.DOCUMENT_NOTIFICATION_FROM || "DentApp <onboarding@resend.dev>",
      to: recipients,
      subject,
      text,
    }),
  });

  const resultText = await resendResponse.text();
  if (!resendResponse.ok) {
    json(response, resendResponse.status, { error: resultText });
    return;
  }

  json(response, 200, { ok: true });
};
