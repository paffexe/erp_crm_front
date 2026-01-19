import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Phone, Calendar, Clock } from "lucide-react";
import type { Admin } from "@/types";
import { roleLabels } from "@/config/constants";

interface ViewAdminDialogProps {
  admin: Admin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewAdminDialog = ({
  admin,
  open,
  onOpenChange,
}: ViewAdminDialogProps) => {
  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-brand-accent/30 shadow-xl">
        <DialogHeader className="pb-5 border-b border-brand-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary from-brand-tertiary to-brand-tertiary-dark shadow-lg shadow-brand-tertiary/20">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-brand-secondary">
              Admin Information
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="pt-2">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br  from-slate-50 to-brand-accent/5 border border-brand-accent/20">
              <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
                Username
              </p>
              <p className="text-lg font-semibold text-brand-secondary">
                {admin.username}
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br  from-slate-50 to-brand-accent/5 border border-brand-accent/20">
              <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
                Phone Number
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-tertiary/60" />
                <p className="text-lg font-semibold text-brand-secondary">
                  {admin.phoneNumber}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br  from-brand-primary/5 to-brand-primary/10 border border-brand-primary/20">
              <p className="text-xs font-medium text-brand-primary uppercase tracking-wide">
                Role
              </p>
              <Badge
                className="font-medium px-3 py-1 rounded-full shadow-sm"
                style={{
                  backgroundColor:
                    admin.role === "superAdmin"
                      ? "var(--brand-primary)"
                      : "var(--brand-tertiary)",
                  color: "white",
                }}
              >
                {roleLabels[admin.role]}
              </Badge>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br  from-slate-50 to-brand-accent/5 border border-brand-accent/20">
              <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
                Status
              </p>
              <Badge
                className="font-medium px-3 py-1 rounded-full shadow-sm"
                style={{
                  backgroundColor: admin.isActive
                    ? "var(--brand-success)"
                    : "var(--brand-error)",
                  color: "white",
                }}
              >
                {admin.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br  from-slate-50 to-brand-accent/5 border border-brand-accent/20">
              <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
                Created
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-tertiary/60" />
                <p className="font-semibold text-brand-secondary text-sm">
                  {new Date(admin.createdAt).toLocaleString("uz-UZ")}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-linear-to-br  from-slate-50 to-brand-accent/5 border border-brand-accent/20">
              <p className="text-xs font-medium text-brand-tertiary uppercase tracking-wide">
                Updated
              </p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-tertiary/60" />
                <p className="font-semibold text-brand-secondary text-sm">
                  {new Date(admin.updatedAt).toLocaleString("uz-UZ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
