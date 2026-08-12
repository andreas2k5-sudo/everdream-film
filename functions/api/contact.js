const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed. Submit the contact form using POST." },
      405,
      { allow: "POST" },
    );
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ success: false, error: "Invalid form submission." }, 400);
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const honeypot = String(formData.get("company") || "").trim();

  if (honeypot) {
    return jsonResponse({ success: false, error: "Submission rejected." }, 400);
  }

  if (!name || name.length > 120) {
    return jsonResponse({ success: false, error: "Please enter a valid name." }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, error: "Please enter a valid email address." }, 400);
  }

  if (subject.length > 160) {
    return jsonResponse({ success: false, error: "The subject is too long." }, 400);
  }

  if (!message || message.length > 5000) {
    return jsonResponse({ success: false, error: "Please enter a message of 5,000 characters or fewer." }, 400);
  }

  /*
   * FUTURE TURNSTILE:
   * Read the Turnstile token from formData and validate it server-side with
   * Cloudflare's siteverify endpoint before processing the message.
   */

  /*
   * FUTURE EMAIL DELIVERY:
   * Visitor
   *   -> contact form
   *   -> /api/contact
   *   -> Cloudflare Pages Function
   *   -> verified email delivery
   *   -> the studio's real inbox
   *
   * Add the verified Cloudflare delivery integration here after deployment.
   * The recipient must come from a protected environment binding; never place
   * a private inbox or API credential in this repository. This development
   * endpoint deliberately does not send, log, or store personal information.
   */

  return jsonResponse({ success: true });
}
