import { APIProvider, AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''
const MAP_ID =
  import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() || 'DEMO_MAP_ID'

const DAMASCUS_CENTER = { lat: 33.5138, lng: 36.2765 }

type OwnerLocationMapPickerProps = {
  lat: number
  lng: number
  onChange: (coords: { lat: number; lng: number }) => void
  latError?: string
  lngError?: string
}

/** Interactive map for picking property coordinates (click or drag marker). */
export function OwnerLocationMapPicker({
  lat,
  lng,
  onChange,
  latError,
  lngError,
}: OwnerLocationMapPickerProps) {
  const { t } = useTranslation()
  const position = { lat, lng }
  const locationError = latError ?? lngError

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          {t('owner.form.mapUnavailable')}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="owner-lat-fallback">{t('owner.form.latitude')}</Label>
            <Input
              id="owner-lat-fallback"
              type="number"
              step="0.000001"
              value={lat}
              onChange={(event) =>
                onChange({ lat: Number(event.target.value), lng })
              }
            />
            {latError ? (
              <p className="text-xs text-destructive">{latError}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner-lng-fallback">{t('owner.form.longitude')}</Label>
            <Input
              id="owner-lng-fallback"
              type="number"
              step="0.000001"
              value={lng}
              onChange={(event) =>
                onChange({ lat, lng: Number(event.target.value) })
              }
            />
            {lngError ? (
              <p className="text-xs text-destructive">{lngError}</p>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">{t('owner.form.mapHint')}</p>
        <div
          className="h-56 overflow-hidden rounded-lg border border-border sm:h-64"
          role="region"
          aria-label={t('owner.form.mapLabel')}
        >
          <Map
            center={position}
            defaultCenter={DAMASCUS_CENTER}
            defaultZoom={13}
            zoom={13}
            mapId={MAP_ID}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="size-full"
            onClick={(event) => {
              const next = event.detail.latLng
              if (!next) return
              onChange({ lat: next.lat, lng: next.lng })
            }}
          >
            <AdvancedMarker
              position={position}
              draggable
              onDragEnd={(event) => {
                const next = event.latLng
                if (!next) return
                onChange({ lat: next.lat(), lng: next.lng() })
              }}
            >
              <Pin
                background="#1a3a4a"
                borderColor="#0f2430"
                glyphColor="#ffffff"
                scale={1.15}
              />
            </AdvancedMarker>
          </Map>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('owner.form.coordinates', {
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
          })}
        </p>
        {locationError ? (
          <p className="text-xs text-destructive">{locationError}</p>
        ) : null}
      </div>
    </APIProvider>
  )
}
