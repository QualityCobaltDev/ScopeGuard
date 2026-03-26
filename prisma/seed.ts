import { PrismaClient, Role } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}

async function main() {
  const username = process.env.ADMIN_SEED_USERNAME || "QualityCobaltDev";
  const password = process.env.ADMIN_SEED_PASSWORD || "Banner1234!";

  await prisma.user.upsert({
    where: { username },
    update: { role: Role.admin, active: true },
    create: {
      username,
      name: "Primary Admin",
      passwordHash: hashPassword(password),
      role: Role.admin,
      active: true
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: "site-core" },
    update: { value: { domain: "https://elevareai.store", contactEmail: "contact@elevareai.store" } },
    create: { key: "site-core", value: { domain: "https://elevareai.store", contactEmail: "contact@elevareai.store" } }
  });
}

main().finally(async () => prisma.$disconnect());
