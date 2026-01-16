# Escalation Matrix

Role-based escalation paths per severity level.

## The Escalation Rule

**Escalate based on severity, not gut feeling.** Proper escalation:
- Gets the right people involved at the right time
- Avoids under-response (delayed resolution)
- Avoids over-response (unnecessary panic)
- Ensures accountability at each level

**📝 For message templates, see:** `communication-templates.md` → Escalation Templates section

---

## Escalation Paths by Severity

### P1 - Critical Incident

```
Timeline: 0-60 minutes from incident start

0 min    Alert fires
         └── On-call engineer acknowledges
             └── Declares P1 incident

5 min    └── Opens war room
         └── Notifies: Primary on-call team

15 min   └── IC (Incident Commander) assigned
         └── Notifies: Engineering leadership
         └── First status update sent

30 min   └── Notifies: Executive team
         └── Customer communications prepared
         └── Status page updated

60 min   └── If unresolved: Escalate to VP/CTO
         └── Customer communication sent
         └── Consider bringing in additional teams
```

**Who Gets Notified:**

| Time | Role | Notification Method |
|------|------|-------------------|
| Immediate | On-call engineer | Page |
| 5 min | On-call team | Page |
| 15 min | Engineering manager | Page |
| 30 min | Director/VP Engineering | Page + Call |
| 30 min | Customer Success | Message |
| 60 min | CTO/Executive | Call |

---

### P2 - High Severity

```
Timeline: 0-2 hours from incident start

0 min    Alert fires
         └── On-call engineer acknowledges
             └── Classifies as P2

15 min   └── Notifies: On-call team
         └── Begins investigation

30 min   └── First status update sent
         └── Status page updated (if customer-facing)
         └── Notifies: Team lead

1 hour   └── If unresolved: Notifies Engineering manager
         └── Consider escalating to P1

2 hours  └── If unresolved: Escalate to Director
         └── Mandatory progress review
```

**Who Gets Notified:**

| Time | Role | Notification Method |
|------|------|-------------------|
| Immediate | On-call engineer | Page |
| 15 min | On-call team | Page (business hours) |
| 30 min | Team lead | Message |
| 1 hour | Engineering manager | Message |
| 2 hours | Director | Message + Call |

---

### P3 - Medium Severity

```
Timeline: 0-8 hours from incident start

0 min    Alert fires / Issue reported
         └── On-call engineer acknowledges
             └── Classifies as P3

1 hour   └── Creates incident ticket
         └── Notifies: Team channel
         └── Begins investigation

4 hours  └── Progress update to team
         └── If blocked: Request assistance

8 hours  └── If unresolved: Escalate to team lead
         └── Consider overnight handoff
```

**Who Gets Notified:**

| Time | Role | Notification Method |
|------|------|-------------------|
| Immediate | On-call engineer | Alert |
| 1 hour | Team | Channel message |
| 4 hours | Team lead (if blocked) | Message |
| 8 hours | Team lead | Message |

---

### P4 - Low Severity

```
Timeline: 0-5 business days

0 min    Issue identified
         └── Classifies as P4
         └── Creates ticket

Next day └── Ticket prioritized in backlog
         └── Assigned to engineer

Sprint   └── Work scheduled
         └── Resolved in normal flow
```

**Who Gets Notified:**

| Time | Role | Notification Method |
|------|------|-------------------|
| Immediate | Reporter | Acknowledgment |
| Daily standup | Team | Regular process |

---

## Roles and Responsibilities

### Incident Commander (IC)

**Responsibilities:**
- Overall coordination of incident response
- Decision-making authority during incident
- Communication management
- Resource allocation
- Escalation decisions

**When Assigned:**
- P1: Immediately
- P2: If duration >30 minutes
- P3/P4: Not typically needed

### Communications Lead

**Responsibilities:**
- External communications (status page, customer comms)
- Internal stakeholder updates
- Documentation of communications timeline

**When Assigned:**
- P1: Immediately
- P2: If customer-facing
- P3/P4: IC handles or not needed

