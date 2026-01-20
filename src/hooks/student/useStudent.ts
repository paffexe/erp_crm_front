import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentMutation } from "./student.service";

interface UseStudentsParams {
  page: number;
  search?: string;
  limit?: number;
}

export const useStudents = ({ page, search, limit }: UseStudentsParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["students", page, search, limit],
    queryFn: () => studentMutation.getAll({ page, limit, search }),
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      studentMutation.block(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student blocked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const unblockMutation = useMutation({
    mutationFn: studentMutation.unblock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student unblocked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentMutation.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  return {
    students: data?.data || [],
    meta: data?.meta,
    isLoading,
    blockMutation,
    unblockMutation,
    deleteMutation,
  };
};
