const DEFAULT_DELAY_MS = 180

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/** Fetches a static JSON file from `/mocks` with a short artificial latency. */
export async function fetchMockJson<T>(
  fileName: string,
  errorFallback = 'Failed to load mock data',
): Promise<T> {
  await delay(DEFAULT_DELAY_MS)

  let response: Response
  try {
    response = await fetch(`/mocks/${fileName}`)
  } catch {
    throw new Error(errorFallback)
  }

  if (!response.ok) {
    throw new Error(errorFallback)
  }

  return response.json() as Promise<T>
}

export async function mockLatency(): Promise<void> {
  await delay(DEFAULT_DELAY_MS)
}
