<p align="center">
  <a href="plugin-examples.md">English</a> |
  <a href="ko/plugin-examples.md">한국어</a> |
  <a href="zh-CN/plugin-examples.md">中文</a> |
  <a href="ja/plugin-examples.md">日本語</a> |
  <a href="es/plugin-examples.md">Español</a> |
  <a href="pt-BR/plugin-examples.md">Português</a>
</p>

# CodingBuddy Usage Examples

Real-world examples showing how to use the PLAN/ACT/EVAL workflow effectively.

## Example 1: Implement a REST API Endpoint

### Scenario
Add a new endpoint for user registration with validation.

### PLAN Phase

```
You: PLAN implement a POST /api/users endpoint for user registration with email validation
```

**Claude Response:**
```markdown
# Mode: PLAN
## Agent: backend-developer [Primary Agent]

## 📋 Plan Overview
Implement user registration endpoint with email validation, password hashing,
and proper error handling.

## ✅ Todo List
- [ ] Define User types and validation schema
- [ ] Write failing tests for registration endpoint
- [ ] Implement registration handler
- [ ] Add email validation utility
- [ ] Add password hashing
- [ ] Write integration tests

## 🎯 Implementation Steps

### Core Logic (TDD Approach)
1. Write test: POST /api/users returns 201 on valid data
2. Write test: Returns 400 on invalid email
3. Write test: Returns 400 on weak password
4. Implement validation utilities
5. Implement registration handler

### 🔒 Security Planning
- Password hashing with bcrypt (cost factor 12)
- Input sanitization for XSS prevention
- Rate limiting recommendation

## 📁 File Structure
- src/entities/user/types.ts
- src/entities/user/user.validation.ts
- src/entities/user/user.api.ts
- src/entities/user/__tests__/user.api.test.ts

**Next:** Type `ACT` to execute
```

### ACT Phase

```
You: ACT
```

**Claude Response:**
```markdown
# Mode: ACT
## Agent: backend-developer [Primary Agent]

## 🚀 Implementation Progress

### Step 1: Define Types
✅ Created user types
- `src/entities/user/types.ts`: UserInput, User, ValidationError

### Step 2: Write Failing Tests (Red)
✅ Created test file
- `src/entities/user/__tests__/user.api.test.ts`
- Test: "returns 201 on valid registration" - FAILING ❌

### Step 3: Implement Validation (Green)
✅ Created validation utility
- `src/entities/user/user.validation.ts`: validateEmail, validatePassword

### Step 4: Implement Handler (Green)
✅ Created registration endpoint
- `src/entities/user/user.api.ts`: registerUser handler
- Tests now passing ✅

### Step 5: Refactor
✅ Extracted error response helper
✅ Added JSDoc comments

## ✅ Quality Checks
- ✅ Type Safety: All types explicit
- ✅ Tests: 4/4 passing (coverage: 94%)
- ✅ Security: Password hashed with bcrypt

**Next:** Type `EVAL` for quality assessment or continue with `PLAN`
```

### EVAL Phase (Optional)

```
You: EVAL
```

**Claude Response:**
```markdown
# Mode: EVAL
## Agent: code-reviewer [Primary Agent]

## 📊 Code Quality Assessment

### Security Analysis 🔒
| Check | Status | Notes |
|-------|--------|-------|
| Password hashing | ✅ Pass | bcrypt with cost 12 |
| Input validation | ✅ Pass | Email regex, password rules |
| SQL injection | ✅ Pass | Using parameterized queries |
| Rate limiting | ⚠️ Medium | Not implemented |

### Code Quality 📏
| Metric | Value | Target |
|--------|-------|--------|
| Test coverage | 94% | 90%+ ✅ |
| Complexity | Low | Acceptable ✅ |
| Type safety | 100% | 100% ✅ |

### Recommendations
1. **Medium**: Add rate limiting to prevent brute force
2. **Low**: Consider adding email verification flow

## 🔄 Improved Plan
If you want to address the findings:
- Add rate limiting middleware
- Implement email verification token
```

---

## Example 2: Debug a Failing Test

### Scenario
A test is failing intermittently and you need to debug it.

### PLAN Phase

```
You: PLAN debug the flaky test in UserProfile.test.tsx that fails randomly
```

**Claude Response:**
```markdown
# Mode: PLAN
## Agent: test-strategy-specialist [Primary Agent]

## 📋 Plan Overview
Investigate and fix flaky test in UserProfile component.

## 🔍 Debugging Strategy
1. Identify test file and failing assertion
2. Check for async timing issues
3. Look for shared state between tests
4. Verify mock cleanup
5. Add proper waitFor assertions

## 🎯 Investigation Steps
1. Read test file and identify failure pattern
2. Check for missing await or act() wrappers
3. Verify beforeEach/afterEach cleanup
4. Add explicit waitFor for async operations

**Next:** Type `ACT` to start debugging
```

### ACT Phase

```
You: ACT
```

