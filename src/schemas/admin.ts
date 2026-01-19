import { z } from "zod";

export const adminSchema = z.object({
  username: z.string().min(3, "Username at least 3 characters"),
  password: z.string().min(4, "Password at least 4 characters"),
  phoneNumber: z.string().min(9, "Phone number is invalid"),
  role: z.enum(["admin", "superAdmin"]),
  isActive: z.boolean(),
});

export const updateAdminSchema = z.object({
  username: z.string().min(3, "Username at least 3 characters"),
  phoneNumber: z.string().min(9, "Phone number is invalid"),
  role: z.enum(["admin", "superAdmin"]),
  newPassword: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(4, "Current password at least 4 characters"),
    newPassword: z.string().min(4, "New password at least 4 characters"),
    confirmPassword: z
      .string()
      .min(4, "Confirm password at least 4 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AdminFormData = z.infer<typeof adminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
