import { z } from "zod";

export const signUpBodySchema = z.object({
  email: z.email("Please provide a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
});

export type SignUpBody = z.infer<typeof signUpBodySchema>;

export const signUpResponseSchema = z.object({
  id: z.string(),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;

export const signUpFailedResponseSchema = z.object({
  message: z.string(),
});

export type SignUpFailedResponse = z.infer<typeof signUpFailedResponseSchema>;

export const signInBodySchema = z.object({
  email: z.email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type SignInBody = z.infer<typeof signInBodySchema>;

export const signInResponseSchema = z.object({
  message: z.literal("Signed in successfully"),
});

export type SignInResponse = z.infer<typeof signInResponseSchema>;

export const signInFailedResponseSchema = z.object({
  message: z.string(),
});

export type SignInFailedResponse = z.infer<typeof signInFailedResponseSchema>;

export const signUpFormSchema = signUpBodySchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof signUpFormSchema>;
