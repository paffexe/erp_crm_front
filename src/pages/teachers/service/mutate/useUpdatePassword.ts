import { useMutation } from "@tanstack/react-query";
import type { UpdateTeacherPasswords } from "../../TeacherTypes";
import { request } from "@/config/request";

export const useUpdateTeacherPassword = (teacherId: string) => {
  return useMutation({
    mutationFn: (data: UpdateTeacherPasswords) =>
      request.patch(`/teacher/${teacherId}/update-password`, data),
  });
};
