import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminMutation } from "@/hooks/admin/admin.service";
import { toast } from "sonner";

import type { Admin } from "@/types";
import type { ChangePasswordFormData } from "@/schemas/admin";

interface UseAdminsParams {
  search: string;
  page: number;
  limit: number;
}

export const useAdmins = ({ search, page, limit }: UseAdminsParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admins", search, page, limit],
    queryFn: () =>
      adminMutation.getAll({ search: search || undefined, page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: adminMutation.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Admin> }) =>
      adminMutation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminMutation.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const activateMutation = useMutation({
    mutationFn: adminMutation.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin activated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: adminMutation.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deactivated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordFormData }) =>
      adminMutation.changePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  return {
    admins: data?.data || [],
    meta: data?.meta,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation,
    changePasswordMutation,
  };
};
