# Week3 Axis Tests

This document lists test cases for single-axis motion (MoveAbs / MoveRel) and how to record results.

Test cases

TC1: MoveAbs within range
- Module: MoveAbs
- Precondition: Axis configured, no alarms
- Steps: MoveAbs("AXIS1", 500, 50)
- Expected: Axis reaches 500 within timeout, no alarms

TC2: MoveAbs to soft limit
- Module: MoveAbs
- Steps: MoveAbs("AXIS1", SOFT_LIMIT_POS, 40)
- Expected: Move is either denied or completes safely per controller config

TC3: MoveRel boundary
- Module: MoveRel
- Steps: MoveRel("AXIS1", -100, 30) when at position 50
- Expected: Either move rejected or position clamps to safe range

TC4: Sensor failure during move (fault injection)
- Module: MoveAbs
- Steps: Start MoveAbs("AXIS1", 2000, 60), after 200ms disable position feedback
- Expected: Move timeout or alarm; recovery path exercised

Recording format
- Use CSV template: tests/test_results_template.csv
