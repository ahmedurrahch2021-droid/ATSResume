# Database

ATS Resume Lab has **no database and no server**. Nothing is stored on a server. This file documents the only persisted data (browser `localStorage`) and the in-memory data models, so changes to them are deliberate.

## Conventions

- Persisted data lives only in the visitor's browser (`localStorage`). It is lost if the visitor clears site data, and it is never shared between visitors or devices.
- Storage keys use the prefix `atsresume_`. The prefix is kept on purpose; see §2.
- Every read and write of `localStorage` should be wrapped in `try/catch`, because storage can be blocked or full.

## 1. Persisted data (`localStorage`)

### `atsresume_user_account`
Written by: `App.tsx` (`handleLoginSuccess`). Read on load. Removed on sign-out.

Shape: `UserAccount` (`src/types/auth.ts`)

| Field | Type | Notes |
|---|---|---|
| `uid` | string | `guest` or `user-<timestamp>` (stub) |
| `email` | string | Entered by the visitor |
| `displayName` | string | Entered by the visitor |
| `photoUrl` | string? | DiceBear URL from the stub |
| `isLoggedIn` | boolean | Set by the stub sign-in, not verified |
| `country` | string | `Bangladesh` or `Global` |
| `isBangladeshTalentPass` | boolean | Set from the selected country only |
| `freeDownloadsCount` | number | Not enforced anywhere yet |
| `firstDownloadTimestamp` | number? | Not written anywhere yet |
| `isPaidConsultationClient` | boolean | Never set to true by code |
| `savedResumes` | `SavedResumeVersion[]` | Not written anywhere yet |

`SavedResumeVersion`: `{ id, name, updatedAt, targetRole?, data: ResumeData }`.

### `atsresume_subscribers`
Written by: `EmailSubscriptionBox.tsx`. Read before each write.

Shape: array of subscriber records (email and timestamp). Stored only in the browser, so it is not a mailing list. Do not treat it as one.

## 2. Keys kept on purpose

Renaming a storage key signs out or loses data for every existing visitor. Any rename needs a read-old-write-new migration in `App.tsx` first.

## 3. In-memory models

These are defined in `src/types/index.ts` and never persisted.

- **`ResumeData`**: contact fields, `summary`, `experience[]`, `education[]`, `skills` (languages, frameworks, toolsAndCloud, methodologies), `projects[]`, `certifications[]`, optional `languages[]`, `competitiveProgramming[]`, `customSections[]`, and optional photo and international fields.
- **`AtsScanResult`**: score, category scores, critical issues, quick wins, detected and missing keywords, and 27 `DetailedCheckItem`s across 7 categories.
- **`OrderFormData`**: the order form. Not saved, not sent. Submitting it shows an "unavailable" notice (`OrderPage.tsx`).
- **`PricingPackage`**: `starter` ($10, 24 h), `boost` ($25, 24 h), `full` ($35, 48 h).
- **`FaqItem`**: `id`, `category`, `question`, `directAnswer`, `extendedAnswer`. Source for the FAQ page and the FAQ markup approval list.

Content data (testimonials, examples, templates, job posts) is static in `src/data/mockData.ts`. Some of it is illustrative, not real. Check before quoting it as fact.

## 4. Relationships

None. The models are not linked by IDs across storage.

## 5. Indexes

None. No query layer exists.

## 6. Migrations

None. If a database is added later, it needs its own migration tooling and a section here before any schema change ships.

## 7. Assumptions

- Visitors use a browser with `localStorage` enabled. If it is blocked, the app still works but cannot save anything.
- No personal data is sent off the device by the code on this branch.
