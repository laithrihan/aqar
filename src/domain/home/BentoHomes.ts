export type BentoImage = {
  id: string
  propertyId: string
  imageUrl: string
  title: string
  titleAr: string
}

export type BentoColumn = {
  id: string
  layout: 'stack' | 'tall'
  images: BentoImage[]
}

export type BentoColumnsResponse = {
  columns: BentoColumn[]
}
