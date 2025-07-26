import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  model: {
    card: {
      findManyWithUser(args = {}) {
        return prisma.card.findMany({
          ...args,
          include: {
            ...args.include,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });
      },
      async findManyWithUserMeta({ userId, ...args }) {
        const cards = await prisma.card.findManyWithUser({
          ...args,
          include: {
            ...args.include,
            starredBy: {
              where: { id: userId },
              select: { id: true },
            },
          },
        });

        return cards.map(({ starredBy, ...card }) => ({
          ...card,
          isStarred: starredBy.length > 0,
        }));
      },
      findUniqueWithUser(args = {}) {
        return prisma.card.findUnique({
          ...args,
          include: {
            ...args.include,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });
      },
    },
  },
});

export default prisma;
