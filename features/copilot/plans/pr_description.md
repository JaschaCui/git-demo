// NOTE: Replace API names as needed: WaitForStartSignal, MoveAbs, LinearInterpolation, HANDLE_ERROR, LOG

# PR: Add ACSpl+ examples and tests (8-week)

## 中文说明
本 PR 添加了为 ACSpl+ 学习计划准备的示例、测试与文档（8 周精简路线）。主要内容包括：Week1–Week8 的示例脚本（单轴、插补、IO 流程）、错误处理库、日志规范、故障注入计划与测试结果模板。已在 feature/acspl-examples 分支完成，建议 reviewer 在仿真环境下按 tests/*.md 中的场景运行。PR 中包含若干合成测试结果样例以便参考。合并前建议 review：语法兼容性、日志/路径配置、以及在实际控制器上需要替换的 API 名称。

## English description
This PR adds ACSpl+ learning examples, tests, and documentation following the 8-week condensed curriculum. Contents: Week1–Week8 example scripts (single-axis, interpolation, IO workflows), error-handling library, logging specification, fault-injection plan and test templates. Changes are on branch feature/acspl-examples. Reviewers are recommended to run the scenarios in tests/*.md in a simulation environment. The PR includes synthetic sample test results for reviewer reference. Before merging, please check syntax compatibility, log/path settings, and controller-specific API names that must be adjusted for your runtime.

## Files included
- features/copilot/plans/acspl-plus-study-plan.md
- features/copilot/plans/scripts/week1_basics.acsp
- features/copilot/plans/lib/motion_lib.acsp
- features/copilot/plans/examples/2axis_interpolation.acsp
- features/copilot/plans/examples/io_driven_flow.acsp
- features/copilot/plans/lib/error_handling.acsp
- features/copilot/plans/tests/* (templates and plans)
- features/copilot/plans/tests/results_sample.csv

## Reviewer
- Assigned reviewer: JaschaCui
- Backup reviewer: none

## Notes for reviewer
- Each example file contains a header comment listing the abstract controller API names to be reviewed and replaced for the real controller environment.
- Do not run these scripts on production hardware without review; test first in a simulation environment.
