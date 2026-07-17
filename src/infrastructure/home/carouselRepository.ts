import type { CarouselSlide, CarouselSlidesResponse } from '@/domain/home/CarouselSlide'

/**
 * Fetches panorama carousel slides from the temporary mock JSON.
 * Swap this for a real API endpoint later.
 */
export async function fetchCarouselSlides(): Promise<CarouselSlide[]> {
  const response = await fetch('/mock/carousel-slides.json')

  if (!response.ok) {
    throw new Error('Failed to load carousel slides')
  }

  const data = (await response.json()) as CarouselSlidesResponse
  return data.slides
}
