# Cloud Run / AI Studio startup

## Resolved failure

The supplied `resumerevive.zip` used `"start": "node server.ts"` with extensionless TypeScript imports. Running it reproduced `ERR_MODULE_NOT_FOUND` for `server/geminiDiagnostic` before HTTP startup. Cloud Run consequently reported that the container never listened on `PORT=3000`.

The build now compiles the server into **`dist-server/server.mjs`**. `npm start` runs this JavaScript entrypoint. It binds to **`0.0.0.0`** and the supplied **`PORT`** (3000 by default). Gemini is loaded only when a configured online request needs it; website startup does not require a Gemini key.

## Build and run

Use Node 24 (the Dockerfile pins the Node 24 family):

```text
npm ci
npm run build
npm start
```

- `npm run build` and a direct `vite build` both generate the frontend, 12 prerendered routes and the Node server bundle.
- `dist/` and `dist-server/` are generated build artifacts; include both in the runtime image.
- `npm start` requires neither `tsx` nor TypeScript at runtime. The build stage does require development dependencies.
- `npm run dev` uses Express with Vite middleware for local development.
- `npm run preview` previews static files only. Use `npm start` to exercise the API.
- `GET /healthz` returns `200` with `{"status":"ok"}`.
- Existing public routes serve their own prerendered HTML without an added trailing-slash redirect. Asset requests are served from `dist/`.

## Publish through AI Studio / Cloud Run

Import the corrected source files, including `Dockerfile`, `server/`, `server.ts`, `scripts/build-server.ts`, `vite.config.ts` and `package.json`. Keep the verified `package-lock.json` and `bun.lock` supplied with this project.

The included multi-stage Dockerfile installs build dependencies, runs `npm run build`, installs production dependencies into the runtime stage and starts `npm start` as the non-root `node` user. Runtime secrets are not copied into the image.

If the deployment interface has explicit command overrides:

| Setting | Value |
| --- | --- |
| Build | `npm run build` |
| Start / container command | `npm start` (or use the Dockerfile's default) |
| Container port | `3000`, or the port provided by Cloud Run |
| Bind address | `0.0.0.0` (already in the application) |
| Health endpoint | `/healthz` |

Remove an old `node server.ts` command override. A new image/revision must be built; rerunning the failing old image does not include these fixes. Cloud Run supplies `PORT`, so do not hard-code a conflicting port in the deployment command.

After publishing, check `/healthz`, `/country-guides#bangladesh`, `/suite` and `/cover-letter` on the deployed URL. Logs should include `ATS Resume Lab listening on 0.0.0.0:<port> (production)`.

## Optional online coaching

The owner selected Gemini's free tier. With no key, the coach uses local guidance. For online coaching, configure these runtime environment/secrets in AI Studio / Cloud Run:

- `GEMINI_API_KEY`: server-only key from the chosen Google project. To use free API quota, select a project shown as **Free Tier** in AI Studio. The legacy `GOOGLE_GENAI_API_KEY` alias is also supported.
- `GEMINI_MODEL`: exact model ID available to that project; the default is `gemini-3.8-flash`. This stable endpoint and structured-output support were verified against [Google's model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash) on 29 October 2026. Actual project access still requires a live request with the operator's credentials.

There is no paid-tier application gate. The former `GEMINI_DATA_POLICY` setting has been removed and any old deployment value is ignored. Google's project settings determine billing and quota; this application cannot turn a paid project into a free one. Google currently lists standard Gemini 3.8 Flash input/output as free of charge on its [Free Tier](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.8-flash), subject to available project quota. Requests stop at provider limits and show local guidance; the application does not upgrade billing, rotate keys or switch providers.

Free-tier technical support does not change [Google's terms](https://ai.google.dev/gemini-api/terms): unpaid inputs/outputs may be used for improvement and human review, personal/sensitive/confidential information must not be submitted, and API clients serving the UK, EEA or Switzerland require Paid Services. These restrictions prevent promising a worldwide personal-CV AI service on unpaid quota. Local checking/editing/downloads remain available worldwide.

`GET /api/gemini/status` reports whether online coaching is configured and the instance allowance. It is not a live provider availability probe. Missing configuration, unavailable models, provider errors or quotas retain the original text and supply labelled local guidance.

The pilot's server counters enforce 10 attempts per connection per UTC day and 100 attempts per instance, with a 10-second connection cooldown and two concurrent requests. `AI_CLIENT_DAILY_LIMIT` and `AI_INSTANCE_DAILY_LIMIT` configure the daily counts. Counters reset on restart and are not shared between instances. They are not a durable worldwide per-person entitlement; use shared counters and an identified client before promising such an allowance at scale.

## Verification commands

```text
npm run lint
npm run test:resume
npm run build
npm run test:server
npm run test:browser
```

The server tests launch the compiled production entrypoint from another directory, without AI credentials or a TypeScript loader. Browser tests use synthetic data and mocked AI responses; they do not send resumes to Google. Local verification does not establish that a new Cloud Run revision has been deployed or that a particular Gemini model is available to the operator's project.

Verified on 29 October 2026: TypeScript, production build, **25 document/parser/service tests**, **11 server tests** and **50 browser tests** passed. A clean production-dependency installation was also copied outside the repository, with optional `tsx`/TypeScript peers excluded and Node's native type stripping disabled. The compiled entrypoint started on **`0.0.0.0:3000`**; health, prerendered routes and the missing-key guidance response passed. That check ran on Windows/Node 24; Docker and Cloud Run were not available in this session, so it is not a Linux container or live deployment result.

After the owner's free-tier configuration request, TypeScript and the production rebuild passed again, along with **12 server tests** (including key-only activation without a paid flag) and all **6 focused coach browser tests**. The earlier 50-test full browser report is preserved at `.qa/browser-report-cloudrun-full.json`; the focused follow-up is `.qa/browser-report.json`.
