import { FaArrowRight } from 'react-icons/fa6'
import { HiOutlineMail } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

/** Newsletter subscribe bar that overlaps the top of the footer. */
export function FooterNewsletter() {
  const { t } = useTranslation()

  return (
    <form
      className="footer-newsletter"
      onSubmit={(event) => event.preventDefault()}
    >
      <HiOutlineMail className="footer-newsletter-icon" aria-hidden />

      <input
        type="email"
        name="email"
        placeholder={t('footer.subscribePlaceholder')}
        className="footer-newsletter-input"
        aria-label={t('footer.subscribePlaceholder')}
      />

      <button type="submit" className="footer-newsletter-btn">
        {t('footer.subscribeDone')}
        <FaArrowRight className="footer-newsletter-arrow" aria-hidden />
      </button>
    </form>
  )
}
