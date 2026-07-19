import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { BentoColumn, BentoImage } from '@/domain/home/BentoHomes'
import { ImageWithFallback } from '@/presentation/components/ui/ImageWithFallback'
import { cn } from '@/shared/lib/cn'
import { localizedText } from '@/shared/lib/localizedText'

type BentoHomesCarouselProps = {
  columns: BentoColumn[]
}

const AUTO_SCROLL_PX_PER_FRAME = 0.6

export function BentoHomesCarousel({ columns }: BentoHomesCarouselProps) {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef(false)
  const lastPointerXRef = useRef(0)
  const setWidthRef = useRef(0)
  const prefersReducedMotionRef = useRef(false)
  const isVisibleRef = useRef(true)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const measure = () => {
      if (setRef.current) {
        setWidthRef.current = setRef.current.offsetWidth
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [columns])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotionRef.current = media.matches

    const onMotionChange = () => {
      prefersReducedMotionRef.current = media.matches
    }

    media.addEventListener('change', onMotionChange)

    let frameId = 0

    const wrapOffset = () => {
      const setWidth = setWidthRef.current
      if (setWidth <= 0) return

      while (offsetRef.current <= -setWidth) {
        offsetRef.current += setWidth
      }
      while (offsetRef.current > 0) {
        offsetRef.current -= setWidth
      }
    }

    const applyTransform = () => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      }
    }

    const tick = () => {
      // Stop the loop entirely while off-screen to save CPU/GPU work
      if (!isVisibleRef.current) {
        frameId = 0
        return
      }

      if (!draggingRef.current && !prefersReducedMotionRef.current) {
        offsetRef.current -= AUTO_SCROLL_PX_PER_FRAME
        wrapOffset()
        applyTransform()
      }

      frameId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (frameId !== 0) return
      frameId = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      if (frameId === 0) return
      cancelAnimationFrame(frameId)
      frameId = 0
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0 },
    )

    observer.observe(root)
    startLoop()

    return () => {
      stopLoop()
      observer.disconnect()
      media.removeEventListener('change', onMotionChange)
    }
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Let “View home” receive the click without starting a drag
    if ((event.target as HTMLElement).closest('.bento-homes-view')) return

    draggingRef.current = true
    lastPointerXRef.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return

    const delta = event.clientX - lastPointerXRef.current
    lastPointerXRef.current = event.clientX
    offsetRef.current += delta

    const setWidth = setWidthRef.current
    if (setWidth > 0) {
      while (offsetRef.current <= -setWidth) offsetRef.current += setWidth
      while (offsetRef.current > 0) offsetRef.current -= setWidth
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
    }
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return

    draggingRef.current = false
    setIsDragging(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  if (columns.length === 0) return null

  return (
    <div
      ref={rootRef}
      className={cn(
        'bento-homes-carousel',
        isDragging && 'bento-homes-carousel--dragging',
      )}
      aria-roledescription="carousel"
      aria-label={t('home.explore.bento.label')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="bento-homes-carousel-viewport">
        <div ref={trackRef} className="bento-homes-carousel-track">
          <BentoColumnSet ref={setRef} columns={columns} />
          <BentoColumnSet columns={columns} decorative />
        </div>
      </div>
    </div>
  )
}

type BentoColumnSetProps = {
  columns: BentoColumn[]
  decorative?: boolean
  ref?: React.Ref<HTMLDivElement>
}

function BentoColumnSet({
  columns,
  decorative = false,
  ref,
}: BentoColumnSetProps) {
  return (
    <div
      ref={ref}
      className="bento-homes-carousel-set"
      aria-hidden={decorative || undefined}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            'bento-homes-column',
            column.layout === 'stack'
              ? 'bento-homes-column--stack'
              : 'bento-homes-column--tall',
          )}
        >
          {column.images.map((image) => (
            <BentoHomeTile
              key={image.id}
              image={image}
              decorative={decorative}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

type BentoHomeTileProps = {
  image: BentoImage
  decorative?: boolean
}

function BentoHomeTile({ image, decorative = false }: BentoHomeTileProps) {
  const { t, i18n } = useTranslation()
  const title = localizedText(i18n.language, image.title, image.titleAr)
  const detailPath = `/homes/${image.propertyId}`

  return (
    <div className="bento-homes-tile">
      <ImageWithFallback
        src={image.imageUrl}
        alt={decorative ? '' : title}
        className="bento-homes-image"
        loading="lazy"
        draggable={false}
      />

      <Link
        to={detailPath}
        className="bento-homes-view"
        tabIndex={decorative ? -1 : undefined}
        aria-hidden={decorative || undefined}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {t('home.explore.bento.viewHome')}
      </Link>
    </div>
  )
}
