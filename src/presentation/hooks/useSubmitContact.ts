import { useMutation } from '@tanstack/react-query'

import type { ContactMessage } from '@/domain/contact/ContactMessage'
import { submitContactMessage } from '@/infrastructure/contact/contactRepository'

export function useSubmitContact() {
  return useMutation({
    mutationFn: (message: ContactMessage) => submitContactMessage(message),
  })
}
