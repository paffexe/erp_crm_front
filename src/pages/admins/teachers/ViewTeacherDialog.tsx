import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Teacher } from "@/types";
import { levelLabels, specialtyLabels } from "@/config/constants";

interface ViewTeacherDialogProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewTeacherDialog = ({
  teacher,
  open,
  onOpenChange,
}: ViewTeacherDialogProps) => {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-brand-accent/30 shadow-xl">
        <DialogHeader className="pb-6 border-b border-brand-accent/20">
          <DialogTitle className="text-2xl font-semibold text-brand-secondary">
            Teacher Information
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Name
            </p>
            <p className="text-lg font-semibold text-brand-secondary">
              {teacher.fullName}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Email
            </p>
            <p className="text-lg font-semibold text-brand-secondary break-all">
              {teacher.email}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Phone number
            </p>
            <p className="text-lg font-semibold text-brand-secondary">
              {teacher.phoneNumber}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Card number
            </p>
            <p className="text-lg font-semibold text-brand-secondary">
              {teacher.cardNumber}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Specialty
            </p>
            <p className="text-lg font-semibold text-brand-secondary">
              {specialtyLabels[teacher.specification]}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Level
            </p>
            <p className="text-lg font-semibold text-brand-secondary">
              {levelLabels[teacher.level]}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-brand-success/5 to-brand-success/10 border border-brand-success/30">
            <p className="text-xs font-medium text-brand-success uppercase tracking-wide">
              Hourly rate
            </p>
            <p className="text-lg font-bold text-brand-success">
              {teacher.hourPrice?.toLocaleString() || 0} UZS
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-brand-warning/5 to-brand-warning/10 border border-brand-warning/30">
            <p className="text-xs font-medium text-brand-warning uppercase tracking-wide">
              Rating
            </p>
            <p className="text-lg font-bold text-brand-warning">
              {teacher.rating || 0} / 5 ⭐
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
              Experience
            </p>
            <p className="text-lg font-semibold text-brand-secondary">
              {teacher.experience || "-"}
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
            <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide mb-2">
              Status
            </p>
            <Badge
              variant={teacher.isActive ? "default" : "destructive"}
              className={
                teacher.isActive
                  ? "bg-brand-success hover:bg-brand-success-dark text-white px-4 py-1.5 rounded-full font-medium shadow-sm"
                  : "bg-brand-error hover:bg-brand-error-dark text-white px-4 py-1.5 rounded-full font-medium shadow-sm"
              }
            >
              {teacher.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {teacher.description && (
            <div className="col-span-2 space-y-2 p-5 rounded-xl bg-linear-to-br from-slate-50 to-brand-accent/5 border border-brand-accent/20">
              <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
                Description
              </p>
              <p className="text-base font-medium text-brand-secondary/90 leading-relaxed">
                {teacher.description}
              </p>
            </div>
          )}
          {teacher.portfolioLink && (
            <div className="col-span-2 space-y-2 p-5 rounded-xl bg-linear-to-br from-brand-primary/5 to-brand-primary/10 border border-brand-primary/20">
              <p className="text-xs font-medium text-brand-primary uppercase tracking-wide">
                Portfolio
              </p>
              <a
                href={teacher.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-brand-primary hover:text-brand-primary-dark underline decoration-2 underline-offset-4 transition-colors inline-block break-all"
              >
                {teacher.portfolioLink}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
