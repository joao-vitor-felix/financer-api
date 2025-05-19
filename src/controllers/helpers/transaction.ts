import { TRANSITION_TYPE } from "@prisma/client";
import validator from "validator";

import { badRequest } from "./index";

const validTypes: TRANSITION_TYPE[] = ["EARNING", "EXPENSE", "INVESTMENT"];

export const isAmountValidCheck = (amount: number) =>
  validator.isCurrency(amount.toString(), {
    digits_after_decimal: [2],
    allow_negatives: false,
    decimal_separator: "."
  });

export const isTypeValidCheck = (type: TRANSITION_TYPE) =>
  validTypes.includes(type);

export const invalidAmountResponse = () => {
  return badRequest("The amount must be a valid currency.");
};

export const invalidTypeResponse = () => {
  return badRequest("The type must be EARNING, EXPENSE or INVESTMENT.");
};
