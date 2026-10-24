# Error Handling

There is no server, so there are no HTTP status codes or API error responses. This file describes how errors are handled today in the browser, and the standard to follow when a server is added.

## Principles

1. Tell the visitor what went wrong in plain words, and what they can do next.
2. Never show a fake success. If something did not happen, say so.
3. Log enough detail to debug, but never log resume content or personal data.
4. Do not let one component's error blank the whole site.

## Current behaviour

| Situation | Where | What happens |
|---|---|---|
| Unsupported or failed resume parse | `SuitePage.tsx` | `alert('Error parsing document: ...')` |
| Invalid photo type | `PhotoUploader.tsx` | `alert('Please upload a valid image file ...')` |
| Online payment | `OrderPage.tsx` | Shows a notice that payment is not available yet. Creates nothing. |
| Invalid sign-in form | `AuthModal.tsx` | Submit does nothing if the email has no `@` or the name is empty |
| `localStorage` blocked or full | `App.tsx`, `EmailSubscriptionBox.tsx` | Caught and ignored. The feature still works without saving. |
| Unknown URL | `routes.ts` | Shows the home page. No 404 yet. |
| Render error in any component | — | **No error boundary.** One thrown error blanks the whole app. |

`alert()` is used for user-facing errors. It blocks the page and cannot be styled, so replace it with inline messages when the surrounding UI is rebuilt.

## Gaps to fix

1. **Add a root error boundary** (`componentDidCatch` or a library) with a "Reload" action and a link to contact. Without it, any unexpected exception leaves a blank page.
2. **Show a real 404** for unknown paths instead of the home page. Search engines should receive a 404 status, which needs the host's support for an error page.
3. **Replace `alert()`** with inline messages for parse and upload errors.
4. **Tell the visitor when the resume parser finds no text**, instead of scoring an empty document. Current PDF and DOCX parsing may return no text (see `architecture.md` §8).

## Standard for a future server

When a backend is added, use this shape.

### Custom error classes

| Class | HTTP status | Use |
|---|---|---|
| `ValidationError` | 400 | Input fails a rule; include the field name |
| `AuthenticationError` | 401 | Missing or invalid session |
| `ForbiddenError` | 403 | Signed in, but not allowed to access this record |
| `NotFoundError` | 404 | Record does not exist or is not visible to this user |
| `ConflictError` | 409 | Duplicate or stale update |
| `PaymentRequiredError` | 402 | Payment not confirmed for this action |
| `RateLimitError` | 429 | Too many requests |
| `InternalError` | 500 | Unexpected; log the stack, return a generic message |

### Standard response shape

Success:
```json
{ "ok": true, "data": { } }
```

Error:
```json
{ "ok": false, "error": { "code": "VALIDATION_ERROR", "message": "Email is required.", "field": "email" } }
```

`message` is safe to show to a visitor. Never return stack traces, SQL, or provider error text.

### Central handler

One middleware maps every thrown error to the shape above. Unknown errors become `500 INTERNAL_ERROR` with a generic message and a request ID.

### Logging

- Log: request ID, route, status, duration, error class and stack for 5xx.
- Never log: resume text, email content, payment details, or full request bodies.
- Keep logs for a fixed period and state it in `security.md`.

### Client side (future)

Wrap every `fetch` in one helper that parses the error shape, shows `message`, and retries only idempotent requests once.
