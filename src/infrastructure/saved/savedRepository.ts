import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/saved/savedApiRepository'
import * as mock from '@/infrastructure/saved/savedMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const fetchSavedListingIds = impl.fetchSavedListingIds
export const toggleSavedListing = impl.toggleSavedListing
export const removeSavedListing = impl.removeSavedListing
