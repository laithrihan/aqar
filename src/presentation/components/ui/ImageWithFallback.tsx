import { useState, type ImgHTMLAttributes } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/cn'

type ImageWithFallbackProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
}

export function ImageWithFallback({
  src,
  alt = '',
  className,
  onError,
  onLoad,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(!src)
  const [isLoaded, setIsLoaded] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setHasError(!src)
    setIsLoaded(false)
  }

  const showSkeleton = !src || hasError || !isLoaded

  return (
    <div className={cn('relative', className)}>
      {showSkeleton ? (
        <Skeleton
          className="absolute inset-0 size-full rounded-none"
          aria-hidden
        />
      ) : null}

      {src && !hasError ? (
        <img
          key={src}
          {...props}
          src={src}
          alt={alt}
          className={cn(
            'relative size-full object-cover object-center',
            !isLoaded && 'opacity-0',
          )}
          onLoad={(event) => {
            setIsLoaded(true)
            onLoad?.(event)
          }}
          onError={(event) => {
            setHasError(true)
            setIsLoaded(false)
            onError?.(event)
          }}
        />
      ) : null}
    </div>
  )
}
