import validator from "validator";
import { badRequest, notFound } from "./index.js";

export const isAmountValidCheck = amount =>
  validator.isCurrency(amount.toString(), {
    digits_after_decimal: [2],
    allow_negatives: false,
    decimal_separator: "."
  });

export const isTypeValidCheck = type =>
  ["EARNING", "EXPENSE", "INVESTMENT"].includes(type);

export const invalidAmountResponse = () => {
  return badRequest({
    message: "The amount must be a valid currency."
  });
};

export const invalidTypeResponse = () => {
  return badRequest({
    message: "The type must be EARNING, EXPENSE or INVESTMENT."
  });
};

export const transactionNotFoundResponse = () => {
  return notFound({ message: "Transaction not found." });
};
