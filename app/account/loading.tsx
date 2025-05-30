import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <Skeleton className="w-48 h-10 mb-6" />

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/4">
          <Skeleton className="w-full h-[300px]" />
        </div>
        <div className="w-full md:w-3/4">
          <Skeleton className="w-full h-[500px]" />
        </div>
      </div>
    </div>
  )
}
