import { z } from "zod";

export const updateTeacherSchema = z.object({
  email: z.string().email("Wrong email").optional(),
  phoneNumber: z.string().max(20).optional(),
  fullName: z.string().max(255).optional(),
  cardNumber: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  specification: z
    .enum(["english", "french", "spanish", "italian", "german"])
    .optional(),
  level: z.enum(["b2", "c1", "c2"]).optional(),
  description: z.string().max(1000).optional(),
  hourPrice: z.coerce.number().min(0).optional(),
  portfolioLink: z.string().optional(),
  experience: z.string().max(50).optional(),
});

export type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>;
