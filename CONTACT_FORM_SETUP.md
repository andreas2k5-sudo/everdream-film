# Contact form setup — complete

The Cloudflare configuration for the Everdream Film contact form is complete.

## Current architecture

```text
contact.html
→ JSON POST /api/contact
→ functions/api/contact.js
→ CONTACT_MAILER Service Binding
→ everdream-contact-mailer Worker
→ EMAIL binding
→ everdreamfilm@hotmail.com
```

The Pages Function is intentionally a small proxy. It enforces POST-only access and forwards the original request to the mail Worker with `context.env.CONTACT_MAILER.fetch(context.request)`. The mail Worker owns validation, honeypot handling, email construction, and delivery. The Pages Function returns the Worker response and status without claiming success independently.

## Completed Cloudflare configuration

- Pages project: `everdream-film`
- Email Routing enabled for `everdreamfilm.com`
- Verified Destination Address: `everdreamfilm@hotmail.com`
- Mail Worker deployed: `everdream-contact-mailer`
- Worker Email Service binding: `EMAIL`
- Pages Service Binding: `CONTACT_MAILER` → `everdream-contact-mailer`

Cloudflare documents forwarding a `Request` through an HTTP Service Binding with `env.BINDING_NAME.fetch(request)`: <https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/http/>

## Remaining deployment steps

1. Commit the new site code.
2. Push `main` to GitHub.
3. Cloudflare Pages redeploys automatically.
4. Test the live contact form and confirm a message arrives at `everdreamfilm@hotmail.com`.

No additional Cloudflare configuration is required before deployment.
