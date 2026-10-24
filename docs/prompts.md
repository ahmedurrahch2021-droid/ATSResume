# Prompts

## Current state

**No AI or LLM calls exist in this codebase.** The resume analysis is deterministic code (`src/utils/atsScanner.ts`, `src/utils/jobMatcher.ts`, `src/utils/resumeParser.ts`). The marketing copy says "AI-assisted" in places, which is not true of the code today. Keep that wording out of new copy until an AI step exists and is documented here.

`@google/genai` is declared in `package.json` and `.env.example` lists `GEMINI_API_KEY`, but nothing imports the package.

## Rules for any future AI step

Before an AI call ships, add a section below that records:

1. **Where it runs.** A browser-side key is public. Any call that uses a secret key must run on a server, never in `src/`.
2. **Purpose** and the exact user-visible output it produces.
3. **System prompt** (full text, versioned in this file).
4. **Task prompts** and the variables they take.
5. **What the output is allowed to claim.** No pass guarantees, no certification or verification claims, no invented credentials or testimonials.
6. **Evaluation**: how output quality is checked before release.
7. **Logging policy**: whether resume content is sent to the provider, and what the privacy page says.

## Agent: none yet

Placeholder. Replace this section when an AI feature is added.

## Change log

- Initial file: documents that no AI calls exist.
