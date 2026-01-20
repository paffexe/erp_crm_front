import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Lesson } from "@/types";
import { lessonMutation } from "@/services";

interface UseLessonsParams {
  page?: number;
  limit?: number;
}

export const useLessons = ({ page = 1, limit = 10 }: UseLessonsParams = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["lessons", page, limit],
    queryFn: () => lessonMutation.getAll(page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Lesson>) => lessonMutation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lesson> }) =>
      lessonMutation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: lessonMutation.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  return {
    lessons: data?.lessons || [],
    meta: {
      count: data?.count,
      page: data?.page,
      limit: data?.limit,
    },
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

// Hook for fetching a single lesson by ID
export const useLesson = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: () => lessonMutation.getById(id),
    enabled: !!id,
  });

  return {
    lesson: data,
    isLoading,
  };
};

// Hook for fetching lessons by teacher
export const useLessonsByTeacher = (teacherId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["lessons", "teacher", teacherId],
    queryFn: () => lessonMutation.getByTeacher(teacherId),
    enabled: !!teacherId,
  });

  return {
    lessons: data?.lessons || [],
    isLoading,
  };
};
