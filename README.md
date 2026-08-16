# Grigorii Barabanov — Portfolio

Personal portfolio site: React 19 + TypeScript + Vite, Framer Motion animations, Lenis smooth scrolling, custom cursor, EN/RU localization.

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Where the content lives

All text on the site is data-driven. Every localized string is an object `{ "en": "...", "ru": "..." }` — edit both languages in one place.

| File | What's inside |
|---|---|
| `src/data/profile.json` | Name, roles, tagline, about paragraphs, stats, contacts, education, spoken languages, CV path, photo path |
| `src/data/experience.json` | Jobs (Navio, VK, Yandex) with highlights, tags, periods + teaching/mentoring activities. Highlights with `"backend": true` get the green "backend" badge |
| `src/data/skills.json` | Skill categories as tag lists with optional notes (shown on hover). Categories with `"featured": true` are visually highlighted |
| `src/data/media.json` | Media galleries per company (see below) |
| `src/data/ui.json` | All UI strings: nav, buttons, form labels, placeholders |

## Adding your photo

Drop your photo at `assets/photo/me.jpeg`. Done — the placeholder disappears automatically.
To use a different name/format, change the `"photo"` field in `src/data/profile.json`.

## Adding media to experience blocks

Put files into the company folder (`assets/navio/`, `assets/vk/`, `assets/yandex/`) and register them in `src/data/media.json`. The `src` path is relative to the `assets/` folder:

```json
{
  "navio": [
    { "type": "image", "src": "/navio/teleop-ui.png", "caption": { "en": "Teleoperations UI", "ru": "Интерфейс телеопераций" } },
    { "type": "video", "src": "/navio/demo.mp4", "caption": { "en": "Live demo", "ru": "Живое демо" } }
  ]
}
```

`caption` is optional. While a company's list is empty, the card shows a neat "media coming soon" placeholder.

## Updating the CV file

Replace `assets/cv/Grigorii_Barabanov_CV.pdf`. If the filename changes, update `"cv"` and `"cvFileName"` in `src/data/profile.json`.

## Contact form (email delivery)

The form sends messages via [EmailJS](https://www.emailjs.com) — free tier, no backend needed:

1. Sign up and connect your mailbox (Email Services → Add New Service).
2. Create a template (Email Templates → Create New Template) using variables `{{from_name}}`, `{{from_email}}`, `{{message}}`.
3. Copy `.env.example` to `.env` and fill in `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
4. Restart the dev server.

Until the keys are configured, the form gracefully falls back to opening the visitor's email client with the message pre-filled (mailto), so it never dead-ends.

## Languages

The site defaults to English; the EN/RU switch is in the header. The choice is stored in `localStorage`.
