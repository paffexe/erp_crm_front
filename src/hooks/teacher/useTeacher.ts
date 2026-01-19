import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherMutation } from "@/hooks/teacher/teacher.service";
import { toast } from "sonner";
import type { UpdateTeacherFormData } from "@/schemas/teacher";

interface UseTeacherParams {
  page: number;
  limit: number;
}

export const useTeachers = ({ page, limit }: UseTeacherParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", page, limit],
    queryFn: () => teacherMutation.getAll({ page, limit }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherFormData }) =>
      teacherMutation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teacherMutation.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  return {
    teachers: data?.data || [],
    meta: data?.meta,
    isLoading,
    updateMutation,
    deleteMutation,
  };
};
