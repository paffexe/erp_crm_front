import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Activity, Calendar, Clock } from "lucide-react";

interface ProfileAdditionalInfoCardProps {
  admin: {
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const ProfileAdditionalInfoCard = ({
  admin,
}: ProfileAdditionalInfoCardProps) => {
  return (
    <Card className="h-full border-border shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-muted/10 px-6 py-4 space-y-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-tertiary/10 text-brand-tertiary ring-1 ring-inset ring-brand-tertiary/20">
          <CalendarDays className="h-5 w-5" />
        </div>
        <CardTitle className="text-base font-semibold text-foreground tracking-wide">
          Additional Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Status Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Status</span>
          </div>
          <Badge
            variant="outline"
            className={`px-2.5 py-0.5 capitalize border-0 ${
              admin.isActive
                ? "bg-brand-success/15 text-brand-success hover:bg-brand-success/25"
                : "bg-brand-error/15 text-brand-error hover:bg-brand-error/25"
            }`}
          >
            {admin.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="h-px bg-border/40" />

        {/* Created At Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Joined Date</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {new Date(admin.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="h-px bg-border/40" />

        {/* Updated At Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Last Updated</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {new Date(admin.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
