<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep HITL payload review and retrigger orchestration in the escalation route; call the external SAP retrigger endpoint before marking the queue row approved, so a failed request remains reviewable.
- Read the external audit ledger through the signed-in browser client only; never expose audit writes in the UI, and let the external database's access policies determine readable rows.
