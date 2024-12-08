# NoFlake technical spec

## Document overview

This document outlines the goals and implementation of NoFlake, a system for managing and triaging test flakes.

## Features

* Automatic test flake detection
  * Currently, we rely on developer intuition to keep an eye on builds over time and notice test which have repeatedly flaked.
  * This is problematic as valuable developer time is consumed by this task, and legitimate test failures are sometimes confused for flakes.
* Test framework integration
  * Different testing frameworks produce different artifacts that NoFlake can use to diagnose and classify flakey tests within the context of a single run. For example, playwright traces includes network calls which can be used to classify tests that timeout waiting for expensive API calls which may just need to have timeouts bumped.
* CI integration
  * Many test frameworks will classify flakes based on auto-retry policies within individual runs. NoFlake will consider test results across multiple different CI runs tagging tests which fail some builds but pass others.
* Auto-disabling flakey tests
  * A flakey test is a worthless test. If a test is flagged as flakey, it will not fail a CI build
* Automatic flake triage
  * Flakey tests shouldn't be ignored, they should be fixed. When a test is tagged flakey, NoFlake will ping the most relevant team to fix and re-enable the test.

## Technical goals

* Flexibility - Tests exist in many languages, environments, and frameworks but flakes are a universal problem. NoFlake should be pluggable so as to support many different projects
* Automation over process - By default, NoFlake should prefer to take automated action where appropriate to the end of keeping things shipping and minimizing developer intervention
* Configurable - Different teams will have different opinions for what counts as a flake and what to do with flakes. NoFlake should allow for that.
* Sensible defaults - The "no config" approach should provide a reasonably good experience for any teams. Most configuration should not be required.
* Self hosted - The output of this project is a configurable express app that must be self hosted by the end consumer

## Definitions and concepts

* `Project`
  * A software project that contains tests, permissions are managed on a per project basis
  * Data is retained per project and retention length is configurable (no upper ceiling on retention; cost is not a concern since this is self hosted)
* `Team`
  * A collection of developers that may have designated ownership over a project
* `User`
  * A single user that can take actions within the system
* `Test`
  * An automated test of any kind written for any test framework in any language for any app. Consumers and test authors may include other metadata about a test, but NoFlake requires a unique id, (optionally) associated git commit, associated project per test
  * NoFlake stores it's own metadata about each test (e.g. it's flake confidence and whether or not it's auto disabled)
* `Deployment`
  * 
* `Test Suite`
  * A collection of tests, usually all run together but can also be partially run (e.g. in contexts where detected flakes are omitted)
* `Flake`
  * A test which passes inconsistently given the same code
* `Flake Confidence`
  * The systems certainty that a given test is flakey
* `Test Framework`
  * A tool which runs a suite of tests (e.g. playwright, jest, chai, nunit, junit, vitest)
* `Test Run`
  * A run of a single test which either passed, failed
* `Test Result`
  * A pass or fail result for a given test with an localized flakiness confidence 
  * Failed test results include all emitted errors (and optionally warnings?) from a test. Failed test results with different emitted errors are considered different failures
* `Test History`
  * A collection of past runs for a single test from which flake confidence is determined
* `Suite Run`
  * A run of a test suite (which results in multiple individual test runs) with various contexts
  * This is associated with a git commit sha and may include links to hosted test results (like playwright traces)
  * Possible contexts include:
    * PR builds and master builds - do not run disabled tests and report results to NoFlake
    * baseline builds (run on a cron schedule) - runs all tests and reports results to NoFlake
    * local dev builds - runs all tests but does not report results to NoFlake
* `Triage Action`
  * An automated action taken (e.g. auto disable, slack notification, JIRA case creation, codemod) when a test is detected as flakey
* `Triage Strategy`
  * A series of triage actions that are executed in order when a test is detected as flakey with a high enough confidence, end user configurable

## Technical problems

### Test result ingestion

Test results are ingested in batches as suite runs. Local, framework specific, processing happens before 

### Flake detection

Flakey tests can be detected using a combination of several strategies which each yield a varying level of confidence

* Regular baseline builds which are run on a schedule
  * Tests that pass inconsistently for the same commit are tagged as flakey with a high degree of confidence
* Per-framework strategies for individual runs
  * Many test frameworks have their own strategies for detecting flakey tests (typically auto-retry) after a single test suite run
  * This strategy obviously is consumer dependent and will rely on plugins for submitting and ingesting test report data
  * Examples of playwright strategies:
    * Auto retried tests that pass are tagged as flakey with high degree of confidence
    * Tests that fail on timeouts with unresolved API requests are tagged as flakey with low degree of confidence
* PR and master CI builds
  * Tests that fail inconsistently with the same result across multiple different builds are tagged as flakey with low confidence
* Build retries
  * When a build fails on a test that might be a flake, it may be auto-retried a given number of times (or until it passes) to collect more data on the test and increase flake confidence
* Shipping information
  * When a commit associated with test failures is deployed, those failing tests are marked as flakes with a high degree of confidence

### Triaging

Tests that flake consistently over a long enough period of time (configurable per triage strategy)

### User authentication and access control

End consumers will need to implement a service that provides an authenticated user token for the current request
