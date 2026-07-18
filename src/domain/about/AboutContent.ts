export type AboutValue = {
  id: string
  titleKey: string
  descriptionKey: string
  icon: 'home' | 'shield' | 'map'
}

export type AboutContent = {
  imageUrl: string
  values: AboutValue[]
}

export const ABOUT_CONTENT: AboutContent = {
  imageUrl:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  values: [
    {
      id: 'curated',
      titleKey: 'about.values.curated.title',
      descriptionKey: 'about.values.curated.description',
      icon: 'home',
    },
    {
      id: 'trust',
      titleKey: 'about.values.trust.title',
      descriptionKey: 'about.values.trust.description',
      icon: 'shield',
    },
    {
      id: 'local',
      titleKey: 'about.values.local.title',
      descriptionKey: 'about.values.local.description',
      icon: 'map',
    },
  ],
}
