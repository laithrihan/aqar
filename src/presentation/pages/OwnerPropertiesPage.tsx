import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OwnerProperty } from '@/domain/owner/OwnerProperty'
import { OwnerPropertyFormDialog } from '@/presentation/components/owner/OwnerPropertyFormDialog'
import {
  useCreateOwnerProperty,
  useDeleteOwnerProperty,
  useOwnerProperties,
  useUpdateOwnerProperty,
} from '@/presentation/hooks/useOwnerProperties'
import { useAuthUiStore } from '@/presentation/stores/authUiStore'
import { useAuthStore } from '@/presentation/stores/authStore'

export function OwnerPropertiesPage() {
  const { t } = useTranslation()
  const session = useAuthStore((s) => s.session)
  const openLogin = useAuthUiStore((s) => s.openLogin)
  const isOwner = session?.user.accountType === 'owner'

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<OwnerProperty | null>(null)

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useOwnerProperties()
  const createMutation = useCreateOwnerProperty()
  const updateMutation = useUpdateOwnerProperty()
  const deleteMutation = useDeleteOwnerProperty()

  const isSaving = createMutation.isPending || updateMutation.isPending

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (property: OwnerProperty) => {
    setEditing(property)
    setDialogOpen(true)
  }

  const handleSubmit = (input: Parameters<typeof createMutation.mutate>[0]) => {
    if (editing) {
      updateMutation.mutate(
        { propertyId: editing.id, input },
        { onSuccess: () => setDialogOpen(false) },
      )
      return
    }

    createMutation.mutate(input, {
      onSuccess: () => setDialogOpen(false),
    })
  }

  if (!session) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('owner.signInTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('owner.signInSubtitle')}
            </p>
            <Button onClick={openLogin}>{t('nav.login')}</Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!isOwner) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('owner.onlyOwnerTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('owner.onlyOwnerSubtitle')}
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 lg:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">{t('owner.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('owner.subtitle')}</p>
      </header>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t('owner.count', { count: properties.length })}
        </p>
        <Button onClick={openCreate}>{t('owner.actions.create')}</Button>
      </div>

      {isLoading ? <p>{t('common.loading')}</p> : null}
      {isError ? (
        <p className="text-sm text-destructive">{t('owner.errors.loadFailed')}</p>
      ) : null}

      {!isLoading && properties.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {t('owner.empty')}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-1">{property.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{property.titleAr}</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <PropertyMeta
                  label={t('owner.table.purpose')}
                  value={t(`saved.purpose.${property.purpose}`)}
                />
                <PropertyMeta
                  label={t('owner.table.type')}
                  value={t(`search.propertyTypes.${property.propertyType}`)}
                />
                <PropertyMeta
                  label={t('owner.table.price')}
                  value={`$${property.price.toLocaleString()}`}
                />
                <PropertyMeta
                  label={t('owner.table.roomsBeds')}
                  value={`${property.rooms} / ${property.beds}`}
                />
                <PropertyMeta
                  label={t('owner.table.baths')}
                  value={String(property.baths)}
                />
                <PropertyMeta
                  label={t('owner.table.areaSqft')}
                  value={property.areaSqft ? String(property.areaSqft) : '-'}
                />
              </div>
              <PropertyMeta label={t('owner.table.location')} value={property.location} />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(property)}>
                  {t('owner.actions.edit')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(property.id)}
                  disabled={deleteMutation.isPending}
                >
                  {t('owner.actions.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OwnerPropertyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />
    </section>
  )
}

function PropertyMeta({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">{label}: </span>
      {value}
    </p>
  )
}
