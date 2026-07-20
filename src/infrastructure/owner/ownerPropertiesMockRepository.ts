import type {
  OwnerProperty,
  UpsertOwnerPropertyInput,
} from '@/domain/owner/OwnerProperty'
import { mockLatency } from '@/infrastructure/mock/mockFetch'
import {
  mockGetOwnerProperties,
  mockSetOwnerProperties,
} from '@/infrastructure/mock/mockStore'
import { useAuthStore } from '@/presentation/stores/authStore'

function requireOwnerUserId(ownerUserId?: string): string {
  const session = useAuthStore.getState().session
  const userId = ownerUserId || session?.user.id
  if (!userId) {
    throw new Error('auth.errors.sessionExpired')
  }
  if (session?.user.accountType !== 'owner') {
    throw new Error('owner.errors.signInRequired')
  }
  return userId
}

function fromInput(
  ownerUserId: string,
  input: UpsertOwnerPropertyInput,
  existingId?: string,
): OwnerProperty {
  return {
    id: existingId ?? `owner-prop-${crypto.randomUUID()}`,
    ownerUserId,
    purpose: input.purpose,
    title: input.title.trim(),
    titleAr: input.titleAr.trim(),
    location: input.location.trim(),
    locationAr: input.locationAr.trim(),
    propertyType: input.propertyType.trim(),
    price: input.price,
    rooms: input.rooms,
    beds: input.beds,
    baths: input.baths,
    windows: input.windows,
    areaSqft: input.areaSqft,
    lat: input.lat,
    lng: input.lng,
    imageUrl: input.imageUrl.trim(),
    galleryUrls: input.galleryUrls,
    address: input.address.trim(),
    addressAr: input.addressAr.trim(),
    ownerName: input.ownerName.trim(),
    ownerWhatsapp: input.ownerWhatsapp.trim(),
    estimatedValue: input.estimatedValue,
    estimatedPaymentMonthly: input.estimatedPaymentMonthly,
    hasWifi: input.hasWifi,
    hasHeater: input.hasHeater,
    hasGarden: input.hasGarden,
    heatingType: input.heatingType,
    garageSpaces: input.garageSpaces,
    tourVideoUrl: input.tourVideoUrl.trim(),
    updatedAt: new Date().toISOString(),
  }
}

/** Loads owner properties from localStorage. */
export async function fetchOwnerProperties(
  ownerUserId?: string,
): Promise<OwnerProperty[]> {
  await mockLatency()
  return mockGetOwnerProperties(requireOwnerUserId(ownerUserId))
}

export async function createOwnerProperty(
  ownerUserId: string,
  input: UpsertOwnerPropertyInput,
): Promise<OwnerProperty[]> {
  await mockLatency()
  const id = requireOwnerUserId(ownerUserId)
  const current = mockGetOwnerProperties(id)
  const next = [fromInput(id, input), ...current]
  return mockSetOwnerProperties(id, next)
}

export async function updateOwnerProperty(
  ownerUserId: string,
  propertyId: string,
  input: UpsertOwnerPropertyInput,
): Promise<OwnerProperty[]> {
  await mockLatency()
  const id = requireOwnerUserId(ownerUserId)
  const current = mockGetOwnerProperties(id)
  const index = current.findIndex((item) => item.id === propertyId)
  if (index < 0) {
    throw new Error('owner.errors.notFound')
  }

  const next = [...current]
  next[index] = fromInput(id, input, propertyId)
  return mockSetOwnerProperties(id, next)
}

export async function deleteOwnerProperty(
  ownerUserId: string,
  propertyId: string,
): Promise<OwnerProperty[]> {
  await mockLatency()
  const id = requireOwnerUserId(ownerUserId)
  const current = mockGetOwnerProperties(id)
  if (!current.some((item) => item.id === propertyId)) {
    throw new Error('owner.errors.notFound')
  }
  return mockSetOwnerProperties(
    id,
    current.filter((item) => item.id !== propertyId),
  )
}
