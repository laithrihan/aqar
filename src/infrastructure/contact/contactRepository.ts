import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/contact/contactApiRepository'
import * as mock from '@/infrastructure/contact/contactMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const fetchContactInfo = impl.fetchContactInfo
export const submitContactMessage = impl.submitContactMessage
