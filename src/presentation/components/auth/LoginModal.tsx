import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type LoginFormValues = {
  identifier: string
  password: string
}

type LoginModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, reset } = useForm<LoginFormValues>({
    defaultValues: { identifier: '', password: '' },
  })

  const onSubmit = (_values: LoginFormValues) => {
  }

  const onGoogleLogin = () => {
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset()
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
              {...register('identifier')}
            />
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
          </div>

          <button type="submit" className="login-modal-submit">
            {t('auth.login.submit')}
          </button>
        </form>

        <div className="login-modal-divider" role="separator">
          <span>{t('auth.login.or')}</span>
        </div>

        <button
          type="button"
          className="login-modal-google"
          onClick={onGoogleLogin}
        >
          <FcGoogle className="size-5 shrink-0" aria-hidden />
          {t('auth.login.google')}
        </button>
      </DialogContent>
    </Dialog>
  )
}
