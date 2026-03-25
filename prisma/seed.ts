import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: "site-core" },
    update: { value: { domain: "https://elevareai.store", contactEmail: "contact@elevareai.store" } },
    create: { key: "site-core", value: { domain: "https://elevareai.store", contactEmail: "contact@elevareai.store" } }
  });
}

main().finally(async () => prisma.$disconnect());
