import { describe, expect, it } from 'vitest'

import type { LocationSuggestion } from '@/domain/home/PropertySearch'
import {
  filterLocationSuggestions,
  getLocationSuggestionLabel,
  resolveLocationInputDisplay,
} from '@/domain/home/filterLocationSuggestions'

const locations: LocationSuggestion[] = [
  { value: 'Damascus', label: 'Damascus', labelAr: 'دمشق' },
  { value: 'Mezzeh, Damascus', label: 'Mezzeh, Damascus', labelAr: 'المزة، دمشق' },
  { value: 'Aleppo', label: 'Aleppo', labelAr: 'حلب' },
  { value: 'Latakia', label: 'Latakia', labelAr: 'اللاذقية' },
]

describe('filterLocationSuggestions', () => {
  it('returns empty for blank query', () => {
    expect(filterLocationSuggestions(locations, '  ')).toEqual([])
  })

  it('matches English labels case-insensitively', () => {
    const result = filterLocationSuggestions(locations, 'dam')
    expect(result.map((l) => l.value)).toEqual([
      'Damascus',
      'Mezzeh, Damascus',
    ])
  })

  it('matches Arabic labels', () => {
    const result = filterLocationSuggestions(locations, 'حلب')
    expect(result).toHaveLength(1)
    expect(result[0]?.value).toBe('Aleppo')
  })

  it('limits results to eight', () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      value: `Place ${i}`,
      label: `Place ${i}`,
      labelAr: `مكان ${i}`,
    }))
    expect(filterLocationSuggestions(many, 'Place')).toHaveLength(8)
  })
})

describe('resolveLocationInputDisplay', () => {
  it('shows the Arabic label when the stored value matches a suggestion', () => {
    expect(
      resolveLocationInputDisplay('Aleppo', locations, 'ar'),
    ).toBe('حلب')
  })

  it('returns free-text unchanged when it is not a suggestion value', () => {
    expect(
      resolveLocationInputDisplay('حلب', locations, 'ar'),
    ).toBe('حلب')
  })
})

describe('getLocationSuggestionLabel', () => {
  it('picks EN or AR from the language code', () => {
    const aleppo = locations[2]!
    expect(getLocationSuggestionLabel(aleppo, 'en')).toBe('Aleppo')
    expect(getLocationSuggestionLabel(aleppo, 'ar-SY')).toBe('حلب')
  })
})
