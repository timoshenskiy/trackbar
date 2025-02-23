import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonCard = () => {
  return (
    <Card className="relative overflow-hidden aspect-[4/3] border-0 bg-gray-900">
      <div className="relative h-full p-4 flex gap-6">
        <div className="relative w-1/2 flex-shrink-0">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2 mt-auto">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SkeletonCard
