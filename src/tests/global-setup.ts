import { execSync } from "child_process";

export function setup() {
  execSync("docker compose up postgres-test --wait -d");
  execSync("npx prisma db push");
}
