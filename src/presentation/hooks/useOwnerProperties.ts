import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  OwnerProperty,
  UpsertOwnerPropertyInput,
} from '@/domain/owner/OwnerProperty'
import {
  createOwnerProperty,
  deleteOwnerProperty,
  fetchOwnerProperties,
  updateOwnerProperty,
} from '@/infrastructure/owner/ownerPropertiesRepository'
import { useAuthStore } from '@/presentation/stores/authStore'

export function ownerPropertiesQueryKey(ownerUserId: string) {
  return ['owner-properties', ownerUserId] as const
}

export function useOwnerProperties() {
  const ownerUserId = useAuthStore((s) => s.session?.user.id)

  return useQuery({
    queryKey: ownerPropertiesQueryKey(ownerUserId ?? 'anonymous'),
    queryFn: () => fetchOwnerProperties(ownerUserId!),
    enabled: Boolean(ownerUserId),
    initialData: ownerUserId ? undefined : [],
  })
}

function useOwnerCacheWriter() {
  const ownerUserId = useAuthStore((s) => s.session?.user.id)
  const queryClient = useQueryClient()

  const writeCache = (rows: OwnerProperty[]) => {
    if (!ownerUserId) return
    queryClient.setQueryData(ownerPropertiesQueryKey(ownerUserId), rows)
    void queryClient.invalidateQueries({ queryKey: ['listings'] })
  }

  return { ownerUserId, writeCache }
}

export function useCreateOwnerProperty() {
  const { ownerUserId, writeCache } = useOwnerCacheWriter()

  return useMutation({
    mutationFn: (input: UpsertOwnerPropertyInput) => {
      if (!ownerUserId) throw new Error('owner.errors.signInRequired')
      return createOwnerProperty(ownerUserId, input)
    },
    onSuccess: writeCache,
  })
}

export function useUpdateOwnerProperty() {
  const { ownerUserId, writeCache } = useOwnerCacheWriter()

  return useMutation({
    mutationFn: ({
      propertyId,
      input,
    }: {
      propertyId: string
      input: UpsertOwnerPropertyInput
    }) => {
      if (!ownerUserId) throw new Error('owner.errors.signInRequired')
      return updateOwnerProperty(ownerUserId, propertyId, input)
    },
    onSuccess: writeCache,
  })
}

export function useDeleteOwnerProperty() {
  const { ownerUserId, writeCache } = useOwnerCacheWriter()

  return useMutation({
    mutationFn: (propertyId: string) => {
      if (!ownerUserId) throw new Error('owner.errors.signInRequired')
      return deleteOwnerProperty(ownerUserId, propertyId)
    },
    onSuccess: writeCache,
  })
}

