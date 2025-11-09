import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container py-16">
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  )
}

