"use client";

import { Button } from "@/components/ui/button";
import { Send, AlertTriangle, Loader2 } from "lucide-react";

interface SendAlertConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title: string;
  description: string;
}

export function SendAlertConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title,
  description,
}: SendAlertConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl border border-emerald-900/30 bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/20 mb-4 text-emerald-400">
          <Send className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isPending}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1 bg-gradient-brand text-white font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4 shrink-0" />
            )}
            Send Notification
          </Button>
        </div>
      </div>
    </div>
  );
}
