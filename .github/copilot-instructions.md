## How to help in this repository

This file gives concise, actionable guidance for AI coding agents working on the gmero-blog repository.

1. Public repository — secrets and private data

- This repository is public. Never hardcode secrets or private credentials in code, commits, or generated files. Use environment variables, `.env` files (gitignored), or GitHub Secrets instead.
- Examples: `scripts/deploy-cos.ts` and `scripts/doge-cdn-refresh.ts` rely on cloud credentials — read them from process.env or GitHub Actions secrets.

2. Language policy (important)

- English is the default language for all comments, code, documentation, commit messages, and generated Markdown.
- If the user's incoming message is written in another language and the user did not explicitly request English, respond in the language the user used when asking the question.
- If the user explicitly requests a specific language for responses or files, follow that request.

3. When to create or modify files

- If the user has not explicitly requested file creation or modification, do NOT create or change repository files without asking the user first. Request confirmation before any non-trivial change to the repo tree (new files, edits to configuration, CI workflows, or documentation).

4. Safety and behavioral rules for the agent

- Respect the user's privacy: never attempt to locate secrets in the repo or propose exposing them. If code appears to reference a secret file, instruct the user to provide values via secure channels (env, GitHub Secrets).
- Keep changes minimal and localized. Provide a short summary of what you will change and why, then ask for permission when required.
- Prefer concrete edits with clear rollbacks (single commits, small PRs). When in doubt, propose code changes and ask the user to approve.

- During the conversational workflow you may propose reasonable updates to this `/.github/copilot-instructions.md` (for example: clarifications, added examples, or small fixes). Always present such suggestions to the user and obtain explicit approval before making any modifications to this file.

5. Ask for feedback

After making or proposing changes, summarize what you changed and how you verified it. Ask the user if anything is unclear or if they want the instructions adjusted.
