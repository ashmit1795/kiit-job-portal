"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function NotificationsPrefs() {
  const queryClient = useQueryClient();

  const { data: prefs, isLoading } = useQuery({
    queryKey: ["profile", "notifications"],
    queryFn: profileService.getNotificationPrefs,
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateNotificationPrefs,
    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({ queryKey: ["profile", "notifications"] });
      const previousPrefs = queryClient.getQueryData(["profile", "notifications"]);
      queryClient.setQueryData(["profile", "notifications"], (old: any) => ({
        ...old,
        ...newPrefs,
      }));
      return { previousPrefs };
    },
    onError: (err, newPrefs, context) => {
      queryClient.setQueryData(["profile", "notifications"], context?.previousPrefs);
      toast.error("Failed to update notification preferences");
    },
    onSuccess: () => {
      toast.success("Notification preferences updated");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Manage how and when you receive updates from Avsaar.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-emerald-500/10 p-2 rounded-full">
              <Mail className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="email-alerts" className="text-base font-medium cursor-pointer">Job Posting Email Alerts</Label>
                {prefs?.email_alerts ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 text-xs py-0">Subscribed</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-xs py-0">Unsubscribed</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Receive email notifications when new jobs matching your branch and batch are posted.</p>
            </div>
          </div>
          <div className="flex items-center sm:ml-auto ml-11">
            <Checkbox
              id="email-alerts"
              checked={prefs?.email_alerts || false}
              disabled={updateMutation.isPending}
              onCheckedChange={(checked) => {
                updateMutation.mutate({ email_alerts: checked === true });
              }}
              className="h-5 w-5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
