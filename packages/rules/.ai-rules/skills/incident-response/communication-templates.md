# Communication Templates

Standardized templates for incident communication. Consistent format builds stakeholder trust.

## The Communication Rule

**Communicate BEFORE attempting fixes.** Stakeholders need to know:
- That you're aware of the issue
- What the impact is
- What you're doing about it
- When they'll hear next

## Initial Incident Notification

### Internal (Team/Slack/War Room)

```
🔴 INCIDENT DECLARED

Severity: P[1-4]
Started: [YYYY-MM-DD HH:MM UTC]
Status: Investigating

Impact:
- [Affected service/feature]
- [User impact - count/percentage]
- [Business impact if known]

Initial Observations:
- [What triggered the alert]
- [What we're seeing]

Incident Commander: [Name]
trace_id: [ID if available]

Next Update: [Time - based on severity cadence]
```

### External (Status Page)

```
[SERVICE] - Investigating Issues

We are currently investigating reports of [brief description].

Some users may experience [symptom].

We are actively working to resolve this and will provide updates as we learn more.

Started: [HH:MM UTC]
```

---

## Status Updates

### Progress Update (Internal)

```
📢 INCIDENT UPDATE - [INCIDENT_ID]

Time: [HH:MM UTC]
Severity: P[X] [unchanged/upgraded/downgraded]
Status: [Investigating/Mitigating/Resolving/Resolved]

Progress:
- [What was done since last update]
- [What was learned]

Current Focus:
- [What we're working on now]

Blockers: [If any]

ETA: [If known, or "Assessing"]

Next Update: [Time]
```

### External Update (Status Page)

```
[SERVICE] - [Status]

Update: We have identified the issue as [brief, non-technical description].

We are [current action in user-friendly terms].

[X]% of users may still experience [symptom].

We will provide another update in [time period].
```

---

## Mitigation Announcement

### Mitigation Applied (Internal)

```
🟡 MITIGATION APPLIED - [INCIDENT_ID]

Time: [HH:MM UTC]
Action Taken: [Rollback/Feature flag/Traffic shift/etc.]

Result:
- [Immediate effect observed]
- [Metrics improving/stable]

Current Status:
- Service: [Degraded/Partially restored/Stable]
- Error rate: [Current vs peak]
- User impact: [Current assessment]

Root Cause: [If known, or "Under investigation"]

Next Steps:
- [Planned actions]

Next Update: [Time]
```

### External Update (Status Page)

```
[SERVICE] - Monitoring

We have implemented a fix for the issue affecting [service].

Service is [restored/partially restored]. Some users may still experience [residual impact] while we complete restoration.

We continue to monitor the situation.
```

---

## Resolution Announcement

### Incident Resolved (Internal)

```
✅ INCIDENT RESOLVED - [INCIDENT_ID]

Resolved: [YYYY-MM-DD HH:MM UTC]
Duration: [X hours Y minutes]
Severity: P[X]

Summary:
- [Brief description of what happened]
- [Root cause in one sentence]
- [Resolution action]

Impact:
- Users affected: [Count/percentage]
- Duration of impact: [Time]
- SLO budget consumed: [Percentage]

Timeline: [Link to detailed timeline]

Postmortem: Scheduled for [Date/Time]

Thank you to everyone who responded: [Names]
```

### External Resolution (Status Page)

```
[SERVICE] - Resolved

The issue affecting [service] has been resolved.

All systems are operating normally.

We apologize for any inconvenience this may have caused.

Total duration: [X hours Y minutes]

A detailed postmortem will be published at [URL/time].
```

---

## Escalation Templates

### Escalating to Leadership (P1/P2)

```
🚨 ESCALATION - P[X] Incident

Incident: [Brief description]
Started: [Time] ([Duration so far])
Current Status: [Status]

Business Impact:
- [Revenue impact if known]
- [User impact]
- [Reputation/compliance concerns]

Current Response:
- [Who is engaged]
- [What's being done]

Challenges:
- [What's blocking resolution]
- [Resources needed]

Decision Needed: [If any]

Incident Commander: [Name]
War Room: [Link]
```

### Requesting Additional Help

```
🆘 ASSISTANCE NEEDED - [INCIDENT_ID]

We need help with: [Specific expertise/access/decision]

Context:
- [Current situation]
- [What we've tried]
- [Why we're stuck]

Specifically looking for:
- [Skill/access/knowledge needed]
- [Time commitment expected]

Join us: [War room link]
Contact: [IC name and contact]
```

---

## Handoff Template

### Shift/IC Handoff

```
🔄 INCIDENT HANDOFF - [INCIDENT_ID]

Outgoing IC: [Name]
Incoming IC: [Name]
Time: [HH:MM UTC]

Current Status:
- Severity: P[X]
- Phase: [Detect/Triage/Communicate/Mitigate/Diagnose/Fix/Verify/Document]
- Duration: [Time since start]

Summary:
- [What happened]
- [What we've done]
- [Current state]

Key Context:
- trace_id: [ID]
- Root cause hypothesis: [If any]
- Mitigation in place: [Yes/No - what]

Immediate Next Steps:
1. [Priority 1]
2. [Priority 2]

Open Questions:
- [Unresolved items]

Stakeholder Status:
- Last external update: [Time]
- Next update due: [Time]

Resources:
- Dashboard: [Link]
- Logs: [Link/query]
- War room: [Link]
```

---

## Communication Cadence by Severity

| Severity | Internal Updates | External Updates | Escalation |
|----------|-----------------|------------------|------------|
| P1 | Every 15 minutes | Every 30 minutes | Immediate to leadership |
| P2 | Every 30 minutes | Every 1 hour | Within 1 hour |
| P3 | At milestones | If customer-facing | If >8 hours |
| P4 | On resolution | Not required | Not required |

---

## Key Fields to Always Include

Every communication should include:

1. **Timestamp** - When this update was sent (UTC)
2. **Severity** - Current classification
3. **Status** - Current phase/state
4. **Impact** - Who/what is affected
5. **trace_id** - **CRITICAL for investigation** - Links logs, traces, metrics; enables instant context jumping; include in EVERY internal communication
6. **Next Update** - When stakeholders will hear again

**Why trace_id matters:** Without trace_id, responders waste precious minutes searching logs. With it, they jump directly to the failing request across all systems.

---

## Anti-Patterns to Avoid

❌ **Don't:**
- Send updates without timestamps
- Use technical jargon in external comms
- Blame individuals or teams
- Promise specific resolution times unless certain
- Go silent for extended periods
- Share sensitive details externally

✅ **Do:**
- Keep updates concise but informative
- Use clear, non-technical language externally
- Focus on impact and actions
- Provide realistic expectations
- Maintain consistent cadence
- Include next update time
