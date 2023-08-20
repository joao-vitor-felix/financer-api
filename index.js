import "dotenv/config.js";
import express from "express";
import { PostgresHelper } from "./src/db/postgres/helper.js";

const app = express();

app.get("/", async (req, res) => {
  {
    const result = await PostgresHelper.query("SELECT * FROM users;");
    res.send(JSON.stringify(result));
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
