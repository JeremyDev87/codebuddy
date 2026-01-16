# Severity Classification

Objective severity classification based on SLO burn rates and business impact.

## The Classification Rule

**Classify severity BEFORE taking any action.** Severity determines:
- Response time expectations
- Who gets notified
- Resource allocation priority
- Communication cadence

## Severity Matrix

### P1 - Critical

**SLO Burn Rate:** >14.4x (consuming >2% error budget per hour)

**Impact Criteria (ANY of these):**
- Complete service outage
- >50% of users affected
- Critical business function unavailable
- Data loss or corruption risk
- Active security breach
- Revenue-generating flow completely blocked
- Compliance/regulatory violation in progress

**Response Expectations:**

| Metric | Target |
|--------|--------|
| Acknowledge | Within 5 minutes |
| First update | Within 15 minutes |
| War room formed | Within 15 minutes |
| Executive notification | Within 30 minutes |
| Customer communication | Within 1 hour |
| Update cadence | Every 15 minutes |

**Escalation:** Immediate page to on-call, all hands if needed

**Example Incidents:**
- Production database unreachable
- Authentication service down
- Payment processing 100% failure
- Major cloud region outage affecting services
- Data breach detected

---

### P2 - High

**SLO Burn Rate:** >6x (consuming >5% error budget per 6 hours)

**Impact Criteria (ANY of these):**
- Major feature unavailable
- 10-50% of users affected
- Significant performance degradation (>5x latency)
- Secondary business function blocked
- Partial data integrity issues
- Key integration failing

**Response Expectations:**

| Metric | Target |
|--------|--------|
| Acknowledge | Within 15 minutes |
| First update | Within 30 minutes |
| Status page update | Within 30 minutes |
| Stakeholder notification | Within 1 hour |
| Update cadence | Every 30 minutes |

**Escalation:** Page on-call during business hours, notify team lead

**Example Incidents:**
- Search functionality completely broken
- 30% of API requests failing
- Email notifications not sending
- Third-party payment provider degraded
- Mobile app login issues for subset of users

---

### P3 - Medium

**SLO Burn Rate:** >3x (consuming >10% error budget per 24 hours)

**Impact Criteria (ANY of these):**
- Minor feature impacted
- <10% of users affected
- Workaround available
- Non-critical function degraded
- Cosmetic issues affecting usability
- Performance slightly degraded

**Response Expectations:**

| Metric | Target |
|--------|--------|
| Acknowledge | Within 1 hour |
| First update | Within 2 hours |
| Resolution target | Within 8 business hours |
| Update cadence | At milestones |

**Escalation:** Create ticket, notify team channel

**Example Incidents:**
- Report generation slow but working
- Specific browser experiencing issues
- Non-critical API endpoint intermittent
- Email formatting broken
- Search results slightly inaccurate

---

### P4 - Low

**SLO Burn Rate:** >1x (projected budget exhaustion within SLO window)

**Impact Criteria (ALL of these):**
- Minimal or no user impact
- Edge case or rare scenario
- Cosmetic only
- Performance within acceptable range
- Workaround trivial

**Response Expectations:**

| Metric | Target |
|--------|--------|
| Acknowledge | Within 1 business day |
| Resolution target | Next sprint/release |
| Update cadence | On resolution |

**Escalation:** Backlog item, routine prioritization

**Example Incidents:**
- Minor UI misalignment
- Rare edge case error
- Documentation inconsistency
- Non-user-facing optimization opportunity

---

## Error Budget Integration

### Understanding Burn Rate

```
Burn Rate = (Error Rate) / (Allowed Error Rate)

Example: 99.9% SLO = 0.1% allowed errors
If current error rate = 1.44%
Burn Rate = 1.44 / 0.1 = 14.4x (P1!)
```

### Budget Consumption Thresholds

| Severity | Burn Rate | Budget Impact | Alert Type |
|----------|-----------|--------------|------------|
| P1 | >14.4x | >2% in 1 hour | Page immediately |
| P2 | >6x | >5% in 6 hours | Page business hours |
| P3 | >3x | >10% in 24 hours | Create ticket |
| P4 | >1x | Projected exhaustion | Add to backlog |

### SLO Tier Mapping

| Service Tier | SLO Target | Monthly Budget | Equivalent Downtime |
|--------------|-----------|----------------|---------------------|
| Tier 1 (Critical) | 99.99% | 0.01% | 4.38 minutes |
| Tier 2 (Important) | 99.9% | 0.1% | 43.8 minutes |
| Tier 3 (Standard) | 99.5% | 0.5% | 3.65 hours |

---

## Classification Decision Tree

```
Is the service completely unavailable?
├── Yes → P1
└── No → Continue

Are >50% of users affected?
├── Yes → P1
└── No → Continue

Is a critical business function blocked?
├── Yes → P1
└── No → Continue

Are 10-50% of users affected?
├── Yes → P2
└── No → Continue

Is a major feature unavailable?
├── Yes → P2
└── No → Continue

Is the burn rate >6x?
├── Yes → P2
└── No → Continue

Are <10% of users affected with workaround?
├── Yes → P3
└── No → Continue

Is impact minimal/cosmetic only?
├── Yes → P4
└── No → Default to P3 (when uncertain)
```

---

## When Uncertain, Classify Higher

**Rule:** If you're unsure between two severity levels, classify higher.

- Unsure between P1 and P2? → Classify as P1
- Unsure between P2 and P3? → Classify as P2
- Unsure between P3 and P4? → Classify as P3

**Rationale:** Over-response is better than under-response. You can always downgrade.

---

## Severity Changes During Incident

Severity can change as you learn more:

**Upgrade when:**
- Impact wider than initially assessed
- More users affected than thought
- Business impact greater than estimated
- Mitigation not working

**Downgrade when:**
- Successful mitigation reduced impact
- Fewer users affected than thought
- Workaround discovered
- Root cause isolated to non-critical path

**Always communicate severity changes** to all stakeholders immediately.

---

## Include in Incident Reports

When documenting severity, always include:

```
Severity: P[1-4]
Burn Rate: [X]x SLO budget
Users Affected: [Count/Percentage]
Impact: [Brief description]
SLO Status: [Which SLO breaching]
Error Budget Remaining: [Percentage]
```
