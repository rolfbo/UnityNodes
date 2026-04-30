# AMAs

This folder captures Unity Network / U-Network AMAs (Ask-Me-Anything sessions hosted by Josh and the team). Each AMA gets:

- `YYYY-MM-DD_ama-summary.md` — key learnings, network scale numbers, status of each workstream, decisions/announcements
- `YYYY-MM-DD_ama-promises.md` — every promise the team made during the session, with who promised, what, and the expected outcome (mirrors the format of `telegram/tasks/active.md`)
- `YYYY-MM-DD_ama-questions.md` — all questions asked during the AMA, grouped by topic, with the team's answer summarized
- `YYYY-MM-DD_ama-transcript.md` *(optional)* — the raw transcript text, kept verbatim for reference

## Why a separate folder

AMAs are a denser source of "team voice" than the daily Telegram traffic. One AMA usually contains:

- Several roadmap commitments — these flow into `telegram/tasks/active.md`
- Many recurring questions — candidates for `telegram/faq/`
- Approved phrasing for tricky topics — candidates for `telegram/team-answers/`
- Forward-looking signals (renames, partnerships, new tasks) that don't appear in routine chatter

Keeping AMAs separate from `conversations/` makes it easy to find the canonical source for any commitment ("the team said X in the April 28 AMA").

## Workflow

1. Drop the AMA transcript into `YYYY-MM-DD_ama-transcript.md`.
2. Extract learnings → `_ama-summary.md`.
3. Extract every promise → `_ama-promises.md` AND mirror the entries into `telegram/tasks/active.md` with a back-link.
4. Extract questions → `_ama-questions.md`. If a question recurs across AMAs/Telegram, promote it into `telegram/faq/<topic>.md` with the approved answer in `telegram/team-answers/<topic>.md`.
