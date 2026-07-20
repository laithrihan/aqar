import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type {
  OwnerProperty,
  UpsertOwnerPropertyInput,
} from '@/domain/owner/OwnerProperty'
import { validateOwnerPropertyInput } from '@/domain/owner/OwnerProperty'
import { LocationSearchInput } from '@/presentation/components/home/LocationSearchInput'
import { OwnerLocationMapPicker } from '@/presentation/components/owner/OwnerLocationMapPicker'
import { cn } from '@/shared/lib/cn'

const PROPERTY_TYPE_VALUES = ['apartment', 'villa', 'house', 'land', 'office']
const HEATING_OPTIONS = ['forced_air', 'central', 'none'] as const

const EMPTY_OWNER_PROPERTY_FORM: UpsertOwnerPropertyInput = {
  purpose: 'sale',
  title: '',
  titleAr: '',
  location: '',
  locationAr: '',
  propertyType: 'apartment',
  price: 0,
  rooms: 1,
  beds: 1,
  baths: 1,
  windows: 1,
  areaSqft: null,
  lat: 33.5138,
  lng: 36.2765,
  imageUrl: '',
  galleryUrls: [],
  address: '',
  addressAr: '',
  ownerName: '',
  ownerWhatsapp: '',
  estimatedValue: 0,
  estimatedPaymentMonthly: 0,
  hasWifi: false,
  hasHeater: false,
  hasGarden: false,
  heatingType: 'none',
  garageSpaces: 0,
  tourVideoUrl: '',
}

/** Map an existing owner property (or create mode) into form input values. */
function toOwnerPropertyFormInput(
  property: OwnerProperty | null,
): UpsertOwnerPropertyInput {
  if (!property) return EMPTY_OWNER_PROPERTY_FORM

  return {
    purpose: property.purpose,
    title: property.title,
    titleAr: property.titleAr,
    location: property.location,
    locationAr: property.locationAr,
    propertyType: property.propertyType,
    price: property.price,
    rooms: property.rooms,
    beds: property.beds,
    baths: property.baths,
    windows: property.windows,
    areaSqft: property.areaSqft,
    lat: property.lat,
    lng: property.lng,
    imageUrl: property.imageUrl,
    galleryUrls: property.galleryUrls,
    address: property.address,
    addressAr: property.addressAr,
    ownerName: property.ownerName,
    ownerWhatsapp: property.ownerWhatsapp,
    estimatedValue: property.estimatedValue,
    estimatedPaymentMonthly: property.estimatedPaymentMonthly,
    hasWifi: property.hasWifi,
    hasHeater: property.hasHeater,
    hasGarden: property.hasGarden,
    heatingType: property.heatingType,
    garageSpaces: property.garageSpaces,
    tourVideoUrl: property.tourVideoUrl,
  }
}

/** Stable key so the form remounts when opening create vs edit / switching properties. */
function formSessionKey(open: boolean, editing: OwnerProperty | null): string | null {
  if (!open) return null
  return editing?.id ?? 'create'
}

type OwnerPropertyFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: OwnerProperty | null
  isSaving: boolean
  onSubmit: (input: UpsertOwnerPropertyInput) => void
}

