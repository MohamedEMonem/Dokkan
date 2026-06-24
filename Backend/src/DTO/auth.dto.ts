import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please provide a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one number",
  })
  .refine((value) => /[!@#$%^&*()\-_=+\[\]{}|;':",.<>?/`~\\]/.test(value), {
    message: "Password must contain at least one special character",
  });

export const userRoleSchema = z.enum(["Customer", "StoreOwner"]);

export const registerAuthSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().trim().min(1, "name is required").max(50, "Name must be at most 50 characters"),
    role: userRoleSchema.optional(),
  })
  .strict();

export const loginAuthSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Please provide email and password"),
  })
  .strict();

export const otpSchema = z
  .object({
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
  })
  .strict();

export type RegisterAuthDto = z.infer<typeof registerAuthSchema>;
export type LoginAuthDto = z.infer<typeof loginAuthSchema>;
export type OtpDto = z.infer<typeof otpSchema>;