import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: "system" },
    update: {},
    create: {
      id: "system",
      email: "support@launchpad.com",
      authMethod: "EMAIL",
    },
  });

  if (!(await prisma.card.findUnique({ where: { slug: "empty-card" } }))) {
    const card = await prisma.card.create({
      data: {
        title: "Empty Card",
        slug: "empty-card",
        visibility: "PUBLIC",
        userId: "system",
      },
    });

    await prisma.$transaction([
      prisma.theme.create({
        data: {
          config: {},
          cardId: card.id,
        },
      }),
      prisma.assistant.create({
        data: {
          config: {},
          cardId: card.id,
        },
      }),
    ]);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
