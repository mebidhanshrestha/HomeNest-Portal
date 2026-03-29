import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/http.js";
import { favouriteSchema } from "../utils/validation.js";

export const listFavourites = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const favourites = await prisma.favourite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { property: true },
  });

  response.json({
    favourites: favourites.map(({ property }) => ({
      id: property.id,
      title: property.title,
      city: property.city,
      price: property.price,
      imageUrl: property.imageUrl,
      createdAt: property.createdAt.toISOString(),
      isFavourite: true,
    })),
  });
};

export const addFavourite = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const { propertyId } = favouriteSchema.parse(request.body);
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true },
  });

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  await prisma.favourite.upsert({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
    update: {},
    create: {
      userId,
      propertyId,
    },
  });

  response.status(201).json({ message: "Property added to favourites." });
};

export const removeFavourite = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const propertyId = Number(request.params.propertyId);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    throw new AppError("Select a valid property.", 400);
  }

  const result = await prisma.favourite.deleteMany({
    where: {
      userId,
      propertyId,
    },
  });

  if (!result.count) {
    throw new AppError("Favourite not found for this user.", 404);
  }

  response.json({ message: "Property removed from favourites." });
};
