# Everdream Film

Official website for Everdream Film and its first feature project, **The Black Reef**.

## Site structure

- `index.html` — Home
- `film.html` — The Film
- `trailer.html` — Trailer
- `support.html` — Support and reward tiers
- `roadmap.html` — Production roadmap
- `projects.html` — Current and future films
- `about.html` — Studio story and approach
- `contact.html` — Contact information and active contact form
- `css/styles.css` — Shared responsive design system
- `js/main.js` — Navigation, interactions, and asynchronous contact form behavior
- `functions/api/contact.js` — POST-only proxy to the bound contact mail Worker
- `CONTACT_FORM_SETUP.md` — Record of the completed Cloudflare contact architecture

The production artwork is stored in `assets/images/` and used directly throughout the responsive layouts. The homepage and trailer page embed the completed concept film from the official Everdream Film YouTube upload.

## Local preview

From this folder, start a basic local web server:

```powershell
py -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). Stop the server with `Ctrl+C`.

The site is plain static HTML, CSS, and JavaScript. It requires no build step and can later be deployed directly to Cloudflare Pages.

## Contact form architecture

The contact form posts to `/api/contact`, which maps to `functions/api/contact.js` on Cloudflare Pages:

```text
Visitor
→ contact form
→ /api/contact
→ Cloudflare Pages Function
→ CONTACT_MAILER Service Binding
→ everdream-contact-mailer Worker
→ EMAIL binding
→ real studio inbox
```

The form submits JSON asynchronously. The Pages Function is a POST-only proxy that forwards the original request through the `CONTACT_MAILER` Service Binding. The deployed `everdream-contact-mailer` Worker handles validation, honeypot rejection, and email delivery through its `EMAIL` binding. The frontend reports success only when the Worker response does.

Cloudflare configuration is complete. [`CONTACT_FORM_SETUP.md`](CONTACT_FORM_SETUP.md) records the active architecture and the remaining commit, push, automatic redeploy, and live-test steps.
