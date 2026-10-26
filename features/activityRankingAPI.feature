@activity-rankings
Feature: Activity Rankings API
As a user of the Activity Rankings API, I want to be able to retrieve a list of activity rankings 
so that I can see how different activities compare in popularity or engagement as per the weather.


@positive
  Scenario Outline: Passing valid city and town to the API to retrieve activity rankings based on weather conditions
    When I request the activity rankings in the specified "<city>" and town "<town>"
    Then API should return <status> in response
    And API should return status message "<statusMessage>"
    And the response should contain a valid list of activity rankings relevant to the weather conditions
    And each day must have list 4 activities with activityId,name,score and reasoning

  Examples:
    | city   | town    | status | statusMessage |
    | London | Bromley | 200    | OK            |

@negative
  Scenario Outline: Passing partial or incomplete city and town to the API to retrieve activity rankings
    When I request the activity rankings in the specified "<city>" and town "<town>"
    Then API should return <status> in response
    And API should return status message "<statusMessage>"
    And the response should contain a valid message with error code "<errorCode>"
    And the error message should contain "<errorMessage>"
    And the response should include a list of all possible countries matching the partial or incomplete location

  Examples:
    | city | town | status | statusMessage        | errorCode          | errorMessage               |
    | can  |      | 422    | Unprocessable Entity | AMBIGUOUS_LOCATION | matches multiple locations |

@negative
  Scenario Outline: Passing invalid city and town to the API to retrieve activity rankings
    When I request the activity rankings in the specified "<city>" and town "<town>"
    Then API should return <status> in response
    And API should return status message "<statusMessage>"
    And the response should contain a valid message with error code "<errorCode>"
    And the error message should contain "<errorMessage>"

  Examples:
    | city  | town  | status | statusMessage | errorCode          | errorMessage                            |
    | zzqxv |       | 404    | Not Found     | LOCATION_NOT_FOUND | could be found. Check the spelling once |
    |       | zzqxv | 404    | Not Found     | LOCATION_NOT_FOUND | could be found. Check the spelling once |
    | londf | brof  | 404    | Not Found     | LOCATION_NOT_FOUND | could be found. Check the spelling once |
    | null  | null  | 404    | Not Found     | LOCATION_NOT_FOUND | could be found. Check the spelling once |
    |       |       | 404    | Not Found     | LOCATION_NOT_FOUND | could be found. Check the spelling once |

@negative
  Scenario Outline: If Open Meteo being down and unable to provide weather data
    When I request the activity rankings in the specified "<city>" and town "<town>"
    Then API should return <status> in response
    And API should return status message "<statusMessage>"
    And the response should contain a valid message with error code "<errorCode>"
    And the error message should contain "<errorMessage>"

  Examples:
    | city | town | status | statusMessage        | errorCode          | errorMessage               |
    | can  |      | 422    | Unprocessable Entity | AMBIGUOUS_LOCATION | matches multiple locations |


@edge @negative
  Scenario Outline: Handling different upstream conditions for Open Meteo service
    Given the Open Meteo service is "<upstreamCondition>"
    And the request includes header "<headerKey>" with value "<headerValue>"
    When I request the activity rankings in the specified "<city>" and town "<town>"
    Then API should return "<status>" in response
    And API should return status message "<statusMessage>"
    And the response should contain a valid message with error code "<errorCode>"
    And the error message should contain "<errorMessage>"

  Examples:
    | upstreamCondition     | headerKey               | headerValue               | city     | town      | status | statusMessage         | errorCode                    | errorMessage                            |
    | down                  | x-mock-response-name    | 502 Bad Gateway           | London   | Bromley   | 502    | Bad Gateway           | UPSTREAM_WEATHER_UNAVAILABLE | Weather data is temporarily unavailable |
    | rate-limited          | x-mock-response-name    | 502 Bad Gateway           | London   | Bromley   | 502    | Bad Gateway           | UPSTREAM_WEATHER_UNAVAILABLE | Weather data is temporarily unavailable |
    | timing-out            | x-mock-response-name    | 504 Gateway Timeout       | London   | Bromley   | 504    | Gateway Timeout       | UPSTREAM_WEATHER_TIMEOUT     | Weather data is temporarily unavailable |
    | service unavailable   | x-mock-response-name    | 503 Service Unavailable   | London   | Bromley   | 503    | Service Unavailable   | UPSTREAM_WEATHER_UNAVAILABLE | Weather data is temporarily unavailable |
    | Internal server error | x-mock-response-name    | 500 Internal Server Error | London   | Bromley   | 500    | Internal Server Error | UPSTREAM_WEATHER_UNAVAILABLE | Weather data is temporarily unavailable |

