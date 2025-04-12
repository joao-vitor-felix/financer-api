import validator from "validator";
import { z } from "zod";

export const createTransactionSchema = z
  //TODO: remove userId from the schema when authentication is implemented
  .object({
    userId: z
      .string({
        message: "userId is required"
      })
      .trim()
      .uuid({
        message: "userId must be a valid UUID"
      }),
    name: z
      .string({
        message: "name must be a string"
      })
      .trim()
      .min(1, {
        message: "name must contain at least 1 character"
      }),
    date: z
      .string({
        message: "date is must be a string"
      })
      .datetime({
        message: "date must be a valid date."
      }),
    type: z.enum(["EXPENSE", "EARNING", "INVESTMENT"], {
      errorMap: () => ({
        message: "type must be EXPENSE, EARNING, or INVESTMENT"
      })
    }),
    amount: z
      .number({
        message: "amount must be a number"
      })
      .min(1, {
        message: "amount must be greater than 0"
      })
      .refine(
        value =>
          validator.isCurrency(value.toFixed(2), {
            digits_after_decimal: [2],
            allow_negatives: false,
            decimal_separator: "."
          }),
        "amount must be a valid currency"
      )
  })
  .strict({
    message: "Some provided field is not allowed"
  });

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema
  .omit({
    userId: true
  })
  .partial()
  .strict({
    message: "Some provided field is not allowed"
  });

export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;
