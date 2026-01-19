import { useMutation } from "@tanstack/react-query";
import type { LessonField } from "../../TeacherTypes";
import { request } from "@/config/request";

export const useUpdateLesson = (lessonId: string) => {
  return useMutation({
    mutationFn: (data: LessonField) =>
      request.patch(`/lesson/${lessonId}`, data),
  });
};
