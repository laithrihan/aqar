import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/owner/ownerPropertiesApiRepository'
import * as mock from '@/infrastructure/owner/ownerPropertiesMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const fetchOwnerProperties = impl.fetchOwnerProperties
export const createOwnerProperty = impl.createOwnerProperty
export const updateOwnerProperty = impl.updateOwnerProperty
export const deleteOwnerProperty = impl.deleteOwnerProperty
