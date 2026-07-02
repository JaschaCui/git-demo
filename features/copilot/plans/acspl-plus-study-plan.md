# ACSpl+ 精简 8 周学习计划（面向工程应用与维护）

版本：1.0
作者：GitHub Copilot（代写）
目标读者：有编程基础、希望在工作中使用并维护 ACSpl+ 控制工程的工程师
总时长：8 周，每周 8–10 小时（合计约64–80小时）
交付物：示例脚本、测试用例、故障注入脚本、需求/测试/使用手册模板、最终项目代码与测试报告

---

## 执行要点（直接结论）
- 采用理论+练习并重的方式，每周包含 1–2 个动手练习（从语法到综合流程）。
- 侧重工程可靠性：异常处理、测试用例、故障注入与恢复流程是重点。
- 你目前仅有文档/理论环境，但工作中会接触实际 ACS 控制器测量晶圆；计划中包含与硬件对接前的仿真/检查步骤与注意事项。

---

## 周计划（每周目标 + 练习）

第 1 周：入门与环境准备（8–10h）
- 目标：理解 ACSpl+ 的定位与基本语法结构，搭建阅读/编辑环境。
- 学习任务：阅读 ACS 官方语言参考与快速入门、熟悉示例工程结构、掌握常见命名与注释风格。
- 练习：编写并运行 3 个极简脚本（变量、条件、循环）。
- 交付：scripts/week1_basics.acsp（示例脚本）

第 2 周：数据与控制结构、模块化（8–10h）
- 目标：掌握变量作用域、数组/结构、子程序/函数、参数传递与返回约定。
- 学习任务：函数/子程序调用约定、脚本组织方式、代码风格规范。
- 练习：实现通用运动函数库接口（MoveAbs、MoveRel、WaitDone）。
- 交付：lib/motion_lib.acsp

第 3 周：单轴运动与运动参数（8–10h）
- 目标：理解单轴命令、速度/加减速/位置偏移、命令同步与到位检测。
- 学习任务：绝对/相对运动、速度曲线参数、停止行为（软停/急停）与反馈信号读取。
- 练习：实现并仿真单轴往返运动脚本，收集并分析位置信息日志。
- 交付：tests/week3_axis_tests.md

第 4 周：插补与多轴协调（8–10h）
- 目标：掌握线性插补/圆弧插补的使用、插补坐标系与误差处理。
- 学习任务：插补命令语法、插补速度与加减速、坐标转换、插补完成/超时判断。
- 练习：实现两轴线性插补路径与简单圆弧，记录目标/实际轨迹（仿真或日志）。
- 交付：examples/2axis_interpolation.acsp

第 5 周：IO、事件和安全（8–10h）
- 目标：掌握数字/模拟 IO 的读写、事件触发、限位与急停逻辑。
- 学习任务：IO 映射约定、去抖与滤波、事件驱动脚本结构、紧急停止处理策略。
- 练习：实现基于 IO 触发的拾取-移动-放置流程（含异常处理）。
- 交付：examples/io_driven_flow.acsp

第 6 周：错误处理、日志与上位机接口（8–10h）
- 目标：实现健壮的错误检测、记录与恢复策略，并了解常见上位机协议（OPC/Modbus 若适用）。
- 学习任务：错误码约定、异常分级（可恢复/不可恢复）、日志格式化与轮转、上位机交互模式。
- 练习：为已有模块添加错误处理与日志，编写一个简单的状态查询接口示例（仿真）。
- 交付：lib/error_handling.acsp、docs/logging_spec.md

第 7 周：测试驱动与故障注入（8–10h）
- 目标：制定测试用例、实现自动化/手动测试流程，并通过故障注入验证恢复逻辑。
- 学习任务：测试用例设计（功能/边界/故障注入）、断言与验证点、测试运行记录格式。
- 练习：运行以下故障注入场景并记录：传感器不上报、目标位置偏移、IO 抖动、运动命令超时。
- 交付：tests/fault_injection_plan.md、tests/results_week7.csv

第 8 周：整合项目与交付（8–10h）
- 目标：实现并交付一个小型工程：两轴插补 + 工件到位检测 + 急停与恢复流程；生成最终文档。
- 学习任务：工程打包规范、配置管理（参数文件）、部署/升级注意事项。
- 练习：整合之前模块进行联调（仿真），准备部署检查清单与维护手册。
- 交付：project/final_demo（含代码、测试报告与使用手册）

---

## 每周典型日程（建议）
- 周一：阅读与概念学习（2h）
- 周二：示例代码阅读与理解（1.5h）
- 周三：实现与编码（2.5h）
- 周四：仿真/测试与日志分析（1.5h）
- 周五：总结/记录/准备下周任务（0.5–1h）

---

## 代码示例（可直接作为练习起点）
以下示例为通用伪 ACSpl+ 代码示例，需按你手头的 ACSpl+ 语法做微调：

示例：最小单轴绝对移动（MoveAbs）

