import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/home/propertySearchApiRepository'
import * as mock from '@/infrastructure/home/propertySearchMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const fetchPropertySearchFilterOptions =
  impl.fetchPropertySearchFilterOptions
export const fetchLocationSuggestions = impl.fetchLocationSuggestions
