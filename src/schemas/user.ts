import z from "zod";

export const createUserSchema = z
  .object({
    firstName: z
      .string({ message: "firstName must be a string." })
      .trim()
      .min(1, {
        message: "firstName must contain at least 1 character."
      }),
    lastName: z
      .string({ message: "lastName must be a string." })
      .trim()
      .min(1, {
        message: "lastName must contain at least 1 character."
      }),
    email: z
      .string({ message: "email must be a string." })
      .email({ message: "Provide a valid email." })
      .trim(),
    password: z
      .string({ message: "password must be a string." })
      .trim()
      .min(6, {
        message: "password must contain at least 6 characters."
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
