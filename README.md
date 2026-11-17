# NoteHub · Homework 7 (Next.js App Router)

A separate project built from the accepted `06-notehub-nextjs` homework. `05-notehub` and `06-notehub-nextjs` are unchanged.

## Setup

1. `npm install`
2. Add `.env.local` to the project root:
   `NEXT_PUBLIC_NOTEHUB_TOKEN=<your NoteHub API token>`
3. `npm run dev`
4. `npm run build` and `npm run lint` before deploying.

Do **not** commit `.env.local`. On Vercel, set `NEXT_PUBLIC_NOTEHUB_TOKEN` for Production and Preview. Because this is a `NEXT_PUBLIC_*` variable, its value is included in the browser bundle; use a dedicated educational token only.

## Routes

- `/` — welcome page
- `/notes/filter/all` — all notes (no `tag` query parameter)
- `/notes/filter/Todo`, `/Work`, `/Personal`, `/Meeting`, `/Shopping` — filtered notes
- `/notes/:id` — full note details on a direct load/refresh, intercepted modal when opened via a Link from the list
- other paths — 404 page

The sidebar is `app/notes/filter/@sidebar/default.tsx` and is rendered from the filter `layout.tsx`.
The root layout accepts an `@modal` slot and renders it alongside the page. `app/@modal/default.tsx` and the catch-all clearing route intentionally return `null`.

## Required checks

1. Open `/notes/filter/all`, click each tag, verify the URL and notes change **without full page reload**.
2. Switch pages and search notes (tag filter must persist).
3. Click **View details** from the notes list: the modal should open **over the list**, with the URL changed to `/notes/:id`.
4. Close the modal with its X, Escape and backdrop click; the previous filter page must return.
5. Open the **same** `/notes/:id` URL directly in a fresh browser tab or refresh it: full page details, **no modal**.
6. Try an invalid URL and verify the 404 text.
7. Try creating and deleting a note.

The Next.js files preserve the expected `app`, `components`, `lib`, and `types` separation.
