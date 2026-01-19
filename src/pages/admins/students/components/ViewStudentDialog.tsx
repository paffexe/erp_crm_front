import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  MessageSquare,
  Hash,
  Calendar,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";
import type { Student } from "@/types";
import { StudentStatusBadge } from "./StudentBadge";

interface ViewStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewStudentDialog = ({
  student,
  open,
  onOpenChange,
}: ViewStudentDialogProps) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden border-border/40 shadow-xl">
        <div className="bg-muted/30 px-6 py-6 border-b border-border/50 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shrink-0">
            <GraduationCap className="h-6 w-6 text-brand-primary" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Student Profile
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Detailed information for{" "}
              <span className="font-medium text-foreground">
                {student.firstName} {student.lastName}
              </span>
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border border-border">
                <Hash className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Student ID
                </span>
                <span className="text-sm font-mono font-medium text-foreground">
                  {student.id.slice(0, 8)}...
                </span>
              </div>
            </div>
            <StudentStatusBadge
              isBlocked={student.isBlocked}
              isActive={student.isActive}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 border-b pb-1">
                Personal Information
              </h4>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Full Name</span>
                </div>
                <p className="text-sm font-medium text-foreground pl-5.5">
                  {student.firstName} {student.lastName}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Phone Number</span>
                </div>
                <p className="text-sm font-medium text-foreground pl-5.5">
                  {student.phoneNumber}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 border-b pb-1">
                Digital Account
              </h4>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Telegram</span>
                </div>
                <p className="text-sm font-medium text-brand-primary pl-5.5">
                  {student.tgUsername ? `@${student.tgUsername}` : "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Joined Date</span>
                </div>
                <p className="text-sm font-medium text-foreground pl-5.5">
                  {new Date(student.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {student.isBlocked && student.blockedReason && (
            <div className="mt-2 rounded-lg border border-brand-error/20 bg-brand-error/5 p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm ring-1 ring-brand-error/20">
                  <ShieldAlert className="h-4 w-4 text-brand-error" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-brand-error">
                    Account Blocked
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {student.blockedReason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-muted/10 px-6 py-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
