import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/http.js";
import { uploadsDirectory } from "../utils/uploads.js";
import {
  createPropertySchema,
  propertyListQuerySchema,
  propertyParamsSchema,
  propertySchema,
} from "../utils/validation.js";

const mapPropertyResponse = (property: {
  id: number;
  title: string;
  city: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  creator: { id: number; name: string; email: string } | null;
  favourites: { userId: number }[];
}) => ({
  id: property.id,
  title: property.title,
  city: property.city,
  price: property.price,
  imageUrl: property.imageUrl,
  createdAt: property.createdAt.toISOString(),
  createdBy: property.creator
    ? {
        id: property.creator.id,
        name: property.creator.name,
        email: property.creator.email,
      }
    : null,
  isFavourite: property.favourites.length > 0,
});

export const listProperties = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const { page, pageSize, search, city, savedOnly } = propertyListQuerySchema.parse(request.query);
  const where: Prisma.PropertyWhereInput = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
    ...(savedOnly
      ? {
          favourites: {
            some: { userId },
          },
        }
      : {}),
  };

  const [properties, totalItems] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { id: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        favourites: {
          where: { userId },
          select: { userId: true },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  response.json({
    success: true,
    message: "Properties fetched successfully",
    data: {
      items: properties.map(mapPropertyResponse),
      pagination: {
        total: totalItems,
        page,
        limit: pageSize,
        total_pages: Math.max(1, Math.ceil(totalItems / pageSize)),
      },
    },
  });
};

export const listPropertyCities = async (request: Request, response: Response) => {
  if (!request.user?.sub) {
    throw new AppError("Authentication required.", 401);
  }

  const cityRows = await prisma.property.findMany({
    distinct: ["city"],
    select: { city: true },
    orderBy: { city: "asc" },
  });

  response.json({
    success: true,
    message: "Property cities fetched successfully",
    data: cityRows.map((row) => row.city),
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
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      createdById: request.user.sub,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
    const filePath = path.join(uploadsDirectory, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.property.delete({ where: { id } });
  response.status(204).send();
};
