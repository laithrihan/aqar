import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { PropertyDetail } from '@/domain/property/PropertyDetail'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'
import { cn } from '@/shared/lib/cn'
import { getPropertyGalleryThumbs } from '@/shared/lib/propertyGallery'

type PropertyGalleryProps = {
  property: PropertyDetail
}

/** Main image preview with up to three selectable thumbnails. */
export function PropertyGallery({ property }: PropertyGalleryProps) {
  const { t } = useTranslation()
  const thumbs = getPropertyGalleryThumbs(property.imageUrl, property.galleryUrls)
  const [activeUrl, setActiveUrl] = useState(thumbs[0] ?? property.imageUrl)

  return (
    <div className="property-gallery">
      <div className="property-gallery-main">
        <ImageWithFallback
          src={activeUrl}
          alt={t(property.titleKey)}
          className="property-gallery-main-image"
        />
      </div>

      <ul className="property-gallery-thumbs" role="list">
        {thumbs.map((url, index) => (
          <li key={`${url}-${index}`}>
            <button
              type="button"
              className={cn(
                'property-gallery-thumb',
                url === activeUrl && 'property-gallery-thumb--active',
              )}
              onClick={() => setActiveUrl(url)}
              aria-label={t('property.gallery.thumb', { number: index + 1 })}
              aria-pressed={url === activeUrl}
            >
              <ImageWithFallback
                src={url}
                alt=""
                className="property-gallery-thumb-image"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
