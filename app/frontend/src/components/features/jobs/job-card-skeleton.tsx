import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-muted h-full flex flex-col animate-pulse">
      <CardHeader className="pb-3 space-y-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t border-border/50 mt-auto">
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}
