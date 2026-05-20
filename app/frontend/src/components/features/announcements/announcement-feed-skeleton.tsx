import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AnnouncementFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardHeader className="pb-3 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div className="h-5 w-24 rounded-full bg-muted/40 animate-pulse" />
              <div className="h-6 w-32 rounded-full bg-muted/40 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-muted/40 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted/40 rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/40 rounded animate-pulse" />
              <div className="h-3 w-[90%] bg-muted/40 rounded animate-pulse" />
              <div className="h-3 w-[80%] bg-muted/40 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="h-6 w-6 rounded-full bg-muted/40 animate-pulse" />
              <div className="space-y-1">
                <div className="h-2.5 w-20 bg-muted/40 rounded animate-pulse" />
                <div className="h-2 w-12 bg-muted/40 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
