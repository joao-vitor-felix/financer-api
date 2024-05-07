import { badRequest, notFound } from "./index";

export const invalidPasswordResponse = () =>
  badRequest("Password must be at least 6 characters");

export const emailIsAlreadyInUseResponse = () =>
  badRequest("Invalid e-mail. Please provide a valid one.");

export const invalidEmailResponse = () => badRequest("Invalid email.");

export const userNotFoundResponse = () => notFound("User not found.");
