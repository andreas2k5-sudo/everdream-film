const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed." },
      405,
      { allow: "POST" },
    );
  }

  if (!env?.CONTACT_MAILER || typeof env.CONTACT_MAILER.fetch !== "function") {
    return jsonResponse({ success: false, error: "Contact service is unavailable." }, 500);
  }

  try {
    return await env.CONTACT_MAILER.fetch(request);
  } catch {
    return jsonResponse({ success: false, error: "Contact service is unavailable." }, 500);
  }
}
