# Fault Injection Plan (Week7)

Purpose: Validate recovery and error handling by intentionally injecting faults.

Scenarios:
- S1: Position sensor dropout during MoveAbs
  - Method: disable AXIS position feedback for 1s during motion
  - Expected: Move times out or alarm; error handler transitions system to safe state

- S2: IO bounce on START_SENSOR
  - Method: toggle START_SENSOR rapidly during pick sequence
  - Expected: debounce logic prevents duplicate triggers; sequence remains stable

- S3: Command timeout / network delay
  - Method: simulate delayed command acknowledgements
  - Expected: controller handles timeout per configured retry policy

Each scenario must include:
- Steps to inject fault
- Expected controller behavior
- Recovery verification steps
- Log collection instructions
