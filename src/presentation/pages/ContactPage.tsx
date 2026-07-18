import { ContactForm } from '@/presentation/components/contact/ContactForm'
import { ContactHero } from '@/presentation/components/contact/ContactHero'
import { ContactInfoPanel } from '@/presentation/components/contact/ContactInfoPanel'
import { useContactInfo } from '@/presentation/hooks/useContactInfo'

export function ContactPage() {
  const { data, isLoading, isError } = useContactInfo()

  return (
    <div className="contact-page">
      <ContactHero />

      <div className="contact-page-layout">
        <ContactInfoPanel
          info={data}
          isLoading={isLoading}
          isError={isError}
        />
        <ContactForm />
      </div>
    </div>
  )
}
