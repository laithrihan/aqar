import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SignupAccountType } from '@/domain/auth/SignupCredentials'
import type { SignupCredentials } from '@/domain/auth/SignupCredentials'
import {
  SIGNUP_ACCOUNT_TYPES,
  getPasswordMatchStatus,
  validateSignupAccountType,
  validateSignupCredentials,
} from '@/domain/auth/SignupCredentials'
import { GoogleAuthActionButton } from '@/presentation/components/auth/GoogleAuthActionButton'
import { PasswordStrengthMeter } from '@/presentation/components/auth/PasswordStrengthMeter'
import { useGoogleSignUp } from '@/presentation/hooks/useGoogleAuth'
import { usePasswordSignup } from '@/presentation/hooks/usePasswordAuth'

type SignupModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMPTY_FORM: SignupCredentials = {
  accountType: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignupCredentials, string>>
  >({})
  const [authError, setAuthError] = useState<string | null>(null)

  const passwordSignup = usePasswordSignup()
  const googleSignUp = useGoogleSignUp()

  const { register, handleSubmit, reset, control, setValue, getValues } =
    useForm<SignupCredentials>({
      defaultValues: EMPTY_FORM,
    })

  const accountTypeValue = useWatch({
    control,
    name: 'accountType',
    defaultValue: '',
  })
  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })
  const confirmPasswordValue = useWatch({
    control,
    name: 'confirmPassword',
    defaultValue: '',
  })
  const matchStatus = getPasswordMatchStatus(
    passwordValue ?? '',
    confirmPasswordValue ?? '',
  )

  const busy = passwordSignup.isPending || googleSignUp.isPending

  const selectAccountType = (type: SignupAccountType) => {
    setValue('accountType', type, { shouldDirty: true, shouldValidate: false })
    if (fieldErrors.accountType) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next.accountType
        return next
      })
    }
  }

  const confirmInvalid =
    matchStatus === 'mismatch' ||
    (matchStatus === 'idle' && Boolean(fieldErrors.confirmPassword))

  const closeAndReset = () => {
    reset(EMPTY_FORM)
    setFieldErrors({})
    setAuthError(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
    onOpenChange(false)
  }

  const onSubmit = async (values: SignupCredentials) => {
    setAuthError(null)
    const { valid, errors } = validateSignupCredentials(values)
    setFieldErrors(errors)
    if (!valid) return

    try {
      await passwordSignup.mutateAsync(values)
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
    const accountType = getValues("accountType");
    const accountTypeError = validateSignupAccountType(accountType);
    if (accountTypeError || !accountType) {
      setFieldErrors((prev) => ({
        ...prev,
        accountType:
          accountTypeError ?? 'auth.signup.errors.accountTypeRequired',
      }))
      return
    }

    try {
      await googleSignUp.mutateAsync({ ...credential, accountType });
      closeAndReset();
    } catch (error) {
      const key =
        error instanceof Error && error.message.startsWith('auth.')
          ? error.message
          : 'auth.errors.googleFailed'
      setAuthError(key)
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset(EMPTY_FORM)
      setFieldErrors({})
      setAuthError(null)
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="login-modal">
        <DialogHeader className="login-modal-header">
          <DialogTitle>{t('auth.signup.title')}</DialogTitle>
        </DialogHeader>

        {/* Shared by email signup and Google OAuth */}
        <fieldset className="login-modal-field">
          <legend className="login-modal-label">
            {t('auth.signup.accountType')}
          </legend>
          <div
            className="login-modal-account-type"
            role="radiogroup"
            aria-invalid={Boolean(fieldErrors.accountType)}
            aria-required
            aria-label={t('auth.signup.accountType')}
          >
            {SIGNUP_ACCOUNT_TYPES.map((type) => {
              const selected = accountTypeValue === type
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={busy}
                  className={
                    selected
                      ? 'login-modal-account-type-option login-modal-account-type-option--selected'
                      : 'login-modal-account-type-option'
                  }
                  onClick={() => selectAccountType(type)}
                >
                  {t(`auth.signup.accountTypes.${type}`)}
                </button>
              )
            })}
          </div>
          {fieldErrors.accountType ? (
            <p className="login-modal-field-error" role="alert">
              {t(fieldErrors.accountType)}
            </p>
          ) : null}
        </fieldset>

        <form
          className="login-modal-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label={t('auth.signup.formLabel')}
        >
          {/* Keep accountType in form state for email signup validation */}
          <input type="hidden" {...register('accountType')} />

          <div className="login-modal-field">
            <label htmlFor="signup-username" className="login-modal-label">
              {t('auth.signup.username')}
            </label>
            <input
              id="signup-username"
              type="text"
              autoComplete="username"
              className="login-modal-input"
              placeholder={t('auth.signup.usernamePlaceholder')}
              aria-invalid={Boolean(fieldErrors.username)}
              disabled={busy}
              {...register('username')}
            />
            {fieldErrors.username ? (
              <p className="login-modal-field-error" role="alert">
                {t(fieldErrors.username)}
              </p>
            ) : null}
          </div>

          <div className="login-modal-field">
            <label htmlFor="signup-email" className="login-modal-label">
              {t('auth.signup.email')}
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              className="login-modal-input"
              placeholder={t('auth.signup.emailPlaceholder')}
              aria-invalid={Boolean(fieldErrors.email)}
              disabled={busy}
              {...register('email')}
            />
            {fieldErrors.email ? (
              <p className="login-modal-field-error" role="alert">
                {t(fieldErrors.email)}
              </p>
            ) : null}
          </div>

          <div className="login-modal-field">
            <label htmlFor="signup-password" className="login-modal-label">
              {t('auth.signup.password')}
            </label>
            <div className="login-modal-password-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="login-modal-input login-modal-input--password"
                placeholder={t('auth.signup.passwordPlaceholder')}
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
                    ? t('auth.signup.hidePassword')
                    : t('auth.signup.showPassword')
                }
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="size-5" aria-hidden />
                ) : (
                  <HiOutlineEye className="size-5" aria-hidden />
                )}
              </button>
            </div>
            <PasswordStrengthMeter password={passwordValue ?? ''} />
            {fieldErrors.password ? (
              <p className="login-modal-field-error" role="alert">
                {t(fieldErrors.password)}
              </p>
            ) : null}
          </div>

          <div className="login-modal-field">
            <label
              htmlFor="signup-confirm-password"
              className="login-modal-label"
            >
              {t('auth.signup.confirmPassword')}
            </label>
            <div className="login-modal-password-wrap">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="login-modal-input login-modal-input--password"
                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                aria-invalid={confirmInvalid}
                disabled={busy}
                {...register('confirmPassword', {
                  onChange: () => {
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        delete next.confirmPassword
                        return next
                      })
                    }
                  },
                })}
              />
              <button
                type="button"
                className="login-modal-password-toggle"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword
                    ? t('auth.signup.hidePassword')
                    : t('auth.signup.showPassword')
                }
              >
                {showConfirmPassword ? (
                  <HiOutlineEyeSlash className="size-5" aria-hidden />
                ) : (
                  <HiOutlineEye className="size-5" aria-hidden />
                )}
              </button>
            </div>
            {matchStatus === 'match' ? (
              <p className="login-modal-field-success" role="status">
                {t('auth.signup.passwordMatch')}
              </p>
            ) : null}
            {matchStatus === 'mismatch' ? (
              <p className="login-modal-field-error" role="alert">
                {t('auth.signup.errors.confirmMismatch')}
              </p>
            ) : matchStatus === 'idle' && fieldErrors.confirmPassword ? (
              <p className="login-modal-field-error" role="alert">
                {t(fieldErrors.confirmPassword)}
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
            {t('auth.signup.submit')}
          </button>
        </form>

        <div className="login-modal-divider" role="separator">
          <span>{t('auth.signup.or')}</span>
        </div>

        <GoogleAuthActionButton
          disabled={busy || !accountTypeValue}
          mode="signup"
          onGoogleCredential={onGoogleCredential}
          onError={setAuthError}
        />
      </DialogContent>
    </Dialog>
  )
}
