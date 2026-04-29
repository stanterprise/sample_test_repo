# Stanterprise Playwright Reporter Test Suite

Comprehensive test suite for testing the `stanterprise-playwright-reporter`.

## Observer UI Scale-Out

The repository now includes a reusable page object pattern for synthetic but fully interactive Playwright UI coverage:

- `tests/support/page-objects/observer-demo.page.ts` centralizes selectors and interactions.
- `tests/support/fixtures.ts` exposes the page object as a shared fixture.
- `tests/support/observer-ui-suite.ts` registers nested-step observer workflows from compact scenario definitions.
- `tests/ui/observer-ui-smoke.spec.ts` is the focused smoke spec for the pattern.
- `tests/generated/observer-ui/` is generated from `scripts/generate-observer-ui-suite.mjs` and is intended to hold 2048 deterministic UI spec files.

### Generate the large UI suite

```bash
npm run generate:observer-ui
```

### Run the focused smoke check

```bash
npm run test:observer-ui:smoke
```

### Run the generated observer UI suite

```bash
npm run test:observer-ui
```

The existing shell runners now forward any Playwright arguments you pass, for example:

```bash
./verbose-run.sh tests/generated/observer-ui --grep @observer-ui
./unsharded-run.sh tests/ui/observer-ui-smoke.spec.ts --project=chromium
```

## Test Files

### 1. `passing.spec.ts`

- **Purpose**: Tests that always pass successfully
- **Coverage**:
  - Simple assertions
  - Multiple assertions
  - Tests with steps (single and nested)
  - Tests with annotations
  - Page interactions
  - Various passing scenarios

### 2. `failing.spec.ts`

- **Purpose**: Tests that intentionally fail
- **Coverage**:
  - Simple assertion failures
  - Failures with custom messages
  - Failing steps in multi-step tests
  - Nested step failures
  - Array and object comparison failures
  - Page interaction failures
  - Timeout failures
  - Edge case failures

### 3. `skipped.spec.ts`

- **Purpose**: Tests that are skipped or marked as fixme
- **Coverage**:
  - Explicitly skipped tests (`test.skip()`)
  - Conditionally skipped tests
  - Tests marked as fixme
  - Entire skipped suites
  - Mixed skip scenarios

### 4. `flaky.spec.ts`

- **Purpose**: Tests that may pass or fail randomly
- **Coverage**:
  - Tests that pass on retry
  - Random failure simulation
  - Time-based flaky behavior
  - Flaky page interactions
  - Network-like flaky behavior
  - Race condition simulation

### 5. `tags-and-annotations.spec.ts`

- **Purpose**: Tests with various tags and metadata
- **Coverage**:
  - Smoke, regression, critical tags
  - Issue tracking annotations
  - Owner and team metadata
  - Priority levels
  - Custom annotations
  - Performance, security, accessibility tags
  - Business-critical classifications

### 6. `performance.spec.ts`

- **Purpose**: Performance and stress testing
- **Coverage**:
  - Page load time measurements
  - Multiple navigation performance
  - Slow tests with extended timeouts
  - Parallel operations performance
  - Resource loading metrics
  - Stress tests (memory, CPU)
  - Custom timeout configurations

### 7. `complex-scenarios.spec.ts`

- **Purpose**: Complex multi-step scenarios
- **Coverage**:
  - User journeys
  - Deeply nested steps (5 levels)
  - Multiple assertion groups
  - Error recovery patterns
  - Data-driven tests
  - Parallel execution
  - Mixed results (pass/fail/skip)
  - Before/after hooks

### 8. `api-simulation.spec.ts`

- **Purpose**: API testing simulation using mocks
- **Coverage**:
  - Mock GET/POST requests
  - API error handling (404, 500)
  - Pagination simulation
  - Request/response validation
  - Header validation
  - Schema validation
  - Performance measurements
  - Concurrent requests
  - Authentication scenarios

### 9. `new.spec.ts`

- **Purpose**: Original sample test suite
- **Coverage**:
  - Parallel test execution
  - Generated test data
  - Tags and steps
  - Deterministic behavior

## Reporter Features Tested

The test suite comprehensively tests the following reporter capabilities:

1. **Test Lifecycle Events**
   - `onBegin()` - Suite start
   - `onEnd()` - Suite completion
   - `onExit()` - Reporter cleanup

2. **Test Results**
   - Passing tests
   - Failing tests
   - Skipped tests
   - Flaky tests (with retries)

3. **Test Metadata**
   - Run ID tracking
   - Start/end times
   - Duration measurements
   - Test counts

4. **Test Steps**
   - Single-level steps
   - Nested steps (up to 5 levels)
   - Step success/failure
   - Step timing

5. **Annotations**
   - Tags (smoke, regression, api, etc.)
   - Issue tracking
   - Ownership
   - Priority
   - Custom metadata

6. **Test Organization**
   - Test suites
   - Parallel execution
   - Test hooks (beforeAll, afterAll, beforeEach, afterEach)

## Running the Tests

### Run all tests:

```bash
npx playwright test
```

### Run specific test file:

```bash
npx playwright test tests/passing.spec.ts
```

### Run with specific reporter:

```bash
npx playwright test --reporter=./reporter.ts
```

### Run tagged tests:

```bash
npx playwright test --grep @smoke
```

### Run the smoke task:

```bash
npm run test:smoke
# or use VS Code task: "Playwright run smoke"
```

## Expected Reporter Output

The `stanterprise-playwright-reporter` should capture and report:

1. **Run-level data**:
   - Unique run ID
   - Start time
   - End time
   - Total duration
   - Total test count
   - Pass/fail/skip counts

2. **Test-level data**:
   - Test name
   - Test status
   - Test duration
   - Test steps
   - Annotations
   - Error details (for failures)
   - Retry information

3. **gRPC Communication**:
   - Connection status
   - Event streaming
   - Error handling

## Configuration

The reporter can be configured via environment variables:

- `STANTERPRISE_GRPC_ADDRESS` - gRPC server address (default: `localhost:50051`)
- `STANTERPRISE_GRPC_ENABLED` - Enable/disable gRPC (default: `true`)

## Test Statistics

- **Total test files**: 9
- **Approximate test count**: 100+
- **Test types**: Pass, Fail, Skip, Flaky
- **Max nesting level**: 5 steps deep
- **Browsers tested**: Chromium (configurable for Firefox, WebKit)