### Technical Lead

**Responsibilities:**
- Technical investigation coordination
- Fix/mitigation decisions
- Technical resource allocation

**When Assigned:**
- P1: Immediately
- P2: If complex technical issue
- P3/P4: Assigned engineer leads

---

## Escalation Triggers

### Escalate Immediately When:

| Trigger | Action |
|---------|--------|
| Data breach suspected | Escalate to Security + Executive |
| Customer data at risk | Escalate to Legal + Executive |
| Compliance violation | Escalate to Compliance + Executive |
| Extended outage (>1 hour P1) | Escalate to VP/CTO |
| Multiple systems affected | Escalate to Platform team |
| Resolution blocked | Escalate for resources/decisions |

### Escalate After Threshold When:

| Trigger | Threshold | Action |
|---------|-----------|--------|
| P1 unresolved | 1 hour | VP/CTO |
| P2 unresolved | 4 hours | Director |
| P3 unresolved | 2 days | Team lead review |
| Multiple failed fixes | 3 attempts | Fresh eyes/architecture review |
| IC needs decision | Immediately | Appropriate decision-maker |

---

## On-Call Structure

### Primary On-Call

**Responsibilities:**
- First responder to all alerts
- Initial triage and classification
- Escalation to secondary if needed

**Rotation:** Weekly (adjust per team)

### Secondary On-Call

**Responsibilities:**
- Backup for primary
- Expertise escalation
- Weekend/holiday coverage

**Rotation:** Weekly, offset from primary

### Management On-Call

**Responsibilities:**
- Decision escalation
- Resource allocation
- External communication approval
- Executive escalation

**Rotation:** Weekly among engineering managers

---

## Escalation Communication

**📝 Full templates:** See `communication-templates.md` for complete Internal/External notification formats, Status Updates, and Handoff templates.

### How to Escalate

```
When escalating, provide:

1. Incident ID and severity
2. Current status and duration
3. What's been tried
4. What's blocking progress
5. What decision/resource is needed
6. War room/channel link
```

### Escalation Message Template

```
🚨 ESCALATION REQUEST

Incident: [ID] - P[X]
Duration: [Time]
Current Status: [Status]

Situation:
[Brief description of current state]

What We've Tried:
- [Action 1]
- [Action 2]

Blocker:
[What's preventing resolution]

Request:
[Specific decision/resource/expertise needed]

Join: [War room link]
```

---

## De-escalation

### When to Reduce Severity

- Impact reduced through mitigation
- Fewer users affected than initially thought
- Workaround discovered
- Root cause isolated to limited scope

### De-escalation Process

1. IC proposes severity change
2. Communicate change to all stakeholders
3. Adjust response resources accordingly
4. Update status page if applicable
5. Document reason for change

---

## Contact Directory

Maintain an up-to-date contact list:

```
| Role | Name | Phone | Slack | Email |
|------|------|-------|-------|-------|
| On-call Primary | [Rotating] | [Phone] | @oncall-primary | - |
| On-call Secondary | [Rotating] | [Phone] | @oncall-secondary | - |
| Engineering Manager | [Name] | [Phone] | @[handle] | [email] |
| Director | [Name] | [Phone] | @[handle] | [email] |
| VP Engineering | [Name] | [Phone] | @[handle] | [email] |
| CTO | [Name] | [Phone] | @[handle] | [email] |
| Security | @security-team | - | @security | security@company |
| Legal | [Name] | [Phone] | @legal | legal@company |
```

**Keep this updated!** Outdated contacts during P1 = delayed resolution.

---

## Escalation Anti-Patterns

❌ **Avoid:**
- Escalating without trying to resolve first
- Not escalating when thresholds are reached
- Escalating without context
- Escalating to wrong person/team
- Under-escalating due to fear
- Over-escalating due to panic

✅ **Do:**
- Follow the defined thresholds
- Provide full context when escalating
- Know your escalation paths
- Escalate early when uncertain
- De-escalate when appropriate
- Document escalation decisions
