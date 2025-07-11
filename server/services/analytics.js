import prisma from "#prisma/prismaClient.js";
import ApiError from "#utils/ApiError.js";

export async function createAnalyticsEvents({ cardId, events }) {
  try {
    const result = await prisma.analyticsEvent.createManyAndReturn({
      data: events.map((event) => ({
        cardId,
        ...event,
        eventType: event.eventType.toUpperCase(),
      })),
    });

    return result;
  } catch (err) {
    if (err?.code === "P2002") {
      throw new ApiError(400, "Analytics event with this ID already exists");
    }
    throw new ApiError(500, "Internal server error", err.message);
  }
}
