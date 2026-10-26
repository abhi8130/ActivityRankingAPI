import { request } from "@playwright/test";
import { env } from "../config/env";

export interface ApiResponse {
  request: {
    method: string;
    baseURL: string;
    endpoint: string;
    queryParams: Record<string, string>;
    headers: Record<string, string>;
  };
  status: number;
  statusText: string;
  body: any;
}

export async function getActivityRankings(
  city: string,
  town: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse> {
  const context = await request.newContext({
    baseURL: env.baseURL,
    extraHTTPHeaders: env.headers,
    timeout: env.timeout,
  });

  const response = await context.get(env.endpoints.activityRankings, {
    params: { city, town },
    headers,
  });

  const result: ApiResponse = {
    request: {
      method: "GET",
      baseURL: env.baseURL,
      endpoint: env.endpoints.activityRankings,
      queryParams: { city, town },
      headers: { ...env.headers, ...headers },
    },
    status: response.status(),
    statusText: response.statusText(),
    body: await response.json(),
  };
  await context.dispose();
  return result;
}
