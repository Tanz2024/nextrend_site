// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // ensure Node runtime on Vercel

/* ---------------------- env + resend client ---------------------- */

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;
const fromName = process.env.FROM_NAME ?? "Nextrend Systems";
const ownerEmail = process.env.OWNER_EMAIL;

// single Resend instance (for Node runtime)
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/* ------------------ simple in-memory rate limit ------------------ */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 3;

const rateLimitStore = new Map<string, { count: number; first: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing) {
    rateLimitStore.set(key, { count: 1, first: now });
    return true;
  }

  // window expired → reset
  if (now - existing.first > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, first: now });
    return true;
  }

  // still in window
  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return true;
}

/* -------------------------- helpers ------------------------------ */

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  vision?: string;
  honeypot?: string;
  userAgent?: string;
  referrer?: string;
  securityCheck?: string;
  securityKey?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const summarizeFields = (payload: ContactPayload) => {
  const entries: Array<[string, string]> = [
    ["Name", payload.name ?? "—"],
    ["Email", payload.email ?? "—"],
    ["Phone", payload.phone ?? "—"],
    ["Project Location", payload.location ?? "—"],
    ["Vision / Notes", payload.vision ?? "—"],
    ["Security Key", payload.securityKey ?? "—"],
    ["Security Check", payload.securityCheck ?? "—"],
  ];

  return entries
    .map(
      ([label, value]) =>
        `<tr><td><strong>${label}</strong></td><td>${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");
};

/* ----------------------------- POST ------------------------------ */

export async function POST(request: Request) {
  // env guard
  if (!resendApiKey || !fromEmail || !ownerEmail || !resend) {
    console.error("Missing email env vars", {
      hasKey: !!resendApiKey,
      hasFrom: !!fromEmail,
      hasOwner: !!ownerEmail,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Contact service is temporarily unavailable.",
      },
      { status: 503 }
    );
  }

  let payload: ContactPayload | null = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Missing request payload." },
      { status: 400 }
    );
  }

  // Honeypot spam protection (same as front-end)
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return NextResponse.json(
      { success: false, error: "Spam protection triggered." },
      { status: 400 }
    );
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();

  if (!name || !email) {
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }

  // derive IP, UA, referrer
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ip =
    forwardedFor.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent =
    payload.userAgent ?? request.headers.get("user-agent") ?? "unknown";
  const referrer =
    payload.referrer ?? request.headers.get("referer") ?? "unknown";

  // rate limiting (per IP + email)
  const ipKey = `ip:${ip}`;
  const emailKey = `email:${email.toLowerCase()}`;

  if (!checkRateLimit(ipKey) || !checkRateLimit(emailKey)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "You’ve reached the message limit. Please try again in a few minutes.",
      },
      { status: 429 }
    );
  }

  /* ----------------- build email contents ----------------- */

  const ownerHtml = `
    <h1>New connection request</h1>
    <p>A visitor submitted the contact form on the Nextrend Systems site.</p>
    <table cellpadding="6" cellspacing="0" border="0">
      ${summarizeFields(payload)}
      <tr><td><strong>IP Address</strong></td><td>${escapeHtml(
        String(ip)
      )}</td></tr>
      <tr><td><strong>User agent</strong></td><td>${escapeHtml(
        userAgent
      )}</td></tr>
      <tr><td><strong>Referrer/Source</strong></td><td>${escapeHtml(
        referrer
      )}</td></tr>
    </table>
  `;

  const userHtml = `
<div style="background:#f7f4ec; padding:40px; font-family:Playfair Display,serif; color:#1a1a1a;">
  <h2 style="margin:0; font-size:26px; font-weight:600;">
    Thank you for contacting Nextrend Systems
  </h2>

  <p style="margin-top:18px; font-size:15px; line-height:1.7;">
    Hi ${escapeHtml(name)},<br/>
    Your message has been received by our concierge engineering team.
    We will respond within our <strong>business hours (10 AM – 7 PM, GMT+8)</strong>.
  </p>

  <p style="margin-top:14px; font-size:15px; line-height:1.7;">
    For urgent enquiries or private demonstration requests,
    you may reach us via WhatsApp:<br/>
    <strong style="font-size:16px;">+60 11-xxx xxxx</strong>
  </p>

  <hr style="margin:30px 0; border:none; border-top:1px solid #d5c29f;"/>

  <p style="font-size:13px; opacity:0.7; letter-spacing:0.3px;">
    Nextrend Systems · Architectural Audio & Luxury Installations<br/>
    Kuala Lumpur · Malaysia
  </p>
</div>
  `;

  const fromHeader = `${fromName} <${fromEmail}>`;

  try {
    const [ownerResult, userResult] = await Promise.all([
      // email to you
      resend.emails.send({
        from: fromHeader,
        to: ownerEmail,
        subject: `New enquiry from ${name}`,
        html: ownerHtml,
        text: `New enquiry from ${name} (${email}). Location: ${
          payload.location ?? "n/a"
        }`,
        reply_to: email,
      }),

      // auto-response to user
      resend.emails.send({
        from: fromHeader,
        to: email,
        subject: "We received your message",
        html: userHtml,
        text:
          "Thank you for contacting Nextrend Systems. We have received your message and will respond within our business hours (10 AM – 7 PM, GMT+8). For urgent enquiries, please reach us via WhatsApp at +60 11-xxx xxxx.",
      }),
    ]);

    // explicitly surface Resend API errors
    if (ownerResult.error || userResult.error) {
      console.error("Resend owner error:", ownerResult.error);
      console.error("Resend user error:", userResult.error);

      const message =
        userResult.error?.message ??
        ownerResult.error?.message ??
        "Failed to send one of the emails.";

      return NextResponse.json(
        { success: false, error: message },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact emails", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails right now." },
      { status: 502 }
    );
  }
}
