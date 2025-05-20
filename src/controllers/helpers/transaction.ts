import { badRequest } from "./index";

export const invalidAmountResponse = () => {
  return badRequest("The amount must be a valid currency.");
};

export const invalidTypeResponse = () => {
  return badRequest("The type must be EARNING, EXPENSE or INVESTMENT.");
};
