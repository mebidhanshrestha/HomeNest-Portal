import { prisma } from "./prisma.js";
import { seedProperties } from "./properties.js";

export const initializeDatabase = async () => {
  await prisma.$connect();

  const existingPropertiesCount = await prisma.property.count();

  if (existingPropertiesCount > 0) {
    console.log("PostgreSQL connected and schema is ready.");
    return;
  }

  await prisma.property.createMany({
    data: seedProperties.map((property) => ({
      title: property.title,
      city: property.city,
      price: property.price,
      imageUrl: property.image_url,
    })),
    skipDuplicates: true,
  });

  console.log("PostgreSQL connected, schema is ready, and seed properties were inserted.");
};
