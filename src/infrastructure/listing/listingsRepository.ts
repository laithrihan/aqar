import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/listing/listingsApiRepository'
import * as mock from '@/infrastructure/listing/listingsMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const fetchAllListings = impl.fetchAllListings
export const fetchListingById = impl.fetchListingById
