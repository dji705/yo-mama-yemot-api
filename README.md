# Yemot IVR adapter for Vercel

A small, dependency-free Node.js/Vercel Function that returns plain-text `read=...` responses for a Yemot HaMashiach IVR flow.

## Endpoints

- `GET /api/yemot?action=health` — plain `ok` for monitoring.
- `GET /api/yemot?action=menu` — a short Hebrew IVR menu prompt.
- `GET /api/yemot` — one random light, generic joke.
- `GET /api/yemot?category=general` — random joke from `general`.
- `GET /api/yemot?category=animals` — random animal joke.
- `GET /api/yemot?category=school` — random school joke.
- `GET /api/yemot?action=list&category=school` — concatenated category content for testing; not recommended for a long spoken call.

The handler also accepts `ApiPhoneInput`, `val`, `Digits`, or `digits` and maps `1` to general, `2` to animals, and `3` to school when no category is provided.

## Deploy to Vercel

1. Import this GitHub repository into Vercel using **Add New → Project**.
2. Use the repository root as the project root. No environment variables or third-party packages are required.
3. Deploy, then test `https://YOUR-PROJECT.vercel.app/api/yemot?action=health` and `.../api/yemot?action=menu`.
4. In the Yemot external API configuration, point the request to `/api/yemot` and pass the desired query parameters according to your IVR configuration.

## Local test

Requires Node.js 20 or later.

```sh
npm test
npm start
```

Then visit `http://localhost:3000/api/yemot?action=menu`.

## Important notes

This is a new Vercel-ready Yemot adapter, not a complete mirror of the upstream API or its joke database. It uses a small set of generic jokes rather than importing targeted insult content. The endpoint returns plain text in the `read=...` shape. Confirm the exact output grammar and navigation parameters required by your specific Yemot module before connecting it to a live phone line.
