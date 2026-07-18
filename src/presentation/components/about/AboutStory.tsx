import { useTranslation } from 'react-i18next'

import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'

type AboutStoryProps = {
  imageUrl: string
}

export function AboutStory({ imageUrl }: AboutStoryProps) {
  const { t } = useTranslation()

  return (
    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-story-media">
        <ImageWithFallback
          src={imageUrl}
          alt={t('about.story.imageAlt')}
          className="about-story-image"
        />
      </div>

      <div className="about-story-copy">
        <h2 id="about-story-title" className="about-story-title">
          {t('about.story.title')}
        </h2>
        <p className="about-story-text">{t('about.story.body')}</p>
        <p className="about-story-text">{t('about.story.bodySecondary')}</p>
      </div>
    </section>
  )
}
