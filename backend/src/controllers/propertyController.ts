import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/http.js";

export const listProperties = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const properties = await prisma.property.findMany({
    orderBy: { id: "asc" },
    include: {
      favourites: {
        where: { userId },
        select: { userId: true },
      },
    },
  });

  response.json({
    properties: properties.map((property) => ({
      id: property.id,
      title: property.title,
      city: property.city,
      price: property.price,
      imageUrl: property.imageUrl,
      isFavourite: property.favourites.length > 0,
    })),
  });
};
