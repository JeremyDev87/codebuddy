# Postmortem Template

Blameless Root Cause Analysis (RCA) framework for organizational learning.

## The Documentation Rule

**The incident is NOT resolved until the postmortem is scheduled.** Postmortems:
- Capture learning while memory is fresh
- Prevent repeat incidents
- Build organizational knowledge
- Improve detection and response

## Postmortem Timeline

| Severity | Schedule Within | Complete Within | Review Meeting |
|----------|----------------|-----------------|----------------|
| P1 | 24 hours | 5 business days | Required |
| P2 | 48 hours | 7 business days | Required |
| P3 | 1 week | 2 weeks | Optional |
| P4 | 2 weeks | 1 month | Not required |

---

## Blameless Postmortem Principles

### The Core Philosophy

**Incidents are system failures, not people failures.**

- Focus on what happened, not who to blame
- Assume everyone acted with best intentions
- Look for systemic causes, not individual mistakes
- Identify process gaps, not performance gaps

### Language Guidelines

❌ **Avoid:**
- "Engineer X caused the outage by..."
- "If only Y had checked..."
- "Z failed to follow procedure"
- "The mistake was..."

✅ **Use:**
- "The deployment process allowed..."
- "The monitoring gap meant..."
- "The system permitted..."
- "The contributing factor was..."

---

## Postmortem Document Structure

### Header Information

```
# Postmortem: [Incident Title]

**Incident ID:** [ID]
**Date:** [YYYY-MM-DD]
**Duration:** [X hours Y minutes]
**Severity:** P[X]
**Author:** [Name]
**Review Status:** [Draft/Reviewed/Approved]

**Attendees:** [List of people involved in postmortem]
```

---

### Executive Summary

```
## Executive Summary

[2-3 sentences describing what happened, the impact, and the resolution]

**Key Metrics:**
- Time to Detect (TTD): [X minutes]
- Time to Mitigate (TTM): [X minutes]
- Time to Resolve (TTR): [X minutes]
- Users Affected: [Count/percentage]
- SLO Budget Consumed: [Percentage]
- Revenue Impact: [If applicable]
```

---

### Timeline

```
## Timeline

All times in UTC.

| Time | Event | Actor |
|------|-------|-------|
| HH:MM | [What happened] | [System/Team] |
| HH:MM | [Alert fired] | [Monitoring] |
| HH:MM | [Alert acknowledged] | [Responder] |
| HH:MM | [Investigation started] | [Team] |
| HH:MM | [Root cause identified] | [Team] |
| HH:MM | [Mitigation applied] | [Responder] |
| HH:MM | [Service restored] | [System] |
| HH:MM | [Incident closed] | [IC] |

**trace_id:** [ID for log/trace correlation]
```

---

### Impact Assessment

```
## Impact Assessment

### User Impact
- [X] users experienced [symptom] for [duration]
- [Affected user segments]
- [Geographic regions affected]

### Business Impact
- Revenue: [Lost/at-risk amount if applicable]
- SLA: [Any SLA breaches]
- Compliance: [Any compliance implications]

### Service Impact
- Primary: [Service(s) directly affected]
- Secondary: [Downstream services affected]
- Cascade: [Any cascade effects]

### SLO Impact
| SLO | Target | Actual During Incident | Budget Consumed |
|-----|--------|----------------------|-----------------|
| [Name] | [X]% | [Y]% | [Z]% |
```

---

### Contributing Factors

**Note:** We use "contributing factors" not "root cause" because incidents are complex and multi-causal.

```
## Contributing Factors

### Technical Factors
1. **[Factor]**
   - What: [Description]
   - Why it mattered: [How it contributed]
   - Evidence: [Logs/traces/metrics reference]

2. **[Factor]**
   - What: [Description]
   - Why it mattered: [How it contributed]
   - Evidence: [Reference]

### Process Factors
1. **[Factor]**
   - What: [Description]
   - Why it mattered: [How it contributed]

### Detection Factors
1. **[Factor]**
   - What monitoring gap existed?
   - How could earlier detection have helped?
```

