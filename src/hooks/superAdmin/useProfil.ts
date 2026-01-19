import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminMutation } from "@/hooks/admin/admin.service";
import { toast } from "sonner";
import type { UpdateProfileFormData } from "@/schemas/profile";
import type { ChangePasswordFormData } from "@/schemas/admin";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("admin") || "{}");

  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-profile", currentUser?.id],
    queryFn: () => adminMutation.getById(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileFormData) =>
      adminMutation.update(currentUser?.id, data),
    onSuccess: (updatedAdmin) => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      const stored = JSON.parse(localStorage.getItem("admin") || "{}");
      localStorage.setItem(
        "admin",
        JSON.stringify({ ...stored, ...updatedAdmin }),
      );
      toast.success("Profile updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occured");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      adminMutation.changePassword(currentUser?.id, data),
    onSuccess: () => {
      toast.success("Password updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occured");
    },
  });

  return {
    admin,
    isLoading,
    currentUser,
    updateMutation,
    changePasswordMutation,
  };
};
