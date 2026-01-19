import { STATS_CONFIG } from "@/config/constants";
import { useStatistics } from "@/hooks/stats/useStats";
import { Calendar } from "lucide-react";
import { StatisticCard } from "./components/StatCard";
import { RecentTeachersCard } from "./components/RecentTeacher";
import { RecentStudentsCard } from "./components/RecentStudent";

const Statistics = () => {
  const {
    teachers,
    students,
    statistics,
    isLoading,
    teachersLoading,
    studentsLoading,
  } = useStatistics();

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-brand-primary/20">
          <div className="p-1.5 rounded-lg bg-brand-secondary/10 text-brand-secondary">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Today's Date
            </span>
            <span className="text-sm font-semibold text-foreground">
              {new Date().toLocaleDateString("uz-UZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="text-right self-end">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Statistics
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of teachers, students, and lessons
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STATS_CONFIG.map((stat, index) => (
          <StatisticCard
            key={stat.key}
            title={stat.title}
            value={statistics[stat.key]}
            icon={stat.icon}
            gradient={stat.gradient}
            iconBg={stat.iconBg}
            isLoading={isLoading}
            showTrend={index < 3}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 h-125">
        <RecentTeachersCard teachers={teachers} isLoading={teachersLoading} />
        <RecentStudentsCard students={students} isLoading={studentsLoading} />
      </div>
    </div>
  );
};

export default Statistics;
