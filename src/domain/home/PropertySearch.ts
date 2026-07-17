export type SearchListingMode = 'sale' | 'rent' | 'invest'

export type SearchFilterOption = {
  value: string
  labelKey: string
}

export type PropertySearchFilterOptions = {
  propertyTypes: SearchFilterOption[]
  priceRanges: SearchFilterOption[]
  rooms: SearchFilterOption[]
  beds: SearchFilterOption[]
}

export type PropertySearchFilters = {
  mode: SearchListingMode
  location: string
  propertyType: string
  priceRange: string
  rooms: string
  beds: string
}
