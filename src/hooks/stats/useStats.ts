import { useQuery } from "@tanstack/react-query";
import { teacherMutation } from "@/hooks/teacher/teacher.service";
import { studentMutation } from "@/hooks/student/student.service";
import { lessonService } from "@/services/lesson.service";

export const useStatistics = () => {
  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherMutation.getAll,
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentMutation.getAll(),
  });

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => lessonService.getAll(),
  });

  const teachers = teachersData?.teachers || [];
  const students = studentsData?.students || [];
  const lessons = lessonsData?.data || [];

  const completedLessons = lessons.filter(
    (l: any) => l.status === "completed",
  ).length;
  const bookedLessons = lessons.filter(
    (l: any) => l.status === "booked",
  ).length;
  const cancelledLessons = lessons.filter(
    (l: any) => l.status === "cancelled",
  ).length;

  const statistics = {
    allLessons: lessons.length,
    completedLessons,
    bookedLessons,
    teachers: teachers.length,
    students: students.length,
    cancelledLessons,
  };

  return {
    teachers,
    students,
    lessons,
    statistics,
    isLoading: teachersLoading || studentsLoading || lessonsLoading,
    teachersLoading,
    studentsLoading,
    lessonsLoading,
  };
};
