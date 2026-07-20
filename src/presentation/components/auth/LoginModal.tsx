import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { LoginCredentials } from '@/domain/auth/LoginCredentials'
import { validateLoginCredentials } from '@/domain/auth/LoginCredentials'
import { GoogleAuthActionButton } from '@/presentation/components/auth/GoogleAuthActionButton'
import { useGoogleSignIn } from '@/presentation/hooks/useGoogleAuth'
import { usePasswordLogin } from '@/presentation/hooks/usePasswordAuth'

type LoginModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMPTY_FORM: LoginCredentials = {
  identifier: '',
  password: '',
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginCredentials, string>>
  >({})
  const [authError, setAuthError] = useState<string | null>(null)

  const passwordLogin = usePasswordLogin()
  const googleSignIn = useGoogleSignIn()

  const { register, handleSubmit, reset } = useForm<LoginCredentials>({
    defaultValues: EMPTY_FORM,
  })

  const busy = passwordLogin.isPending || googleSignIn.isPending

  const closeAndReset = () => {
    reset(EMPTY_FORM)
    setFieldErrors({})
    setAuthError(null)
    setShowPassword(false)
    onOpenChange(false)
  }

  const onSubmit = async (values: LoginCredentials) => {
    setAuthError(null)
    const { valid, errors } = validateLoginCredentials(values)
    setFieldErrors(errors)
    if (!valid) return

    try {
      await passwordLogin.mutateAsync(values)
      closeAndReset()
    } catch (error) {
      const key =
        error instanceof Error && error.message.startsWith('auth.')
          ? error.message
          : 'auth.errors.generic'
      setAuthError(key)
    }
  };

  const onGoogleCredential = async (credential: {
    idToken?: string;
    accessToken?: string;
  }) => {
    setAuthError(null);
    try {
      await googleSignIn.mutateAsync(credential);
      closeAndReset();
    } catch (error) {
      const key =
        error instanceof Error && error.message.startsWith('auth.')
          ? error.message
          : 'auth.errors.googleFailed'
      setAuthError(key)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset(EMPTY_FORM)
      setFieldErrors({})
      setAuthError(null)
      setShowPassword(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="login-modal">
        <DialogHeader className="login-modal-header">
          <DialogTitle>{t('auth.login.title')}</DialogTitle>
          <DialogDescription>{t('auth.login.subtitle')}</DialogDescription>
        </DialogHeader>

        <form
          className="login-modal-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label={t('auth.login.formLabel')}
        >
          <div className="login-modal-field">
            <label htmlFor="login-identifier" className="login-modal-label">
              {t('auth.login.identifier')}
            </label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              className="login-modal-input"
              placeholder={t('auth.login.identifierPlaceholder')}
              aria-invalid={Boolean(fieldErrors.identifier)}
              disabled={busy}
              {...register('identifier')}
            />
            {fieldErrors.identifier ? (
              <p className="login-modal-field-error" role="alert">
                {t(fieldErrors.identifier)}
              </p>
            ) : null}
          </div>

          <div className="login-modal-field">
            <label htmlFor="login-password" className="login-modal-label">
              {t('auth.login.password')}
            </label>
            <div className="login-modal-password-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="login-modal-input login-modal-input--password"
                placeholder={t('auth.login.passwordPlaceholder')}
                aria-invalid={Boolean(fieldErrors.password)}
                disabled={busy}
                {...register('password')}
              />
              <button
                type="button"
                className="login-modal-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword
                    ? t('auth.login.hidePassword')
                    : t('auth.login.showPassword')
                }
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="size-5" aria-hidden />
                ) : (
                  <HiOutlineEye className="size-5" aria-hidden />
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="login-modal-field-error" role="alert">
                {t(fieldErrors.password)}
              </p>
            ) : null}
          </div>

          {authError ? (
            <p className="login-modal-field-error" role="alert">
              {t(authError)}
            </p>
          ) : null}

          <button
            type="submit"
            className="login-modal-submit"
            disabled={busy}
          >
            {t('auth.login.submit')}
          </button>
        </form>

        <div className="login-modal-divider" role="separator">
          <span>{t('auth.login.or')}</span>
        </div>

        <GoogleAuthActionButton
          disabled={busy}
          onGoogleCredential={onGoogleCredential}
          onError={setAuthError}
        />
      </DialogContent>
    </Dialog>
  )
}
