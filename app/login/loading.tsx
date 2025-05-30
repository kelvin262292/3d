import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-24 h-8" />
          </div>
          <Skeleton className="h-10 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>

        {/* Card */}
        <div className="border border-[#d1e6d9] rounded-lg bg-white p-6">
          <div className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Login button */}
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

            {/* Sign up link */}
            <div className="text-center mt-6">
              <Skeleton className="h-5 w-48 mx-auto" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
      </div>
    </div>
  )
}
