import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlineCheckCircle, HiOutlinePaperAirplane } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'

import type { ContactMessage } from '@/domain/contact/ContactMessage'
import {
  normalizeContactMessage,
  validateContactMessage,
} from '@/domain/contact/ContactMessage'
import { Spinner } from '@/components/ui/spinner'
import { useSubmitContact } from '@/presentation/hooks/useSubmitContact'

const EMPTY_FORM: ContactMessage = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export function ContactForm() {
  const { t } = useTranslation()
  const submitContact = useSubmitContact()
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactMessage, string>>
  >({})
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, reset } = useForm<ContactMessage>({
    defaultValues: EMPTY_FORM,
  })

  const onSubmit = (values: ContactMessage) => {
    const { valid, errors } = validateContactMessage(values)
    setFieldErrors(errors)

    if (!valid) return

    submitContact.mutate(normalizeContactMessage(values), {
      onSuccess: () => {
        setSent(true)
        reset(EMPTY_FORM)
        setFieldErrors({})
      },
    })
  }

  if (sent) {
    return (
      <div className="contact-form contact-form--success" role="status">
        <HiOutlineCheckCircle className="contact-form-success-icon" aria-hidden />
        <h2 className="contact-form-success-title">{t('contact.form.successTitle')}</h2>
        <p className="contact-form-success-text">{t('contact.form.success')}</p>
        <button
          type="button"
          className="contact-form-secondary-btn"
          onClick={() => {
            setSent(false)
            submitContact.reset()
          }}
        >
          {t('contact.form.sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={t('contact.form.label')}
    >
      <div className="contact-form-grid">
        <Field
          id="contact-name"
          label={t('contact.form.name')}
          error={fieldErrors.name ? t(fieldErrors.name) : undefined}
        >
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            className="contact-form-input"
            placeholder={t('contact.form.namePlaceholder')}
            aria-invalid={Boolean(fieldErrors.name)}
            {...register('name')}
          />
        </Field>

        <Field
          id="contact-email"
          label={t('contact.form.email')}
          error={fieldErrors.email ? t(fieldErrors.email) : undefined}
        >
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className="contact-form-input"
            placeholder={t('contact.form.emailPlaceholder')}
            aria-invalid={Boolean(fieldErrors.email)}
            {...register('email')}
          />
        </Field>

        <Field
          id="contact-phone"
          label={t('contact.form.phone')}
          optional
          optionalLabel={t('contact.form.optional')}
        >
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            className="contact-form-input"
            placeholder={t('contact.form.phonePlaceholder')}
            {...register('phone')}
          />
        </Field>

        <Field
          id="contact-subject"
          label={t('contact.form.subject')}
          error={fieldErrors.subject ? t(fieldErrors.subject) : undefined}
        >
          <input
            id="contact-subject"
            type="text"
            className="contact-form-input"
            placeholder={t('contact.form.subjectPlaceholder')}
            aria-invalid={Boolean(fieldErrors.subject)}
            {...register('subject')}
          />
        </Field>
      </div>

      <Field
        id="contact-message"
        label={t('contact.form.message')}
        error={fieldErrors.message ? t(fieldErrors.message) : undefined}
      >
        <textarea
          id="contact-message"
          rows={5}
          className="contact-form-textarea"
          placeholder={t('contact.form.messagePlaceholder')}
          aria-invalid={Boolean(fieldErrors.message)}
          {...register('message')}
        />
      </Field>

      {submitContact.isError && (
        <p className="contact-form-error" role="alert">
          {t('contact.form.error')}
        </p>
      )}

      <button
        type="submit"
        className="contact-form-submit"
        disabled={submitContact.isPending}
      >
        {submitContact.isPending ? (
          <>
            <Spinner className="size-5" />
            {t('contact.form.sending')}
          </>
        ) : (
          <>
            {t('contact.form.submit')}
            <HiOutlinePaperAirplane className="size-5" aria-hidden />
          </>
        )}
      </button>
    </form>
  )
}

type FieldProps = {
  id: string
  label: string
  children: ReactNode
  error?: string
  optional?: boolean
  optionalLabel?: string
}

function Field({
  id,
  label,
  children,
  error,
  optional,
  optionalLabel,
}: FieldProps) {
  return (
    <div className="contact-form-field">
      <label htmlFor={id} className="contact-form-label">
        {label}
        {optional && optionalLabel ? (
          <span className="contact-form-optional">{optionalLabel}</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="contact-form-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
