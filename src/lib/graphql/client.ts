/**
 * Native fetch GraphQL client for WPGraphQL.
 * Do not introduce Apollo, urql, or other heavy GraphQL clients.
 *
 * Implementation lands in a later pass — this file is the intended import path.
 */

import { env } from "@/lib/env"

export type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  init?: RequestInit & { next?: NextFetchRequestConfig; cache?: RequestCache }
): Promise<T> {
  const res = await fetch(env.wordpressApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify({ query, variables }),
    ...init,
  })

  if (!res.ok) {
    throw new Error(`WPGraphQL HTTP ${res.status}`)
  }

  const json = (await res.json()) as GraphQLResponse<T>

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "))
  }

  if (!json.data) {
    throw new Error("WPGraphQL returned no data")
  }

  return json.data
}
