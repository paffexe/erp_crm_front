import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Shield, AtSign } from "lucide-react";
import type { AdminRole } from "@/types";
import { roleLabels } from "@/config/constants";

interface ProfileInfoCardProps {
  admin: {
    username: string;
    phoneNumber: string;
    role: AdminRole;
  };
}

export const ProfileInfoCard = ({ admin }: ProfileInfoCardProps) => {
  const isSuperAdmin = admin.role === "superAdmin";

  return (
    <Card className="h-full border-border shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-muted/10 px-6 py-4 space-y-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary ring-1 ring-inset ring-brand-primary/20">
          <User className="h-5 w-5" />
        </div>
        <CardTitle className="text-base font-semibold text-foreground tracking-wide">
          Basic Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Username Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
              <AtSign className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Username</span>
          </div>
          <span className="font-medium text-foreground">{admin.username}</span>
        </div>

        <div className="h-px bg-border/40" />

        {/* Phone Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Phone Number</span>
          </div>
          <span className="font-medium text-foreground">
            {admin.phoneNumber}
          </span>
        </div>

        <div className="h-px bg-border/40" />

        {/* Role Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Role</span>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 capitalize border-0 shadow-sm ${
              isSuperAdmin
                ? "bg-brand-primary text-primary-foreground hover:bg-brand-primary/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {roleLabels[admin.role]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
