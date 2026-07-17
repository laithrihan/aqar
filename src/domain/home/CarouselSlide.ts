export type CarouselSlide = {
  id: string
  imageUrl: string
  titleKey: string
  subtitleKey: string
}

export type CarouselSlidesResponse = {
  slides: CarouselSlide[]
}
