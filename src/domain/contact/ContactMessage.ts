export type ContactMessage = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export type ContactInfo = {
  email: string
  phone: string
  addressKey: string
  hoursKey: string
}

export type ContactInfoResponse = {
  info: ContactInfo
}

export type ContactSubmitResponse = {
  success: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeContactMessage(
  values: ContactMessage,
): ContactMessage {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  }
}

export function validateContactMessage(values: ContactMessage): {
  valid: boolean
  errors: Partial<Record<keyof ContactMessage, string>>
} {
  const normalized = normalizeContactMessage(values)
  const errors: Partial<Record<keyof ContactMessage, string>> = {}

  if (!normalized.name) errors.name = 'contact.form.errors.nameRequired'
  if (!normalized.email) {
    errors.email = 'contact.form.errors.emailRequired'
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.email = 'contact.form.errors.emailInvalid'
  }
  if (!normalized.subject) errors.subject = 'contact.form.errors.subjectRequired'
  if (!normalized.message) {
    errors.message = 'contact.form.errors.messageRequired'
  } else if (normalized.message.length < 10) {
    errors.message = 'contact.form.errors.messageShort'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
