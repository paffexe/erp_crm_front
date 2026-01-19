import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z.string().min(3, "Username kamida 3 ta belgi"),
  phoneNumber: z.string().min(9, "Telefon raqam noto'g'ri"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(4, "Joriy parol kamida 4 ta belgi"),
    newPassword: z.string().min(4, "Yangi parol kamida 4 ta belgi"),
    confirmPassword: z.string().min(4, "Tasdiqlash paroli kamida 4 ta belgi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parollar mos kelmaydi",
    path: ["confirmPassword"],
  });

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