---

### 5 Whys Analysis

```
## 5 Whys Analysis

**Symptom:** [What was observed]

1. **Why did [symptom] occur?**
   Because [reason 1]

2. **Why did [reason 1] happen?**
   Because [reason 2]

3. **Why did [reason 2] happen?**
   Because [reason 3]

4. **Why did [reason 3] happen?**
   Because [reason 4]

5. **Why did [reason 4] happen?**
   Because [reason 5 - usually systemic/process]

**Contributing Factor Identified:** [Summary]
```

---

### Observability Gap Analysis

```
## Observability Gap Analysis

### Detection Effectiveness
- Was the issue detected by monitoring? [Yes/No]
- If no, how was it detected? [Customer report/Manual check/etc.]
- Time between incident start and detection: [X minutes]

### Dashboard Effectiveness
- Did dashboards show the problem clearly? [Yes/No]
- What was missing from dashboards?
- What additional views would have helped?

### Log/Trace Effectiveness
- Could logs identify the root cause? [Yes/No]
- Was trace_id correlation helpful? [Yes/No]
- What additional logging would help?

### Alerting Effectiveness
- Did alerts fire appropriately? [Yes/No]
- Were there false negatives? [Alerts that should have fired]
- Were there false positives? [Alert noise during incident]
```

---

### Action Items

```
## Action Items

### Immediate (Within 1 Week)
| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| AI-1 | [Action] | [Name] | [Date] | [Open/Done] |

### Short-term (Within 1 Month)
| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| AI-2 | [Action] | [Name] | [Date] | [Open/Done] |

### Long-term (Within Quarter)
| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| AI-3 | [Action] | [Name] | [Date] | [Open/Done] |

### Observability Improvements
| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| OBS-1 | Add alert for [condition] | [Name] | [Date] | [Status] |
| OBS-2 | Add dashboard for [metric] | [Name] | [Date] | [Status] |
| OBS-3 | Add logging for [event] | [Name] | [Date] | [Status] |
```

---

### What Went Well

```
## What Went Well

- [Positive observation about response]
- [Effective tool/process that helped]
- [Good decision that was made]
- [Communication that worked well]
```

---

### Lessons Learned

```
## Lessons Learned

### Process Improvements
- [Learning about incident response process]

### Technical Insights
- [Technical learning from this incident]

### Communication Insights
- [Learning about communication effectiveness]

### Prevention Strategies
- [How similar incidents can be prevented]
```

---

## Postmortem Review Meeting

### Agenda (60 minutes)

1. **Timeline walkthrough** (10 min)
   - What happened, when
   - Key decision points

2. **Contributing factors discussion** (20 min)
   - Technical factors
   - Process factors
   - Detection gaps

3. **Action item review** (20 min)
   - Prioritize actions
   - Assign owners
   - Set due dates

4. **Lessons learned** (10 min)
   - What went well
   - What to improve
   - Share with broader team

### Meeting Rules

- No blame, no defensiveness
- Focus on systems and processes
- Everyone's perspective is valuable
- Actions must have owners and dates
- Follow up on action completion

---

## Action Item Categories

Ensure actions cover:

| Category | Example Actions |
|----------|----------------|
| **Prevention** | Code review requirement, input validation |
| **Detection** | New alerts, improved dashboards |
| **Mitigation** | Runbook updates, failover automation |
| **Response** | Training, process documentation |
| **Recovery** | Backup improvements, rollback procedures |

---

## Postmortem Anti-Patterns

❌ **Avoid:**
- Assigning blame to individuals
- Concluding "human error" (dig deeper)
- Action items without owners
- Actions without deadlines
- Publishing without review
- Skipping the meeting

✅ **Do:**
- Focus on system failures
- Find multiple contributing factors
- Assign clear ownership
- Set realistic deadlines
- Review with stakeholders
- Track action completion
