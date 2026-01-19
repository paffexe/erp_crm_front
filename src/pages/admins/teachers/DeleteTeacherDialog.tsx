import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Teacher {
  id: string;
  fullName: string;
}

interface DeleteTeacherDialogProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  isLoading: boolean;
}

export const DeleteTeacherDialog = ({
  teacher,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteTeacherDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-brand-error/30 bg-white shadow-xl">
        <DialogHeader className="border-b border-brand-error/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-error/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-brand-error" />
            </div>
            <DialogTitle className="text-2xl font-bold text-brand-error">
              Confirm Deletion
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <p className="text-foreground text-base leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-brand-secondary">
              {teacher?.fullName}
            </span>
            ?
          </p>

          <div className="bg-brand-error/5 border border-brand-error/20 rounded-lg p-4">
            <p className="text-sm text-brand-error font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                This action cannot be undone. All data associated with this
                teacher will be permanently removed.
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-brand-accent/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 border-brand-accent/40 text-brand-secondary hover:bg-brand-accent/10 hover:text-brand-secondary font-semibold"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => teacher && onConfirm(teacher.id)}
            className="flex-1 h-11 bg-brand-error hover:bg-brand-error-dark text-white font-semibold shadow-md hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              "Delete Teacher"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
