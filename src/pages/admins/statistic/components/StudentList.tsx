import { Users, Phone, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentListItemProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isBlocked: boolean;
  };
}

export const StudentListItem = ({ student }: StudentListItemProps) => {
  const statusColor = !student.isBlocked
    ? "var(--brand-success)"
    : "var(--brand-error)";

  return (
    <div className="group flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all duration-300 hover:border-brand-primary/20 hover:bg-accent/30 hover:shadow-sm hover:-translate-y-px">
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${statusColor}15`, // ~10% opacity
          }}
        >
          <Users className="h-5 w-5" style={{ color: statusColor }} />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground group-hover:text-brand-primary transition-colors">
            {student.firstName} {student.lastName}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-1.5 py-0.5">
              <Phone className="h-3 w-3 opacity-70" />
              <span className="font-medium opacity-90">
                {student.phoneNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        )}
        style={{
          backgroundColor: `${statusColor}15`,
          color: statusColor,
        }}
      >
        <CircleDot
          className={cn(
            "h-2.5 w-2.5",
            !student.isBlocked && "animate-pulse", // Pulse only when Active
          )}
        />
        {student.isBlocked ? "Bloklangan" : "Faol"}
      </div>
    </div>
  );
};