export function OwnerPropertyFormDialog({
  open,
  onOpenChange,
  editing,
  isSaving,
  onSubmit,
}: OwnerPropertyFormDialogProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<UpsertOwnerPropertyInput>(EMPTY_OWNER_PROPERTY_FORM)
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpsertOwnerPropertyInput, string>>
  >({})

  // Reset form when the dialog opens or the edited property changes (no effect).
  const sessionKey = formSessionKey(open, editing)
  const [activeSessionKey, setActiveSessionKey] = useState<string | null>(null)
  if (sessionKey !== activeSessionKey) {
    setActiveSessionKey(sessionKey)
    if (sessionKey) {
      setForm(toOwnerPropertyFormInput(editing))
      setErrors({})
    }
  }

  const formMode = editing ? 'edit' : 'create'
  const title = useMemo(
    () =>
      formMode === 'edit'
        ? t('owner.form.editTitle')
        : t('owner.form.createTitle'),
    [formMode, t],
  )

  const updateForm = <K extends keyof UpsertOwnerPropertyInput>(
    key: K,
    value: UpsertOwnerPropertyInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateGalleryFromText = (text: string) => {
    const list = text
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)
    updateForm('galleryUrls', list)
  }

  const submitForm = () => {
    const result = validateOwnerPropertyInput(form)
    setErrors(result.errors)
    if (!result.valid) return
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t('owner.form.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <FormSection title={t('owner.form.sections.basic')}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t('owner.form.purpose')} htmlFor="owner-purpose">
                <Select
                  value={form.purpose}
                  onValueChange={(value) =>
                    updateForm('purpose', value as UpsertOwnerPropertyInput['purpose'])
                  }
                >
                  <SelectTrigger id="owner-purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">{t('saved.purpose.sale')}</SelectItem>
                    <SelectItem value="rent">{t('saved.purpose.rent')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label={t('owner.form.type')}
                htmlFor="owner-property-type"
                error={errors.propertyType ? t(errors.propertyType) : undefined}
              >
                <Select
                  value={form.propertyType}
                  onValueChange={(value) => updateForm('propertyType', value)}
                >
                  <SelectTrigger id="owner-property-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPE_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`search.propertyTypes.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label={t('owner.form.title')}
                htmlFor="owner-title"
                error={errors.title ? t(errors.title) : undefined}
              >
                <Input
                  id="owner-title"
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                />
              </FormField>

              <FormField
                label={t('owner.form.titleAr')}
                htmlFor="owner-title-ar"
                error={errors.titleAr ? t(errors.titleAr) : undefined}
              >
                <Input
                  id="owner-title-ar"
                  value={form.titleAr}
                  onChange={(event) => updateForm('titleAr', event.target.value)}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title={t('owner.form.sections.location')}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label={t('owner.form.location')}
                htmlFor="owner-location"
                error={errors.location ? t(errors.location) : undefined}
              >
                <LocationSearchInput
                  id="owner-location"
                  value={form.location}
                  onChange={(value) => updateForm('location', value)}
                  onSuggestionSelect={(location) =>
                    setForm((prev) => ({
                      ...prev,
                      location: location.label,
                      locationAr: location.labelAr,
                    }))
                  }
                  className="owner-form-location-search"
                  iconClassName="owner-form-location-search-icon"
                  inputClassName="owner-form-location-search-input"
                />
              </FormField>

              <FormField
                label={t('owner.form.locationAr')}
                htmlFor="owner-location-ar"
                error={errors.locationAr ? t(errors.locationAr) : undefined}
              >
                <Input
                  id="owner-location-ar"
                  value={form.locationAr}
                  onChange={(event) => updateForm('locationAr', event.target.value)}
                />
              </FormField>

              <FormField
                label={t('owner.form.address')}
                htmlFor="owner-address"
                error={errors.address ? t(errors.address) : undefined}
              >
                <Input
                  id="owner-address"
                  value={form.address}
                  onChange={(event) => updateForm('address', event.target.value)}
                />
              </FormField>

              <FormField
                label={t('owner.form.addressAr')}
                htmlFor="owner-address-ar"
                error={errors.addressAr ? t(errors.addressAr) : undefined}
              >
                <Input
                  id="owner-address-ar"
                  value={form.addressAr}
                  onChange={(event) => updateForm('addressAr', event.target.value)}
                />
              </FormField>
            </div>

            <OwnerLocationMapPicker
              lat={form.lat}
              lng={form.lng}
              onChange={({ lat, lng }) => {
                updateForm('lat', lat)
                updateForm('lng', lng)
              }}
              latError={errors.lat ? t(errors.lat) : undefined}
              lngError={errors.lng ? t(errors.lng) : undefined}
            />
          </FormSection>

          <FormSection title={t('owner.form.sections.pricing')}>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                label={t('owner.form.price')}
                htmlFor="owner-price"
                error={errors.price ? t(errors.price) : undefined}
              >
                <Input
                  id="owner-price"
                  type="number"
                  min={1}
                  value={form.price}
                  onChange={(event) => updateForm('price', Number(event.target.value))}
                />
              </FormField>

              <FormField
                label={t('owner.form.estimatedValue')}
                htmlFor="owner-estimated-value"
                error={errors.estimatedValue ? t(errors.estimatedValue) : undefined}
              >
                <Input
                  id="owner-estimated-value"
                  type="number"
                  min={1}
                  value={form.estimatedValue}
                  onChange={(event) =>
                    updateForm('estimatedValue', Number(event.target.value))
                  }
                />
              </FormField>

              <FormField
                label={t('owner.form.estimatedPaymentMonthly')}
                htmlFor="owner-estimated-payment"
                error={
                  errors.estimatedPaymentMonthly
                    ? t(errors.estimatedPaymentMonthly)
                    : undefined
                }
              >
                <Input
                  id="owner-estimated-payment"
                  type="number"
                  min={1}
                  value={form.estimatedPaymentMonthly}
                  onChange={(event) =>
                    updateForm('estimatedPaymentMonthly', Number(event.target.value))
                  }
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title={t('owner.form.sections.details')}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                label={t('owner.form.rooms')}
                htmlFor="owner-rooms"
                error={errors.rooms ? t(errors.rooms) : undefined}
              >
                <Input
                  id="owner-rooms"
                  type="number"
                  min={1}
                  value={form.rooms}
                  onChange={(event) => updateForm('rooms', Number(event.target.value))}
                />
              </FormField>

              <FormField
                label={t('owner.form.beds')}
                htmlFor="owner-beds"
                error={errors.beds ? t(errors.beds) : undefined}
              >
                <Input
                  id="owner-beds"
                  type="number"
                  min={1}
                  value={form.beds}
                  onChange={(event) => updateForm('beds', Number(event.target.value))}
                />
              </FormField>

              <FormField
                label={t('owner.form.baths')}
                htmlFor="owner-baths"
                error={errors.baths ? t(errors.baths) : undefined}
              >
                <Input
                  id="owner-baths"
                  type="number"
                  min={1}
                  value={form.baths}
                  onChange={(event) => updateForm('baths', Number(event.target.value))}
                />
              </FormField>

              <FormField
                label={t('owner.form.windows')}
                htmlFor="owner-windows"
                error={errors.windows ? t(errors.windows) : undefined}
              >
                <Input
                  id="owner-windows"
                  type="number"
                  min={1}
                  value={form.windows}
                  onChange={(event) => updateForm('windows', Number(event.target.value))}
                />
              </FormField>

              <FormField
                label={t('owner.form.areaSqft')}
                htmlFor="owner-area"
                error={errors.areaSqft ? t(errors.areaSqft) : undefined}
              >
                <Input
                  id="owner-area"
                  type="number"
                  min={1}
                  value={form.areaSqft ?? ''}
                  onChange={(event) =>
                    updateForm(
                      'areaSqft',
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                />
              </FormField>

              <FormField
                label={t('owner.form.garageSpaces')}
                htmlFor="owner-garage"
                error={errors.garageSpaces ? t(errors.garageSpaces) : undefined}
              >
                <Input
                  id="owner-garage"
                  type="number"
                  min={0}
                  value={form.garageSpaces}
                  onChange={(event) =>
                    updateForm('garageSpaces', Number(event.target.value))
                  }
                />
              </FormField>

              <FormField label={t('owner.form.heatingType')} htmlFor="owner-heating">
                <Select
                  value={form.heatingType}
                  onValueChange={(value) =>
                    updateForm(
                      'heatingType',
                      value as UpsertOwnerPropertyInput['heatingType'],
                    )
                  }
                >
                  <SelectTrigger id="owner-heating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HEATING_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`owner.form.heating.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <AmenityCheckbox
                id="owner-wifi"
                label={t('property.amenities.wifi')}
                checked={form.hasWifi}
                onCheckedChange={(checked) => updateForm('hasWifi', checked === true)}
              />
              <AmenityCheckbox
                id="owner-heater"
                label={t('property.amenities.heater')}
                checked={form.hasHeater}
                onCheckedChange={(checked) => updateForm('hasHeater', checked === true)}
              />
              <AmenityCheckbox
                id="owner-garden"
                label={t('property.amenities.garden')}
                checked={form.hasGarden}
                onCheckedChange={(checked) => updateForm('hasGarden', checked === true)}
              />
            </div>
          </FormSection>

          <FormSection title={t('owner.form.sections.media')}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label={t('owner.form.imageUrl')}
                htmlFor="owner-image-url"
                error={errors.imageUrl ? t(errors.imageUrl) : undefined}
              >
                <Input
                  id="owner-image-url"
                  value={form.imageUrl}
                  onChange={(event) => updateForm('imageUrl', event.target.value)}
                />
              </FormField>

              <FormField label={t('owner.form.tourVideoUrl')} htmlFor="owner-tour-video">
                <Input
                  id="owner-tour-video"
                  value={form.tourVideoUrl}
                  onChange={(event) => updateForm('tourVideoUrl', event.target.value)}
                />
              </FormField>

              <FormField
                label={t('owner.form.galleryUrls')}
                htmlFor="owner-gallery"
                className="md:col-span-2"
              >
                <Textarea
                  id="owner-gallery"
                  rows={4}
                  placeholder={t('owner.form.galleryHint')}
                  value={form.galleryUrls.join('\n')}
                  onChange={(event) => updateGalleryFromText(event.target.value)}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title={t('owner.form.sections.owner')}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label={t('owner.form.ownerName')}
                htmlFor="owner-name"
                error={errors.ownerName ? t(errors.ownerName) : undefined}
              >
                <Input
                  id="owner-name"
                  value={form.ownerName}
                  onChange={(event) => updateForm('ownerName', event.target.value)}
                />
              </FormField>

              <FormField
                label={t('owner.form.ownerWhatsapp')}
                htmlFor="owner-whatsapp"
                error={errors.ownerWhatsapp ? t(errors.ownerWhatsapp) : undefined}
              >
                <Input
                  id="owner-whatsapp"
                  value={form.ownerWhatsapp}
                  onChange={(event) => updateForm('ownerWhatsapp', event.target.value)}
                />
              </FormField>
            </div>
          </FormSection>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t('owner.actions.cancel')}
          </Button>
          <Button type="button" disabled={isSaving} onClick={submitForm}>
            {formMode === 'edit'
              ? t('owner.actions.saveChanges')
              : t('owner.actions.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4 rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      {children}
    </section>
  )
}

function FormField({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

function AmenityCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  )
}
