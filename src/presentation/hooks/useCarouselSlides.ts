import { useQuery } from '@tanstack/react-query'

import { fetchCarouselSlides } from '@/infrastructure/home/carouselRepository'

/** Query key for the home panorama carousel. */
export const carouselSlidesQueryKey = ['home', 'carousel-slides'] as const

/** Loads panorama carousel slides for the home hero. */
export function useCarouselSlides() {
  return useQuery({
    queryKey: carouselSlidesQueryKey,
    queryFn: fetchCarouselSlides,
  })
}
