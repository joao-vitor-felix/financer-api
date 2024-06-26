import z from "zod";

export const createUserSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name not provided." })
      .trim()
      .min(1, {
        message: "First name must contain at least 1 character."
      }),
    lastName: z
      .string({ required_error: "Last name not provided." })
      .trim()
      .min(1, {
        message: "Last name must contain at least 1 character."
      }),
    email: z
      .string({ required_error: "Email not provided." })
      .email({ message: "Please, provide a valid email." })
      .trim()
      .min(1, {
        message: "Please, provide an email."
      }),
    password: z
      .string({ required_error: "Password not provided." })
      .trim()
      .min(6, {
        message: "Password must contain at least 6 characters."
      })
  })
  .strict({
    message: "Some provided field is not allowed."
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().strict({
  message: "Some provided field is not allowed."
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
