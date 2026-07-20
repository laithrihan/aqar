import { isMockApiEnabled } from '@/infrastructure/mock/isMockApiEnabled'
import * as api from '@/infrastructure/home/carouselApiRepository'
import * as mock from '@/infrastructure/home/carouselMockRepository'

const impl = isMockApiEnabled() ? mock : api

export const fetchCarouselSlides = impl.fetchCarouselSlides
