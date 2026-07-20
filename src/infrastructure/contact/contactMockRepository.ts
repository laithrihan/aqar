import type {
  ContactInfo,
  ContactInfoResponse,
  ContactMessage,
  ContactSubmitResponse,
} from '@/domain/contact/ContactMessage'
import { normalizeContactMessage } from '@/domain/contact/ContactMessage'
import { fetchMockJson, mockLatency } from '@/infrastructure/mock/mockFetch'

/** Fetches public contact details from local mock JSON. */
export async function fetchContactInfo(): Promise<ContactInfo> {
  const data = await fetchMockJson<ContactInfoResponse>(
    'contact-info.json',
    'Failed to load contact info',
  )
  return data.info
}

/** Accepts a contact message locally (always succeeds). */
export async function submitContactMessage(
  message: ContactMessage,
): Promise<ContactSubmitResponse> {
  const payload = normalizeContactMessage(message)

  if (!payload.email || !payload.message) {
    throw new Error('Failed to send contact message')
  }

  await mockLatency()
  return { success: true }
}
