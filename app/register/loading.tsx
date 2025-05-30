import { Skeleton } from "@/components/ui/skeleton"

export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-24 h-8" />
          </div>
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Card */}
        <div className="border border-[#d1e6d9] rounded-lg bg-white p-6">
          <div className="space-y-6">
            {/* Form fields */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Terms checkbox */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-full" />
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-full" />

            {/* Divider */}
            <div className="relative my-6">
              <Skeleton className="h-px w-full" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <Skeleton className="h-5 w-8" />
              </div>
            </div>

            {/* Google button */}
            <Skeleton className="h-12 w-full" />

            {/* Login link */}
            <div className="text-center mt-6">
              <Skeleton className="h-5 w-48 mx-auto" />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-2">
              <Skeleton className="w-5 h-5 mt-0.5" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
