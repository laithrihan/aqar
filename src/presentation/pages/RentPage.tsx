import { ListingsPage } from '@/presentation/components/listings/ListingsPage'
import { rentListingFeature } from '@/presentation/features/listings/listingFeature'

export function RentPage() {
  return <ListingsPage config={rentListingFeature} />
}
