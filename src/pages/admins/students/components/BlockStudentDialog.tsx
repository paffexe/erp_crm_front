import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Ban, AlertTriangle, Loader2 } from "lucide-react";
import type { Student } from "@/types";
import { cn } from "@/lib/utils";

interface BlockStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, reason: string) => void;
  isLoading: boolean;
}

export const BlockStudentDialog = ({
  student,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: BlockStudentDialogProps) => {
  const [blockReason, setBlockReason] = useState("");

  // Reset form when dialog closes/opens
  useEffect(() => {
    if (!open) {
      setBlockReason("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (student && blockReason.trim()) {
      onConfirm(student.id, blockReason);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border-border/40 shadow-xl">
        <div className="px-6 py-6 border-b border-border/50 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-brand-warning/10 flex items-center justify-center border border-brand-warning/20 shrink-0">
            <Ban className="h-6 w-6 text-brand-warning" />
          </div>
          <div className="space-y-1 mt-0.5">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Block Student Access
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This action will restrict the student's access to the platform.
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-lg bg-muted/30 border border-border/50 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-brand-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="text-muted-foreground">
                You are about to block{" "}
              </span>
              <span className="font-semibold text-foreground block mt-0.5">
                {student.firstName} {student.lastName}
              </span>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Block Reason <span className="text-brand-error text-sm">*</span>
            </label>
            <Textarea
              placeholder="Please provide a specific reason for blocking this account (e.g., Policy violation, Non-payment)..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="min-h-30 resize-none focus-visible:ring-brand-warning/30"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="bg-muted/10 px-6 py-4 border-t border-border/50 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!blockReason.trim() || isLoading}
            className={cn(
              "w-full sm:w-auto font-medium shadow-sm transition-all active:scale-[0.98]",
              "bg-brand-warning hover:bg-brand-warning-dark text-white hover:opacity-90",
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Blocking...
              </>
            ) : (
              "Confirm Block"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
