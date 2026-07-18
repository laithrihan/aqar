import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/cn'

type ListingCardSkeletonProps = {
  cardClassName: string
  bodyClassName: string
  imageClassName?: string
}

export function ListingCardSkeleton({
  cardClassName,
  bodyClassName,
  imageClassName,
}: ListingCardSkeletonProps) {
  return (
    <div className={cardClassName} aria-hidden>
      <Skeleton
        className={cn('aspect-[4/3] w-full rounded-none', imageClassName)}
      />
      <div className={bodyClassName}>
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-3 w-[45%]" />
        <Skeleton className="mt-1 h-4 w-[40%]" />
        <div className="mt-auto flex gap-2 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  )
}

type ListingCardsSkeletonProps = ListingCardSkeletonProps & {
  count?: number
  gridClassName: string
}

export function ListingCardsSkeleton({
  count = 4,
  gridClassName,
  ...cardProps
}: ListingCardsSkeletonProps) {
  return (
    <div className={gridClassName} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <ListingCardSkeleton key={index} {...cardProps} />
      ))}
    </div>
  )
}
