Merge instructions for PR #1

This file is added to the feature branch so the merge steps appear in the PR diff and can be reviewed/used by a person with merge rights.

---

Recommended one-line gh CLI command (run as a user with repo write permission):

gh pr merge 1 --squash --delete-branch --body-file features/copilot/plans/pr_description.md

Notes:
- Replace `1` with the PR number if it differs. This command will squash all commits from the feature branch into a single commit on main, use the contents of features/copilot/plans/pr_description.md as the merge commit message, and delete the feature branch after merging.
- Run this from a machine with GitHub CLI (gh) installed and authenticated as a user with write/merge permissions on the repository.
- Alternative (GitHub web UI): Open https://github.com/JaschaCui/git-demo/pull/1 -> Click "Merge pull request" -> Select "Squash and merge" -> Edit/confirm the commit message -> Confirm -> Optionally Delete branch.

Security note:
- Before merge, confirm CI checks have passed and reviewers have approved.
- enable_register_writes remains FALSE by default; do not flip to TRUE until simulation verification and explicit authorized review have been completed.
