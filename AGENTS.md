# Agent Operating Rules

## Project and Task Management (Plane)

All project and task management for this repository uses the Plane project `OpenCode Honcho Dev` (OCHONDEV).

Workflow to keep things focused:

- Every non-trivial piece of work starts as a Plane ticket before implementation begins.
- Keep tickets small and focused: one concern per ticket. If work reveals a separate root cause or task, open a new ticket instead of expanding the existing one.
- Move tickets through states as the work progresses: `Backlog` (planned) → `Todo` (ready to start) → `In Progress` (actively working) → `Done` (verified complete). Use `Cancelled` when the work is no longer needed.
- Comment on a ticket when its state changes meaningfully or findings matter: what was done, what was found, the evidence or result, and the next step or handoff.
- Dependent tickets stay in `Backlog` until their blocker is `Done`; note the dependency in the ticket description.
- Live/homelab validation is Matt-owned. When work reaches that boundary: stop, post the concrete handoff as a comment (starting state, exact steps, exact metrics/commands, expected result, disproof result), and wait for his recorded results.

## Git Management

- Never work on the `main` branch. Development happens on the local tracking branch (`local`), which tracks the upstream plugin while maintaining its own changes.
- At the start of a session: `git fetch origin && git fetch upstream`, then integrate updates into the working branch before starting work — merge `origin/main` if it moved, and integrate new `upstream/main` commits if the fork has not caught up. Report the integration (merge commit, conflicts, test status) before proceeding with other work.
- Commit message pattern:

  ```text
  <type>/<label> - <One sentence summary>
  * <Bullet details>
  ```

  Types: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`. One-sentence summary; bullets only when there is more than one notable change.
- Commit changes before moving on to another ticket item.

## Workspace Boundaries

- Do not read, write, or move files outside the project tree. When scratch space or a scratch environment is needed, use a temporary container (podman) instead of touching host paths.

## Code and Testing Conventions

- Follow existing repo code conventions and best practices; mimic the style of neighboring code.
- Follow the testing conventions below. Never duplicate an existing test — extend or reuse it. Keep tests minimal and focused on the behavior under test.
- When uncertain about an OpenCode plugin implementation (hooks, plugin API, tool definitions), search the OpenCode docs (https://opencode.ai/docs) before implementing.

### Test execution

- Builds and tests run only inside the podman container via `scripts/test-container.sh`. Never run bare `bun test` or `bun run build` on the host: the agent shell carries live `HONCHO_*` env vars and `~/.honcho` config that leak into the suite.
- Environment effect simulations (e.g. ambient `HONCHO_*` vars) run inside the container by passing the vars explicitly: `scripts/test-container.sh -e HONCHO_API_KEY=test ...`. Never simulate by running on the host.
- The container runs with `--network none` and an isolated HOME. Tests must stay deterministic: mocked I/O only, no live Honcho, no real inference, no timing assumptions.
- New tests must pass in the container before committing.
