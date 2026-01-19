import { GraduationCap, Award, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeacherListItemProps {
  teacher: {
    id: string;
    fullName: string;
    specification: string;
    level: string;
    isActive: boolean;
  };
}

export const TeacherListItem = ({ teacher }: TeacherListItemProps) => {
  const statusColor = teacher.isActive
    ? "var(--brand-success)"
    : "var(--brand-error)";

  return (
    <div className="group flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all duration-300 hover:border-brand-primary/20 hover:bg-accent/30 hover:shadow-sm hover:-translate-y-px">
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${statusColor}15`,
          }}
        >
          <GraduationCap className="h-5 w-5" style={{ color: statusColor }} />
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground group-hover:text-brand-primary transition-colors">
            {teacher.fullName}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate max-w-37.5">{teacher.specification}</span>
            <span className="h-1 w-1 rounded-full bg-border" />

            <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              <Award className="mr-1 h-3 w-3 opacity-70" />
              {teacher.level.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

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
          className={cn("h-2.5 w-2.5", teacher.isActive && "animate-pulse")}
        />
        {teacher.isActive ? "Faol" : "Nofaol"}
      </div>
    </div>
  );
};
