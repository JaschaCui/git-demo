Enable register writes procedure

This document explains how to safely enable register writes for the ACSpl+ examples in this repo.

Default: register writes are disabled in scripts (enable_register_writes := FALSE) and SafeCOEWRITE only logs intended register writes.

Safe enable steps:
1) Run full simulation tests with enable_register_writes := FALSE. Use the tests in features/copilot/plans/tests/ and confirm all TC pass. The detailed synthetic results are at features/copilot/plans/tests/results_detailed.csv.
2) If simulation passes and reviewers approve, edit features/copilot/plans/enable_register_writes.flag and change the single line to:
   TRUE
   Commit the change to the feature branch and push.
3) Update the script(s) to explicitly set enable_register_writes := TRUE in acspl_plus_reference.acsp (or other example files you intend to run) in a separate commit, and include in the commit message a reference to the PR that approved the change.
4) Only an authorized operator should run scripts that perform real COEWRITE operations on hardware. Prefer a supervised dry-run on hardware in a safe mode first.

Notes:
- The flag file is a repository-level intent marker. The scripts themselves still require manual toggling (enable_register_writes variable) because runtime file reads are not universally supported across controller runtimes.
- Best practice: perform a staged rollout:  simulation -> supervised dry-run -> small-scale hardware test -> full deployment.
