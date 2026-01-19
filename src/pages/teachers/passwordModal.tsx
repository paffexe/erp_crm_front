import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, X, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTeacherPassword } from "./service/mutate/useUpdatePassword";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface UpdatePasswordModalProps {
  teacherId: string;
}

const UpdatePasswordModal = ({ teacherId }: UpdatePasswordModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useUpdateTeacherPassword(teacherId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleOpenModal = () => {
    reset();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const onSubmit = async (data: PasswordFormData) => {
    mutate(data, {
      onSuccess: (response: any) => {
        toast.success(
          response.data.message || "Password updated successfully!"
        );
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update password"
        );
      },
    });
  };

  return (
    <>
      {/* Update Password Button */}
      <Button
        onClick={handleOpenModal}
        variant="outline"
        className="h-11 rounded-lg border-brand-tertiary text-brand-tertiary hover:bg-brand-tertiary/10 font-semibold"
      >
        <Lock className="h-4 w-4 mr-2" />
        Update Password
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-brand-accent border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-brand-secondary flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Update Password
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isPending}
                className="text-brand-tertiary hover:text-brand-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Current Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="oldPassword"
                  className="text-foreground font-medium"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    {...register("oldPassword")}
                    placeholder="Enter current password"
                    className="bg-background border-border focus:border-brand-primary pr-10"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p
                    className="text-sm flex items-center gap-1"
                    style={{ color: "#D4A373" }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-foreground font-medium"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                    placeholder="Enter new password"
                    className="bg-background border-border focus:border-brand-primary pr-10"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p
                    className="text-sm flex items-center gap-1"
                    style={{ color: "#D4A373" }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters with uppercase, lowercase, and
                  number
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-foreground font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Confirm new password"
                    className="bg-background border-border focus:border-brand-primary pr-10"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    className="text-sm flex items-center gap-1"
                    style={{ color: "#D4A373" }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 h-11 rounded-lg"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePasswordModal;
