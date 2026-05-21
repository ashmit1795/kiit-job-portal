import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { announcementService } from "@/services/announcement.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface CircularAttachmentCardProps {
  announcementId: string;
}

export function CircularAttachmentCard({ announcementId }: CircularAttachmentCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const url = await announcementService.downloadCircular(announcementId);
      if (url) window.open(url, "_blank");
    } catch (error) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      toast.error(axiosErr?.response?.data?.message || "Failed to download circular.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-3 bg-emerald-600/10 border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/20 font-medium h-8 w-full sm:w-auto"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="mr-2 h-3.5 w-3.5" />
      )}
      Download Circular
    </Button>
  );
}
