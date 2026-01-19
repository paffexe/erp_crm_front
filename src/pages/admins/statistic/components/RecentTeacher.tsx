import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RECENT_ITEMS_LIMIT } from "@/config/constants";
import { GraduationCap, FolderOpen } from "lucide-react";
import { TeacherListItem } from "./TeacherList";

interface RecentTeachersCardProps {
  teachers: any[];
  isLoading: boolean;
}

export const RecentTeachersCard = ({
  teachers,
  isLoading,
}: RecentTeachersCardProps) => {
  return (
    <Card className="flex h-full flex-col border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/40 bg-muted/10 px-6 py-4 space-y-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-tertiary/10 text-brand-tertiary ring-1 ring-inset ring-brand-tertiary/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        <CardTitle className="text-base font-semibold text-brand-primary tracking-wide">
          Latest Teachers
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(RECENT_ITEMS_LIMIT)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-18.5 w-full rounded-lg bg-muted/50"
              />
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <div className="flex h-full min-h-50 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/5 py-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FolderOpen className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No teachers found
            </p>
            <p className="text-xs text-muted-foreground max-w-50">
              New teachers added to the system will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.slice(0, RECENT_ITEMS_LIMIT).map((teacher) => (
              <TeacherListItem key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
