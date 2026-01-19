import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Admin } from "@/types";

interface DeleteAdminDialogProps {
  admin: Admin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  isLoading: boolean;
}

export const DeleteAdminDialog = ({
  admin,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteAdminDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-brand-error/30 shadow-xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-brand-error from-brand-error to-brand-error-dark shadow-lg shadow-brand-error/20">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-brand-secondary">
              Confirm Deletion
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-brand-tertiary/80 pt-2">
            Do you want to delete{" "}
            <span className="font-semibold text-brand-error">
              {admin?.username}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-11 rounded-xl border-brand-accent/40 hover:bg-brand-accent/10 hover:border-brand-accent/60 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={() => admin && onConfirm(admin.id)}
            disabled={isLoading}
            className="h-11 bg-brand-error hover:bg-brand-error-dark text-white rounded-xl font-medium shadow-lg shadow-brand-error/20 hover:shadow-xl hover:shadow-brand-error/30 transition-all"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
