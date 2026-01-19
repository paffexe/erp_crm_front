import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import type { Student } from "@/types";
import { cn } from "@/lib/utils";

interface DeleteStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  isLoading: boolean;
}

export const DeleteStudentDialog = ({
  student,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteStudentDialogProps) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border-border/40 shadow-xl">
        <div className="px-6 py-6 border-b border-border/50 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-brand-error/10 flex items-center justify-center border border-brand-error/20 shrink-0">
            <Trash2 className="h-6 w-6 text-brand-error" />
          </div>
          <div className="space-y-1 mt-0.5">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Delete Student
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-lg bg-brand-error/5 border border-brand-error/20 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-brand-error shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-brand-error">
                  Are you sure you want to delete?
                </p>
                <p className="text-sm text-foreground/70">
                  You are about to permanently remove the student record for{" "}
                  <span className="font-semibold text-foreground">
                    {student.firstName} {student.lastName}
                  </span>
                  . All associated data will be lost.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-muted/10 px-6 py-4 border-t border-border/50 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(student.id)}
            disabled={isLoading}
            className={cn(
              "w-full sm:w-auto font-medium shadow-sm transition-all active:scale-[0.98]",
              "bg-brand-error hover:bg-brand-error-dark text-white",
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Record"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
