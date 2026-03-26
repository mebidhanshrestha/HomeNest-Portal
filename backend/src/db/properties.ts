export type SeedProperty = {
  title: string;
  city: string;
  price: number;
  image_url: string;
};

export const seedProperties: SeedProperty[] = [
  {
    title: "Riverside Loft",
    city: "Austin",
    price: 385000,
    image_url:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Maple Family Home",
    city: "Denver",
    price: 465000,
    image_url:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Harbor View Condo",
    city: "Seattle",
    price: 525000,
    image_url:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Garden Court Villa",
    city: "San Diego",
    price: 610000,
    image_url:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
];
