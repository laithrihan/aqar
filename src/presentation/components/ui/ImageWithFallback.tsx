import { useState, type ImgHTMLAttributes } from 'react'

import { PROPERTY_IMAGE_FALLBACK } from '@/shared/lib/imageFallback'

type ImageWithFallbackProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  fallbackSrc = PROPERTY_IMAGE_FALLBACK,
  alt = '',
  className,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)
  const [prevFallbackSrc, setPrevFallbackSrc] = useState(fallbackSrc)

  // Reset error state when the intended source changes (React "adjusting state during render").
  if (src !== prevSrc || fallbackSrc !== prevFallbackSrc) {
    setPrevSrc(src)
    setPrevFallbackSrc(fallbackSrc)
    setHasError(false)
  }

  const currentSrc = !src || hasError ? fallbackSrc : src

  return (
    <img
      key={src ?? 'empty'}
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        const displayedSrc = event.currentTarget.getAttribute('src')

        if (!hasError && src && displayedSrc === src && currentSrc !== fallbackSrc) {
          setHasError(true)
        }

        onError?.(event)
      }}
    />
  )
}
