import { ABOUT_CONTENT } from '@/domain/about/AboutContent'
import { AboutCta } from '@/presentation/components/about/AboutCta'
import { AboutHero } from '@/presentation/components/about/AboutHero'
import { AboutStory } from '@/presentation/components/about/AboutStory'
import { AboutValues } from '@/presentation/components/about/AboutValues'

export function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutStory imageUrl={ABOUT_CONTENT.imageUrl} />
      <AboutValues values={ABOUT_CONTENT.values} />
      <AboutCta />
    </div>
  )
}
