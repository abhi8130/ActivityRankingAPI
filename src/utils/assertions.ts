import assert from "node:assert/strict";

export function assertStatusCode(actual: number, expected: number): void {
  assert.equal(actual, expected, `Expected status ${expected} but got ${actual}`);
}

export function assertStatusMessage(actual: string, expected: string): void {
  assert.equal(actual, expected, `Expected status message "${expected}" but got "${actual}"`);
}

export function assertErrorCode(body: any, expectedCode: string): void {
  assert.equal(body.error, expectedCode, `Expected error code ${expectedCode} but got ${body.error}`);
}

export function assertErrorMessage(body: any, expectedText: string): void {
  assert.ok(body.message, "Expected a non-empty error message");
  assert.ok(
    body.message.includes(expectedText),
    `Expected error message to contain "${expectedText}" but got "${body.message}"`
  );
}

export function assertTotalDays(body: any): void {
  assert.equal(body.days.length, body.totalDays, `Expected ${body.totalDays} days but got ${body.days.length}`);
}

export function assertActivitiesPerDay(body: any, expectedCount: number): void {
  for (const day of body.days) {
    assert.equal(day.rankings.length, expectedCount, `Expected ${expectedCount} activities on ${day.date}`);
  }
}

export function assertMatchesHaveCountry(body: any): void {
  assert.ok(body.matches.length > 0, "Expected at least one matching location");
  for (const match of body.matches) {
    assert.ok(match.country, `Expected a country for location ${match.locationId}`);
  }
}