```acspl
// file: examples/move_abs.acsp
// 描述：将轴 AXIS1 移动到目标位置 target_pos
function MoveAbs(axis, target_pos, speed)
  // 设置速度
  SET_VELOCITY(axis, speed)
  // 发送绝对移动命令
  MOVE_ABSOLUTE(axis, target_pos)
  // 等待到位、超时或错误
  IF NOT WaitForDone(axis, 5000) THEN
    LOG("ERROR: Axis " + axis + " did not reach position")
    RETURN FALSE
  ENDIF
  RETURN TRUE
endfunction

// 用例
var ok = MoveAbs("AXIS1", 1000, 50)
if ok then
  LOG("Move completed")
else
  LOG("Move failed")
endif
```

示例：两轴线性插补（伪代码）

```acspl
// file: examples/linear_interpolation.acsp
// 线性插补：从 (x0,y0) 到 (x1,y1)
function LinearMove(x0,y0,x1,y1,feed)
  // 配置插补参数
  SET_FEED(feed)
  GOTO_XY(x1, y1)
  IF NOT WaitForInterpolationDone(10000) THEN
    LOG("Interpolation timeout or error")
    RETURN FALSE
  ENDIF
  RETURN TRUE
endfunction

LinearMove(0,0,100,50,200)
```

示例：简单 IO 触发流程

```acspl
// file: examples/io_driven_flow.acsp
WHILE TRUE
  IF ReadDI("START_SENSOR") THEN
    // 确认去抖
    WAIT_MS(50)
    IF ReadDI("START_SENSOR") THEN
      // 执行拾取流程
      if NOT MoveAbs("AXIS1", pick_pos, 50) then
        LOG("Pick move failed")
        HANDLE_ERROR()
      endif
      // 放置
      MoveAbs("AXIS2", place_pos, 60)
    ENDIF
  ENDIF
  WAIT_MS(100)
ENDWHILE
```

---

## 测试用例与故障注入示例

每个主要功能模块都应包含 3 类测试：正向功能测试、边界测试、故障注入测试。

示例：MoveAbs 模块测试用例
- TC1 (功能): 目标位置在安全范围内（期望：成功到位）
- TC2 (边界): 目标位置等于软限位（期望：成功或被拒绝并记录）
- TC3 (故障注入 - 传感器丢失): 在移动过程中模拟位置反馈中断（期望：触发超时并进入安全停机）

故障注入脚本（伪代码）

```acspl
// file: tests/fault_injection_sim.acsp
// 场景：在运动中断开位置传感器
SpawnThread(
  WAIT_MS(200)
  DisableSensor("AXIS1_POSITION")
  LOG("Sensor disabled for AXIS1")
  WAIT_MS(1000)
  EnableSensor("AXIS1_POSITION")
  LOG("Sensor re-enabled for AXIS1")
)
// 触发运动
MoveAbs("AXIS1", 2000, 60)
// 验证：运动应检测到传感器异常并按预期处理
```

测试记录模板（CSV 列）：TestID, Module, Scenario, Steps, Expected, Actual, Result, Notes, Timestamp

---

## 文档模板（需求 / 测试 / 使用手册 快速模板）

1) 需求文档模板 (docs/requirements.md)
- 项目名称：
- 版本：
- 目标：
- 功能列表：
  - 功能 1 描述
  - 功能 2 描述
- 性能/精度要求：
- 安全约束：
- 接口约定（IO、网络）:

2) 测试计划模板 (docs/test_plan.md)
- 测试范围：
- 测试环境：
- 测试用例列表：
  - TC ID, 描述, 前置条件, 步骤, 期望结果
- 故障注入场景：

3) 使用与维护手册 (docs/user_manual.md)
- 简介
- 运行前检查清单（电源、编码器、限位、IO 映射）
- 部署步骤
- 常见问题与诊断步骤
- 升级/回滚流程

---

## 交付清单（每周交付）
- Week1: scripts/week1_basics.acsp
- Week2: lib/motion_lib.acsp
- Week3: tests/week3_axis_tests.md
- Week4: examples/2axis_interpolation.acsp
- Week5: examples/io_driven_flow.acsp
- Week6: lib/error_handling.acsp, docs/logging_spec.md
- Week7: tests/fault_injection_plan.md, tests/results_week7.csv
- Week8: project/final_demo (代码+报告+手册)

---

## 评估标准（验收）
- 能用 ACSpl+ 实现并解释常见运动指令与插补原理
- 在仿真/文档条件下，能写出包含异常处理的模块并给出测试用例
- 能根据测试与故障注入记录改进恢复逻辑并形成文档

---

如果你确认该版本，我将把它作为 `features/copilot/plans/acspl-plus-study-plan.md` 提交到仓库 `JaschaCui/git-demo` 的默认分支，提交信息为 "Add ACSpl+ study plan (8-week)"。如果需要我现在就提交，请确认；若需要微调（例如用英文、或加入更多示例），请指出具体修改点。
