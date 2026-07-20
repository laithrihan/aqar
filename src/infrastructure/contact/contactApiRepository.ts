import type {
  ContactInfo,
  ContactInfoResponse,
  ContactMessage,
  ContactSubmitResponse,
} from '@/domain/contact/ContactMessage'
import { normalizeContactMessage } from '@/domain/contact/ContactMessage'
import { apiFetch } from '@/infrastructure/api/apiClient'

/** Fetches public contact details from the API. */
export async function fetchContactInfo(): Promise<ContactInfo> {
  const data = await apiFetch<ContactInfoResponse>('/contact/info', {
    errorFallback: 'Failed to load contact info',
  })
  return data.info
}

/** Submits a contact message to the API. */
export async function submitContactMessage(
  message: ContactMessage,
): Promise<ContactSubmitResponse> {
  const payload = normalizeContactMessage(message)

  if (!payload.email || !payload.message) {
    throw new Error('Failed to send contact message')
  }

  return apiFetch<ContactSubmitResponse>('/contact/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
    errorFallback: 'Failed to send contact message',
  })
}
