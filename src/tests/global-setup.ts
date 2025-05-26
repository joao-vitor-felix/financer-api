import { execSync } from "child_process";

export function setup() {
  execSync("docker compose up -d --wait postgres-test");
  execSync("sleep 1");
  execSync("npx prisma db push");
}
