import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/http.js";
import { createPropertySchema, propertyParamsSchema, propertySchema } from "../utils/validation.js";

const mapPropertyResponse = (property: {
  id: number;
  title: string;
  city: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  favourites: { userId: number }[];
}) => ({
  id: property.id,
  title: property.title,
  city: property.city,
  price: property.price,
  imageUrl: property.imageUrl,
  createdAt: property.createdAt.toISOString(),
  isFavourite: property.favourites.length > 0,
});

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
    properties: properties.map(mapPropertyResponse),
  });
};

export const getProperty = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const { id } = propertyParamsSchema.parse(request.params);
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      favourites: {
        where: { userId },
        select: { userId: true },
      },
    },
  });

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  response.json({ property: mapPropertyResponse(property) });
};

export const createProperty = async (request: Request, response: Response) => {
  if (!request.user?.sub) {
    throw new AppError("Authentication required.", 401);
  }

  const values = createPropertySchema.parse(request.body);

  if (!request.file) {
    throw new AppError("Property image is required.", 400);
  }

  const imageUrl = `${request.protocol}://${request.get("host")}/uploads/${request.file.filename}`;
  const property = await prisma.property.create({
    data: {
      ...values,
      imageUrl,
    },
    include: {
      favourites: {
        select: { userId: true },
      },
    },
  });

  response.status(201).json({ property: mapPropertyResponse(property) });
};

export const updateProperty = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const { id } = propertyParamsSchema.parse(request.params);
  const values = propertySchema.parse(request.body);
  const existingProperty = await prisma.property.findUnique({ where: { id } });

  if (!existingProperty) {
    throw new AppError("Property not found.", 404);
  }

  const property = await prisma.property.update({
    where: { id },
    data: values,
    include: {
      favourites: {
        where: { userId },
        select: { userId: true },
      },
    },
  });

  response.json({ property: mapPropertyResponse(property) });
};

export const deleteProperty = async (request: Request, response: Response) => {
  if (!request.user?.sub) {
    throw new AppError("Authentication required.", 401);
  }

  const { id } = propertyParamsSchema.parse(request.params);
  const existingProperty = await prisma.property.findUnique({ where: { id } });

  if (!existingProperty) {
    throw new AppError("Property not found.", 404);
  }

  const uploadsPrefix = `${request.protocol}://${request.get("host")}/uploads/`;
  if (existingProperty.imageUrl.startsWith(uploadsPrefix)) {
    const filename = existingProperty.imageUrl.slice(uploadsPrefix.length);
    const filePath = path.resolve(process.cwd(), "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.property.delete({ where: { id } });
  response.status(204).send();
};
