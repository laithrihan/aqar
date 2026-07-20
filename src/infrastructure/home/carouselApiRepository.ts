import type {
  CarouselSlide,
  CarouselSlidesResponse,
} from '@/domain/home/CarouselSlide'
import { apiFetch } from '@/infrastructure/api/apiClient'

/** Fetches panorama carousel slides from the API. */
export async function fetchCarouselSlides(): Promise<CarouselSlide[]> {
  const data = await apiFetch<CarouselSlidesResponse>('/carousel/slides', {
    errorFallback: 'Failed to load carousel slides',
  })
  return data.slides ?? []
}
