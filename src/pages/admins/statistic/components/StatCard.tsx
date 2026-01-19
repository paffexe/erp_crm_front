import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, type LucideIcon } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  isLoading: boolean;
  showTrend?: boolean;
}

export const StatisticCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  isLoading,
  showTrend = false,
}: StatisticCardProps) => {
  return (
    <Card className="relative overflow-hidden border-border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div className="absolute -right-6 -bottom-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
        <Icon className="h-32 w-32" style={{ color: iconBg }} />
      </div>

      <div
        className={`absolute inset-x-0 top-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r ${gradient}`}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
          {title}
        </CardTitle>
        <div
          className="rounded-full p-2.5 transition-transform duration-300 group-hover:scale-110 ring-1 ring-inset ring-black/5 dark:ring-white/10"
          style={{
            backgroundColor: `${iconBg}15`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: iconBg }} />
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {value.toLocaleString()}
              </span>
            </div>

            {showTrend && (
              <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-500">
                <span className="flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-brand-success/10 text-brand-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </span>
                <span className="text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
