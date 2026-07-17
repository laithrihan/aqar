import type { BentoColumn, BentoColumnsResponse } from '@/domain/home/BentoHomes'

/**
 * Fetches explore-homes bento columns from the temporary mock JSON.
 * Swap this for a real API endpoint later.
 */
export async function fetchBentoHomesColumns(): Promise<BentoColumn[]> {
  const response = await fetch('/mock/bento-homes.json')

  if (!response.ok) {
    throw new Error('Failed to load bento homes columns')
  }

  const data = (await response.json()) as BentoColumnsResponse
  return data.columns
}
