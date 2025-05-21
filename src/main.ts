import express from "express";

import { transactionsRouter, usersRouter } from "./routes";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server is shut down");
    process.exit(0);
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
