import type {
  CarouselSlide,
  CarouselSlidesResponse,
} from '@/domain/home/CarouselSlide'
import { fetchMockJson } from '@/infrastructure/mock/mockFetch'

/** Fetches panorama carousel slides from local mock JSON. */
export async function fetchCarouselSlides(): Promise<CarouselSlide[]> {
  const data = await fetchMockJson<CarouselSlidesResponse>(
    'carousel.json',
    'Failed to load carousel slides',
  )
  return data.slides ?? []
}
