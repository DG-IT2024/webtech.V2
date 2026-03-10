# Project Testing Document (webtech.V2)

## 1) Objective
This document defines how to test the `webtech.V2` project across:
- Unit testing
- Integration testing
- Functional testing
- Security testing
- Usability testing

Project structure covered:
- `client/` (React + TypeScript + Vite)
- `server/` (Express + TypeScript)

---

## 2) Test Levels and Scope

## 2.1 Unit Testing
Purpose: validate isolated logic quickly.

### Client unit targets
- UI primitives: `Button`, `Alert`, `Table`
- Feature components with local logic:
  - document modals
  - search/filter behavior
  - form validation states

### Server unit targets
- Controller methods with mocked req/res
- Data mapping and validation helpers
- Error handling branches

### Suggested tools
- Client: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
- Server: `vitest` (or `jest`) for controller/service unit tests

### Example unit checks
- Button click invokes handler exactly once
- Document edit modal rejects invalid inputs
- Controller returns 400 for malformed request body

---

## 2.2 Integration Testing
Purpose: validate module interactions.

### Client integration targets
- Page-level interactions with API layer
- Protected-route behavior
- Form submission -> API call -> UI feedback

### Server integration targets
- Route -> middleware -> controller -> DB flow
- Auth-protected endpoints (allow/deny)
- Document and employee route workflows

### Suggested tools
- Backend API integration: `supertest`
- Frontend integration: Testing Library + `msw`

### Example integration checks
- `POST /auth/...` success and failure paths
- Document creation endpoint persists and returns expected fields
- Dashboard fetch renders data and handles API errors

---

## 2.3 Functional Testing (End-to-End)
Purpose: validate complete user workflows from UI to backend.

### Priority workflows
1. Sign in / sign out
2. Open dashboard and verify core widgets load
3. Upload document and confirm it appears in list
4. Search/filter documents
5. Edit document metadata
6. Share/forward document
7. Add/edit employee basic flow

### Suggested tools
- Playwright (preferred) or Cypress

### Functional pass criteria
- All critical (P0) workflows pass in CI for merge
- Full smoke suite passes before release

---

## 2.4 Security Testing
Purpose: reduce exploitable risk and validate controls.

### Security focus
- Authentication and token handling
- Authorization boundaries (resource access)
- Input validation and injection resistance
- File upload restrictions (type/size)
- Dependency vulnerabilities
- Sensitive error/log leakage

### Security activities
- Dependency scan: `npm audit` in `client/` and `server/`
- Automated negative tests for unauthorized access
- Manual abuse tests (IDOR, invalid payloads, oversized uploads)

### Security exit criteria
- No unresolved critical vulnerabilities
- High vulnerabilities require approved mitigation plan
- Auth/authz regression checks pass

---

## 2.5 Usability Testing
Purpose: validate ease-of-use for real users.

### Usability scenarios
- First login and navigation comprehension
- Upload + find a document
- Edit/share flows
- Error recovery from invalid form input

### Usability method
1. Define task scripts (5–8 tasks)
2. Test with at least 5 representative users
3. Track completion rate, time-on-task, confusion points
4. Prioritize findings (Critical / Major / Minor)
5. Re-test after fixes

### Usability target
- >=90% successful completion on core tasks
- No critical usability blockers before release

---

## 3) Quality Gates

### Pull Request gate (minimum)
1. Lint + type checks pass
2. Unit tests pass
3. Integration tests pass
4. Critical E2E smoke tests pass
5. Security scan completed

### Release gate
1. Full regression (unit/integration/E2E) green
2. No open critical defects
3. Security criteria satisfied
4. Usability blockers addressed

---

## 4) Test Environment and Data
- Maintain separate local, CI, and staging configs
- Use dedicated test users/accounts
- Seed deterministic test data
- Reset/clean test DB between integration/E2E runs
- Never use production data in test environments

---

## 5) Suggested Initial Script Baseline

### `client/package.json`
- `test`: run unit/integration tests
- `test:watch`: watch mode
- `test:coverage`: coverage report
- `e2e`: run functional tests

### `server/package.json`
- `test`: backend unit + integration tests
- `test:watch`: watch mode
- `test:coverage`: coverage report
- `test:security`: audit and security checks

---

## 6) Ownership
- Developers: unit + integration coverage for changed code
- QA/test owner: E2E suite and regression cycle
- Security owner: vulnerability triage/approval
- Product/UX: usability prioritization

---

## 7) Rollout Plan

### Phase 1
- Set up client/server test frameworks
- Add smoke unit tests for critical components/controllers
- Add API integration tests for auth and document routes

### Phase 2
- Add E2E smoke tests for top business workflows
- Enable coverage reporting in CI
- Add automated dependency scan in CI

### Phase 3
- Expand edge/negative-path coverage
- Run formal usability round and fix high-severity issues
- Track and reduce flaky tests

---

## 8) Deliverables
- Versioned automated test suites
- CI quality gates for PR and release
- Security scan reports
- Usability findings and remediation log

This is a living document and should be updated when architecture, risk, or workflows change.
