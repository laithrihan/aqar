import { describe, expect, it } from 'vitest'

import {
  normalizeContactMessage,
  validateContactMessage,
  type ContactMessage,
} from '@/domain/contact/ContactMessage'

function message(
  overrides: Partial<ContactMessage> = {},
): ContactMessage {
  return {
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    phone: '+966500000000',
    subject: 'Property inquiry',
    message: 'I would like more details about this listing.',
    ...overrides,
  }
}

describe('normalizeContactMessage', () => {
  it('trims fields and lowercases email', () => {
    expect(
      normalizeContactMessage(
        message({
          name: '  Sara  ',
          email: '  Sara@Example.COM ',
          phone: ' 123 ',
          subject: ' Hello ',
          message: '  Enough characters here. ',
        }),
      ),
    ).toEqual({
      name: 'Sara',
      email: 'sara@example.com',
      phone: '123',
      subject: 'Hello',
      message: 'Enough characters here.',
    })
  })
})

describe('validateContactMessage', () => {
  it('accepts a complete valid message', () => {
    expect(validateContactMessage(message())).toEqual({
      valid: true,
      errors: {},
    })
  })

  it('requires name, email, subject, and message', () => {
    const result = validateContactMessage(
      message({
        name: '   ',
        email: '',
        subject: ' ',
        message: '',
      }),
    )

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual({
      name: 'contact.form.errors.nameRequired',
      email: 'contact.form.errors.emailRequired',
      subject: 'contact.form.errors.subjectRequired',
      message: 'contact.form.errors.messageRequired',
    })
  })

  it('rejects an invalid email format', () => {
    const result = validateContactMessage(message({ email: 'not-an-email' }))

    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('contact.form.errors.emailInvalid')
  })

  it('rejects messages shorter than 10 characters', () => {
    const result = validateContactMessage(message({ message: 'Too short' }))

    expect(result.valid).toBe(false)
    expect(result.errors.message).toBe('contact.form.errors.messageShort')
  })

  it('does not require phone', () => {
    const result = validateContactMessage(message({ phone: '' }))

    expect(result).toEqual({ valid: true, errors: {} })
  })

  it('validates against normalized values (trim / email case)', () => {
    const result = validateContactMessage(
      message({
        name: '  Sara ',
        email: '  SARA@Example.COM ',
        message: '  Ten chars! ',
      }),
    )

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })
})