**Claude Response:**
```markdown
# Mode: ACT
## Agent: test-strategy-specialist [Primary Agent]

## 🚀 Debugging Progress

### Step 1: Analyze Test
✅ Found issue in `UserProfile.test.tsx:45`
- Missing `await` on async render
- State update happening after assertion

### Step 2: Apply Fix
✅ Modified test
```tsx
// Before (flaky)
it('shows user name', () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// After (stable)
it('shows user name', async () => {
  render(<UserProfile userId="1" />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Step 3: Verify Fix
✅ Ran test 50 times - 0 failures

## ✅ Root Cause
Async data fetch was completing after assertion. Fixed with proper `waitFor`.
```

---

## Example 3: Autonomous Feature Development

### Scenario
Implement a complete feature with autonomous quality control.

### AUTO Mode

```
You: AUTO implement a dark mode toggle with localStorage persistence
```

**Claude Response:**
```markdown
# Mode: AUTO (Iteration 1/5)
## Agent: frontend-developer [Primary Agent]

## 📋 PLAN Phase
- Create ThemeContext provider
- Implement toggle component
- Add localStorage persistence
- Style dark mode variants

## 🚀 ACT Phase
✅ Created ThemeContext with dark/light modes
✅ Implemented DarkModeToggle component
✅ Added localStorage sync on mount/change
✅ Updated global CSS with dark mode variables

## 📊 EVAL Phase
| Issue | Severity | Status |
|-------|----------|--------|
| Missing keyboard accessibility | High | Found |
| No system preference detection | Medium | Found |
| Test coverage at 78% | Medium | Found |

---

# Mode: AUTO (Iteration 2/5)

## 📋 PLAN Phase
Address High and Medium issues from Iteration 1

## 🚀 ACT Phase
✅ Added keyboard support (Enter/Space toggle)
✅ Added prefers-color-scheme detection
✅ Added missing tests (coverage now 92%)

## 📊 EVAL Phase
| Issue | Severity | Status |
|-------|----------|--------|
| All previous issues | - | ✅ Resolved |

---

# Mode: AUTO - Complete ✅

## Summary
- **Iterations**: 2
- **Critical Issues**: 0
- **High Issues**: 0
- **Coverage**: 92%

## Files Created/Modified
- src/shared/providers/ThemeContext.tsx
- src/shared/components/DarkModeToggle.tsx
- src/app/globals.css (dark mode variables)
- tests/ThemeContext.test.tsx
```

---

## Example 4: Security Audit

### Scenario
Audit existing authentication code for security issues.

### PLAN Phase

```
You: PLAN security audit the authentication module in src/auth/
```

**Claude Response:**
```markdown
# Mode: PLAN
## Agent: security-specialist [Primary Agent]

## 📋 Audit Scope
Security review of authentication module focusing on:
- Token handling (JWT)
- Password storage
- Session management
- Input validation
- OWASP Top 10 compliance

## 🔍 Audit Checklist
- [ ] JWT secret strength and rotation
- [ ] Token expiration and refresh logic
- [ ] Password hashing algorithm and parameters
- [ ] Brute force protection
- [ ] XSS prevention in auth responses
- [ ] CSRF protection on auth endpoints
- [ ] Secure cookie settings
- [ ] Rate limiting

**Next:** Type `ACT` to perform audit
```

### ACT Phase

```
You: ACT
```

**Claude Response:**
```markdown
# Mode: ACT
## Agent: security-specialist [Primary Agent]

## 🔍 Security Audit Findings

### Critical Issues 🔴
| Issue | Location | Risk |
|-------|----------|------|
| JWT secret in code | auth.config.ts:5 | Secret exposure |
| No token expiration | jwt.utils.ts:12 | Session hijacking |

### High Issues 🟠
| Issue | Location | Risk |
|-------|----------|------|
| Weak password policy | validation.ts:8 | Brute force |
| Missing rate limit | login.handler.ts | Account enumeration |

### Medium Issues 🟡
| Issue | Location | Risk |
|-------|----------|------|
| Cookie missing Secure flag | session.ts:22 | MITM |
| Verbose error messages | error.handler.ts | Information leak |

## 📋 Remediation Plan
1. Move JWT secret to environment variable
2. Add token expiration (15 min access, 7 day refresh)
3. Implement rate limiting (5 attempts/min)
4. Add Secure, HttpOnly, SameSite flags to cookies

**Next:** Type `ACT` to implement fixes or `PLAN` for detailed remediation
```

---

## Example 5: Generate Domain Checklist

### Using /checklist Command

```
You: /checklist security accessibility
```

**Claude Response:**
```markdown
## 🔒 Security Checklist

### Authentication
- [ ] Passwords hashed with bcrypt/argon2
- [ ] JWT tokens have expiration
- [ ] Refresh token rotation implemented
- [ ] Session invalidation on logout

### Input Validation
- [ ] All user input sanitized
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] File upload restrictions

### Authorization
- [ ] Role-based access control
- [ ] Resource ownership verification
- [ ] API rate limiting

---

## ♿ Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Visible focus indicators
- [ ] Skip links for navigation
- [ ] No keyboard traps

### Screen Readers
- [ ] Semantic HTML structure
- [ ] ARIA labels on custom controls
- [ ] Alt text on images
- [ ] Form labels associated with inputs

### Visual
- [ ] Color contrast 4.5:1 minimum
- [ ] Text resizable to 200%
- [ ] No content reliant on color alone
```

---

## Tips for Effective Usage

### 1. Be Specific in PLAN
```
# Good
PLAN implement pagination for user list with 20 items per page

# Less effective
PLAN add pagination
```

### 2. Use EVAL for Quality Gates
Request EVAL before merging to ensure:
- Security issues are caught
- Accessibility is verified
- Test coverage meets standards

### 3. Leverage AUTO for Complex Features
AUTO mode is ideal for:
- Multi-file features
- Features requiring multiple iterations
- When quality bar is high

### 4. Use Specialists for Deep Reviews
Mention specific domains for focused analysis:
```
PLAN security review the payment processing module
EVAL with focus on accessibility
```

## See Also

- [Quick Reference](./plugin-quick-reference.md) - Commands at a glance
- [Architecture](./plugin-architecture.md) - How it works
- [Troubleshooting](./plugin-troubleshooting.md) - Common issues
- [FAQ](./plugin-faq.md) - Frequently asked questions
