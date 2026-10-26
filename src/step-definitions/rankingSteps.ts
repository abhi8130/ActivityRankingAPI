import { Given, When, Then, World } from "@cucumber/cucumber";
import { getActivityRankings, ApiResponse } from "../services/activityRankingService";
import { validateSchema } from "../utils/schemaValidator";
import {
  assertStatusCode,
  assertStatusMessage,
  assertErrorCode,
  assertErrorMessage,
  assertTotalDays,
  assertActivitiesPerDay,
  assertMatchesHaveCountry,
} from "../utils/assertions";
import rankingSuccessSchema from "../schemas/rankingSuccessResponse.schema.json";
import ambiguousLocationSchema from "../schemas/ambiguousLocationResponse.schema.json";
import errorSchema from "../schemas/errorResponse.schema.json";


interface RankingWorld extends World {
  headers?: Record<string, string>;
  response: ApiResponse;
}

//Steps for handling activity ranking API scenarios
Given("the Open Meteo service is {string}", function (condition: string) {});

Given("the request includes header {string} with value {string}", function (this: RankingWorld, key: string, value: string) {
  this.headers = { [key]: value };
});

When("I request the activity rankings in the specified {string} and town {string}", async function (this: RankingWorld, city: string, town: string) {
  this.response = await getActivityRankings(city, town, this.headers);

  this.attach(JSON.stringify(this.response.request, null, 2), { mediaType: "application/json", fileName: "Request" });
  this.attach(JSON.stringify(this.response.body, null, 2), { mediaType: "application/json", fileName: "Response" });
});

Then("API should return {int} in response", function (this: RankingWorld, status: number) {
  assertStatusCode(this.response.status, status);
});

Then("API should return {string} in response", function (this: RankingWorld, status: string) {
  assertStatusCode(this.response.status, Number(status));
});

Then("API should return status message {string}", function (this: RankingWorld, statusMessage: string) {
  assertStatusMessage(this.response.statusText, statusMessage);
});

Then("the response should contain a valid list of activity rankings relevant to the weather conditions", function (this: RankingWorld) {
  validateSchema(rankingSuccessSchema, this.response.body);
  assertTotalDays(this.response.body);
});

Then("each day must have list {int} activities with activityId,name,score and reasoning", function (this: RankingWorld, count: number) {
  assertActivitiesPerDay(this.response.body, count);
});

Then("the response should contain a valid message with error code {string}", function (this: RankingWorld, errorCode: string) {
  assertErrorCode(this.response.body, errorCode);
  validateSchema(errorCode === "AMBIGUOUS_LOCATION" ? ambiguousLocationSchema : errorSchema, this.response.body);
});

Then("the error message should contain {string}", function (this: RankingWorld, expectedText: string) {
  assertErrorMessage(this.response.body, expectedText);
});

Then("the response should include a list of all possible countries matching the partial or incomplete location", function (this: RankingWorld) {
  assertMatchesHaveCountry(this.response.body);
});
