import { useQuery } from '@tanstack/react-query'

import { fetchContactInfo } from '@/infrastructure/contact/contactRepository'

export const contactInfoQueryKey = ['contact', 'info'] as const

export function useContactInfo() {
  return useQuery({
    queryKey: contactInfoQueryKey,
    queryFn: fetchContactInfo,
  })
}
