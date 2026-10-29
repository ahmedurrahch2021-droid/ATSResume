# Evaluation & Upgrade Plan: Multi-Turn Gemini AI Assistant

Comprehensive evaluation of the existing AI Writing Coach and implementation plan to upgrade to a **full multi-turn Gemini chat interface** with scrollable message history, quick follow-up shortcut chips, inline 1-click insertion, and a global floating widget accessible across all pages.

---

## Part 1: Evaluation of Current AI Help

### What Works Well Today
1. **Verified Evidence Grounding**: The assistant is strictly anchored to Grade A/B sources (`src/data/evidence.ts`), preventing fake statistics (e.g. debunked "75% ATS rejection" claims).
2. **Strict Fact-Preservation**: Adheres to `docs/AI_ASSISTANCE.md`—it preserves candidate truth and asks clarifying questions for missing metrics rather than hallucinating achievements.
3. **Regional Country Profiles**: Dynamically adjusts spelling (American vs. British) and anti-discrimination/EEO rules for 7 global regions (US, UK, Canada, Australia, EU, Gulf, Bangladesh).
4. **Server-Side Security & Rate Discipline**: Secure server-side execution with a 10-per-user daily allowance and deterministic offline fallbacks.

### Current Gaps & How to Make It Better
1. **Single-Turn Limitation**: Currently, each diagnosis is a one-shot Before/After card. Users cannot have an ongoing conversation (e.g. *"Can you make this shorter?"*, *"I was a junior engineer, tone down the leadership wording"*, or *"Give me 3 alternate options"*).
2. **Confined to Editor Pages**: The assistant only lives inside the Resume Workspace and Cover Letter Studio. Visitors scanning resumes on `/resume-checker`, exploring templates on `/resume-templates`, or evaluating pricing on `/pricing` cannot ask questions or get troubleshooting help.
3. **No Chat History**: Previous suggestions disappear when another query is run, preventing users from reviewing past recommendations.

---

## Part 2: Proposed Upgrade Plan

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                DUAL-MODE ACCESS INTERFACE                                   │
│                                                                                             │
│  [GLOBAL FLOATING WIDGET]                                 [WORKSPACE EMBEDDED DOCK]         │
│  • Available on all pages (Home, Checker, Pricing...)     • Docked in Resume & Cover Letter │
│  • Answers ATS questions, template advice & support       • Context-aware with live flaws   │
│                                           │                                                 │
│                                           ▼                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                            SCROLLABLE MULTI-TURN CHAT THREAD                          │  │
│  │                                                                                       │  │
│  │  👤 User: "Help me rewrite this bullet: Responsible for database queries"            │  │
│  │                                                                                       │  │
│  │  🤖 Gemini Coach:                                                                     │  │
│  │     "Optimized PostgreSQL query execution plans, reducing p99 latency 38%..."         │  │
│  │     [⚡ Apply to Resume] [📋 Copy]                                                    │  │
│  │                                                                                       │  │
│  │  [Chips]: [Make it punchier] [Give 3 variants] [Tone down seniority] [Explain ATS]   │  │
│  └────────────────────────────────────────┬──────────────────────────────────────────────┘  │
└───────────────────────────────────────────┼─────────────────────────────────────────────────┘
                                            │ POST /api/gemini/chat
                                            │ { messages: [...], activeText, targetCountry }
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              SERVER-SIDE GEMINI MULTI-TURN PROXY                            │
│                                                                                             │
│  • Model: gemini-3.8-flash (Free tier, fast, high reasoning)                                │
│  • Full conversation history passed to ai.models.generateContent                            │
│  • System instruction maintains regional norms, evidence library & anti-slop guidelines     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features to Implement

### 1. Multi-Turn Conversation Thread
- Scrollable message history preserving user messages and assistant responses within the session.
- Allows natural back-and-forth iteration (*"Now adapt it for a startup"*, *"What if I don't know the exact percentage?"*).
- Clear chat button to start a fresh consultation at any time.

### 2. Inline 1-Click Document Insertion
- Whenever the AI proposes an edited bullet, summary, or letter paragraph, an inline **[Apply to Document]** button appears directly beneath the suggestion.
- Automatically inserts or replaces the relevant section in the candidate's active draft with full undo support.

### 3. Interactive Quick-Action Follow-Up Chips
After each AI message, one-tap prompt chips appear:
- ⚡ **"Make it punchier"** (concise, high-impact phrasing)
- 🎲 **"Give 3 variants"** (gives candidate conservative, balanced, and high-growth options)
- 📉 **"Tone down seniority"** (calibrates for entry/mid-level)
- 🔍 **"Explain ATS mechanism"** (explains why Workday/Greenhouse parsers prioritize this wording)

### 4. Global Floating Widget (Across All Pages)
- A discreet floating launcher button in the bottom-right corner of public pages.
- Can answer ATS diagnostic questions, explain template choices, and assist users anywhere on the site.
- In the Resume Workspace and Cover Letter Studio, it seamlessly docks into the editor layout.

---

## Implementation Steps

1. **Server-Side Multi-Turn API Endpoint (`server/geminiDiagnostic.ts` & `server.ts`)**:
   - Create `POST /api/gemini/chat` supporting message history (`role: 'user' | 'model'`).
   - Grounded in `src/data/evidence.ts`, country norms (`src/types/countryNorms.ts`), and honesty rules.
2. **Unified Chat Component (`src/components/ai/GeminiChatWidget.tsx`)**:
   - Scrollable message stream, typing indicator, quick follow-up chips, and inline 1-click insert actions.
   - Embeds country selector and daily free credit counter (10/10 free per day).
3. **Global Layout Integration (`src/App.tsx`)**:
   - Mount floating launcher accessible across all routes.
   - Synchronize with workspace docked mode on `/suite` and `/cover-letter`.
4. **Verification & Testing**:
   - Validate full test suite (`npm run test:resume`), `compile_applet`, and `lint_applet`.
