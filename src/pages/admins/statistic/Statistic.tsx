import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher.service";
import { studentService } from "@/services/student.service";
import { lessonService } from "@/services/lesson.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Phone,
  Award,
  CircleDot,
} from "lucide-react";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";

const Statistic = () => {
  // const { data: teachersData, isLoading: teachersLoading } = useQuery({
  //   queryKey: ["teachers"],
  //   queryFn: teacherService.getAll,
  // });

  const {
    data: teachersData,
    isLoading: teachersLoading,
    isError,
  } = useGetQuery({
    pathname: "earnings",
    url: "teacher",
  });

  const { data: studentsData, isLoading: studentsLoading } = useGetQuery({
    pathname: "earnings",
    url: "student",
  });

  // const { data: studentsData, isLoading: studentsLoading } = useQuery({
  //   queryKey: ["students"],
  //   queryFn: () => studentService.getAll({ limit: 1000 }),
  // });

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => lessonService.getAll(1, 1000),
  });

  const teachers = teachersData?.data || [];
  const students = studentsData?.data || [];
  const lessons = lessonsData?.lessons || [];

  const completedLessons = lessons.filter(
    (l) => l.status === "completed",
  ).length;
  const bookedLessons = lessons.filter((l) => l.status === "booked").length;
  const cancelledLessons = lessons.filter(
    (l) => l.status === "cancelled",
  ).length;

  const stats = [
    {
      title: "All Lessons",
      value: lessons.length,
      icon: BookOpen,
      gradient: "from-brand-primary to-brand-tertiary",
      iconBg: "var(--brand-primary)",
    },
    {
      title: "Completed Lessons",
      value: completedLessons,
      icon: CheckCircle2,
      gradient: "from-brand-success to-emerald-500",
      iconBg: "var(--brand-success)",
    },
    {
      title: "Booked Lessons",
      value: bookedLessons,
      icon: Clock,
      gradient: "from-brand-warning to-amber-500",
      iconBg: "var(--brand-warning)",
    },
    {
      title: "Overall Teachers",
      value: teachers.length,
      icon: GraduationCap,
      gradient: "from-brand-tertiary to-blue-500",
      iconBg: "var(--brand-tertiary)",
    },
    {
      title: "Overall Students",
      value: students.length,
      icon: Users,
      gradient: "from-brand-primary to-blue-600",
      iconBg: "var(--brand-primary)",
    },
    {
      title: "Cancelled Lessons",
      value: cancelledLessons,
      icon: XCircle,
      gradient: "from-brand-error to-red-500",
      iconBg: "var(--brand-error)",
    },
  ];

  const isLoading = teachersLoading || studentsLoading || lessonsLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Statistics
          </h1>
          <p className="text-foreground/60 text-sm">
            Information about teachers, students, and lessons
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border"
          style={{ backgroundColor: "var(--brand-accent)" }}
        >
          <Calendar
            className="h-4 w-4"
            style={{ color: "var(--brand-tertiary)" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--brand-tertiary)" }}
          >
            {new Date().toLocaleDateString("uz-UZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-linear-to-br ${stat.gradient}`}
            ></div>
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative">
              <CardTitle className="text-sm font-medium text-foreground/70">
                {stat.title}
              </CardTitle>
              <div
                className="rounded-xl p-3 shadow-sm"
                style={{ backgroundColor: `${stat.iconBg}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.iconBg }} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  {index < 3 && (
                    <TrendingUp
                      className="h-4 w-4 mb-1"
                      style={{ color: "var(--brand-success)" }}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Teachers and Students */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teachers Section */}
        <Card className="border border-border shadow-sm">
          <CardHeader
            className="border-b border-border/50"
            style={{ backgroundColor: "var(--brand-accent)" }}
          >
            <div className="pt-6 flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-tertiary)" }}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <CardTitle
                className="text-lg"
                style={{ color: "var(--brand-primary)" }}
              >
                Latest Teachers
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {teachersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap
                  className="h-12 w-12 mx-auto mb-3 opacity-30"
                  style={{ color: "var(--brand-tertiary)" }}
                />
                <p className="text-foreground/50 text-sm">No teachers found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teachers.slice(0, 5).map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-accent/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${
                            teacher.isActive
                              ? "var(--brand-success)"
                              : "var(--brand-error)"
                          }15`,
                        }}
                      >
                        <GraduationCap
                          className="h-6 w-6"
                          style={{
                            color: teacher.isActive
                              ? "var(--brand-success)"
                              : "var(--brand-error)",
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                          {teacher.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Award className="h-3 w-3 text-foreground/50" />
                          <p className="text-xs text-foreground/60">
                            {teacher.specification} •{" "}
                            {teacher.level.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{
                        backgroundColor: teacher.isActive
                          ? "rgba(125, 166, 125, 0.15)"
                          : "rgba(192, 90, 78, 0.15)",
                        color: teacher.isActive
                          ? "var(--brand-success)"
                          : "var(--brand-error)",
                      }}
                    >
                      <CircleDot className="h-3 w-3" />
                      {teacher.isActive ? "Faol" : "Nofaol"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Students Section */}
        <Card className="border border-border shadow-sm">
          <CardHeader
            className="border-b border-border/50"
            style={{ backgroundColor: "var(--brand-accent)" }}
          >
            <div className="pt-6 flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <Users className="h-5 w-5 text-white" />
              </div>
              <CardTitle
                className="text-lg"
                style={{ color: "var(--brand-primary)" }}
              >
                Latest Students
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {studentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <Users
                  className="h-12 w-12 mx-auto mb-3 opacity-30"
                  style={{ color: "var(--brand-primary)" }}
                />
                <p className="text-foreground/50 text-sm">No students found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-accent/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${
                            !student.isBlocked
                              ? "var(--brand-success)"
                              : "var(--brand-error)"
                          }15`,
                        }}
                      >
                        <Users
                          className="h-6 w-6"
                          style={{
                            color: !student.isBlocked
                              ? "var(--brand-success)"
                              : "var(--brand-error)",
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3 text-foreground/50" />
                          <p className="text-xs text-foreground/60">
                            {student.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{
                        backgroundColor: !student.isBlocked
                          ? "rgba(125, 166, 125, 0.15)"
                          : "rgba(192, 90, 78, 0.15)",
                        color: !student.isBlocked
                          ? "var(--brand-success)"
                          : "var(--brand-error)",
                      }}
                    >
                      <CircleDot className="h-3 w-3" />
                      {student.isBlocked ? "Bloklangan" : "Faol"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistic;
