import type {
  ContactInfo,
  ContactInfoResponse,
  ContactMessage,
  ContactSubmitResponse,
} from '@/domain/contact/ContactMessage'
import { normalizeContactMessage } from '@/domain/contact/ContactMessage'

/**
 * Fetches public contact details from the temporary mock JSON.
 * Swap this for a real API endpoint later.
 */
export async function fetchContactInfo(): Promise<ContactInfo> {
  const response = await fetch('/mock/contact-info.json')

  if (!response.ok) {
    throw new Error('Failed to load contact info')
  }

  const data = (await response.json()) as ContactInfoResponse
  return data.info
}

/**
 * Simulates sending a contact message.
 * Replace with a real POST when the API is ready.
 */
export async function submitContactMessage(
  message: ContactMessage,
): Promise<ContactSubmitResponse> {
  const payload = normalizeContactMessage(message)

  await new Promise((resolve) => setTimeout(resolve, 700))

  if (!payload.email || !payload.message) {
    throw new Error('Failed to send contact message')
  }

  return { success: true }
}
