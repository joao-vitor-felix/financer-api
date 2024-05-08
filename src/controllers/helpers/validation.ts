import validator from "validator";

import { badRequest } from "./http.js";

export const checkIfIdIsValid = (id: string) => validator.isUUID(id);

export const invalidIdResponse = () =>
  badRequest("The provided id is not valid.");

export const missingFieldResponse = (field: string) =>
  badRequest(`The field ${field} is required.`);
