import { badRequest, notFound } from "./index.js";

export const invalidPasswordResponse = () =>
  badRequest({
    message: "Password must be at least 6 characters"
  });

export const emailIsAlreadyInUseResponse = () =>
  badRequest({
    message: "Invalid e-mail. Please provide a valid one."
  });

export const invalidEmailResponse = () =>
  badRequest({ message: "Invalid email." });

export const userNotFoundResponse = () =>
  notFound({ message: "User not found." });
