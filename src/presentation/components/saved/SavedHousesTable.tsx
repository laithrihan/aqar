import { Link } from 'react-router-dom'
import { MdOutlineBed, MdOutlineMeetingRoom } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import type { Listing } from '@/domain/listing/Listing'
import { resolveSavedListings } from '@/domain/saved/SavedListing'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'
import {
  useRemoveSavedListing,
  useSavedListingIds,
} from '@/presentation/hooks/useSavedListings'
import { useAllListings } from '@/presentation/hooks/useListings'
import { useAuthStore } from '@/presentation/stores/authStore'
import { useAuthUiStore } from '@/presentation/stores/authUiStore'
import { formatPrice } from '@/shared/lib/formatPrice'
import { localizedText } from '@/shared/lib/localizedText'

export function SavedHousesTable() {
  const { t, i18n } = useTranslation()
  const session = useAuthStore((s) => s.session)
  const hydrated = useAuthStore((s) => s.hydrated)
  const openLogin = useAuthUiStore((s) => s.openLogin)

  const listingsQuery = useAllListings()
  const savedIdsQuery = useSavedListingIds()
  const removeSaved = useRemoveSavedListing()

  if (!hydrated) {
    return (
      <p className="saved-houses-status" role="status">
        {t('common.loading')}
      </p>
    )
  }

  if (!session) {
    return (
      <div className="saved-houses-empty">
        <p>{t('saved.signInPrompt')}</p>
        <button
          type="button"
          className="saved-houses-sign-in"
          onClick={openLogin}
        >
          {t('nav.login')}
        </button>
      </div>
    )
  }

  if (listingsQuery.isLoading || savedIdsQuery.isLoading) {
    return (
      <p className="saved-houses-status" role="status">
        {t('saved.loading')}
      </p>
    )
  }

  if (listingsQuery.isError || savedIdsQuery.isError) {
    return (
      <p className="saved-houses-status" role="alert">
        {t('saved.errors.loadFailed')}
      </p>
    )
  }

  const savedListings = resolveSavedListings(
    listingsQuery.data ?? [],
    savedIdsQuery.data ?? [],
  )

  if (savedListings.length === 0) {
    return (
      <div className="saved-houses-empty">
        <p>{t('saved.empty')}</p>
        <div className="saved-houses-empty-actions">
          <Link to="/rent" className="saved-houses-browse-link">
            {t('nav.rent')}
          </Link>
          <Link to="/buy" className="saved-houses-browse-link">
            {t('nav.buy')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <ul className="saved-houses-cards">
        {savedListings.map((listing) => (
          <SavedHouseCard
            key={listing.id}
            listing={listing}
            language={i18n.language}
            removing={
              removeSaved.isPending && removeSaved.variables === listing.id
            }
            onRemove={() => removeSaved.mutate(listing.id)}
          />
        ))}
      </ul>

      {/* Desktop: data table */}
      <div className="saved-houses-table-wrap">
        <table className="saved-houses-table">
          <thead>
            <tr>
              <th scope="col">{t('saved.table.property')}</th>
              <th scope="col">{t('saved.table.location')}</th>
              <th scope="col">{t('saved.table.price')}</th>
              <th scope="col">{t('saved.table.type')}</th>
              <th scope="col">{t('saved.table.details')}</th>
              <th scope="col">
                <span className="sr-only">{t('saved.table.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {savedListings.map((listing) => (
              <SavedHouseRow
                key={listing.id}
                listing={listing}
                language={i18n.language}
                removing={
                  removeSaved.isPending &&
                  removeSaved.variables === listing.id
                }
                onRemove={() => removeSaved.mutate(listing.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

type SavedHouseItemProps = {
  listing: Listing
  language: string
  removing: boolean
  onRemove: () => void
}

function useSavedHouseLabels(listing: Listing, language: string) {
  const { t } = useTranslation()
  const title = localizedText(language, listing.title, listing.titleAr)
  const location = localizedText(
    language,
    listing.location,
    listing.locationAr,
  )
  const purposeKey =
    listing.purpose === 'rent' ? 'saved.purpose.rent' : 'saved.purpose.sale'

  return {
    title,
    location,
    purpose: t(purposeKey),
    price: formatPrice(listing.price, language),
  }
}

function SavedHouseMeta({ listing }: { listing: Listing }) {
  return (
    <div className="saved-houses-meta">
      {listing.rooms > 0 ? (
        <span className="saved-houses-meta-item">
          <MdOutlineMeetingRoom aria-hidden />
          {listing.rooms}
        </span>
      ) : null}
      {listing.beds > 0 ? (
        <span className="saved-houses-meta-item">
          <MdOutlineBed aria-hidden />
          {listing.beds}
        </span>
      ) : null}
    </div>
  )
}

function SavedHouseActions({
  listingId,
  removing,
  onRemove,
}: {
  listingId: string
  removing: boolean
  onRemove: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="saved-houses-actions">
      <Link to={`/homes/${listingId}`} className="saved-houses-view">
        {t('saved.view')}
      </Link>
      <button
        type="button"
        className="saved-houses-remove"
        disabled={removing}
        onClick={onRemove}
      >
        {t('saved.unsave')}
      </button>
    </div>
  )
}

function SavedHouseCard({
  listing,
  language,
  removing,
  onRemove,
}: SavedHouseItemProps) {
  const labels = useSavedHouseLabels(listing, language)

  return (
    <li className="saved-houses-card">
      <Link to={`/homes/${listing.id}`} className="saved-houses-card-media">
        <ImageWithFallback
          src={listing.imageUrl}
          alt=""
          className="saved-houses-card-image"
          loading="lazy"
        />
      </Link>

      <div className="saved-houses-card-body">
        <div className="saved-houses-card-top">
          <Link to={`/homes/${listing.id}`} className="saved-houses-card-title">
            {labels.title}
          </Link>
          <span className="saved-houses-card-purpose">{labels.purpose}</span>
        </div>

        <p className="saved-houses-card-location">{labels.location}</p>
        <p className="saved-houses-price">{labels.price}</p>
        <SavedHouseMeta listing={listing} />
        <SavedHouseActions
          listingId={listing.id}
          removing={removing}
          onRemove={onRemove}
        />
      </div>
    </li>
  )
}

function SavedHouseRow({
  listing,
  language,
  removing,
  onRemove,
}: SavedHouseItemProps) {
  const labels = useSavedHouseLabels(listing, language)

  return (
    <tr>
      <td>
        <Link to={`/homes/${listing.id}`} className="saved-houses-property">
          <ImageWithFallback
            src={listing.imageUrl}
            alt=""
            className="saved-houses-thumb"
            loading="lazy"
          />
          <span className="saved-houses-property-title">{labels.title}</span>
        </Link>
      </td>
      <td>{labels.location}</td>
      <td className="saved-houses-price">{labels.price}</td>
      <td>{labels.purpose}</td>
      <td>
        <SavedHouseMeta listing={listing} />
      </td>
      <td>
        <SavedHouseActions
          listingId={listing.id}
          removing={removing}
          onRemove={onRemove}
        />
      </td>
    </tr>
  )
}
