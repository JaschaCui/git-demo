# Logging Specification

This document defines the logging format and rotation for ACSpl+ scripts.

Log entry format (one line per event):
- timestamp_iso, module, level, message, context_json

Example:
2026-07-02T08:00:00Z,MoveAbs,INFO,"Move started",{"axis":"AXIS1","target":1000}

Levels: DEBUG, INFO, WARN, ERROR

Rotation: keep daily files, retain 30 days or 100 MB per file, whichever first.

Important fields to include for motion logs:
- axis, commanded_position, actual_position, velocity, alarm_code (if any), latency_ms

Location: write logs to controller persistent storage path or export to upper-layer server via SYSLOG/OPC if supported.
