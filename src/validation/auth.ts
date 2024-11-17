import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const registerSchema = loginSchema.extend({
  username: z.string().min(1, "User name is required"),
  roleId: z.string().min(1, "Role is required"),
});

export const updateUserSchema = z.object({
  username: z.string().optional(),
  roleId: z.string().optional(),
  id: z.string().optional(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
