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
- `contact.html` — Contact information and Cloudflare-ready form
- `css/styles.css` — Shared responsive design system
- `js/main.js` — Mobile navigation and current-year behavior
- `functions/api/contact.js` — Validation-only Cloudflare Pages Function

The production artwork is stored in `assets/images/` and used directly throughout the responsive layouts. The trailer page uses the approved thumbnail but intentionally contains no temporary video URL; its HTML comment marks where the real player can be connected later.

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
→ verified email delivery
→ real studio inbox
```

The public form is currently presented in a pre-launch state. Its fields remain in place but are disabled until verified email delivery is connected; change `data-form-mode="prelaunch"` to `data-form-mode="active"` in `contact.html` only after that integration is ready. The function validates submissions and rejects obvious honeypot entries, but it deliberately does not yet send email, log messages, or store personal information. Server-side Cloudflare Turnstile validation can be added where the code comments indicate. The private recipient and any credentials must be configured as protected Cloudflare environment bindings, never committed to this repository.
