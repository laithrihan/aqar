import { ListingsPage } from '@/presentation/components/listings/ListingsPage'
import { buyListingFeature } from '@/presentation/features/listings/listingFeature'

export function BuyPage() {
  return <ListingsPage config={buyListingFeature} />
}
