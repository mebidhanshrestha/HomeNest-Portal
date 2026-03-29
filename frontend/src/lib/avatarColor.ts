const avatarPalette = [
  { bg: "#2563EB", fg: "#FFFFFF" },
  { bg: "#EA580C", fg: "#FFFFFF" },
  { bg: "#059669", fg: "#FFFFFF" },
  { bg: "#7C3AED", fg: "#FFFFFF" },
  { bg: "#DB2777", fg: "#FFFFFF" },
  { bg: "#0891B2", fg: "#FFFFFF" },
  { bg: "#DC2626", fg: "#FFFFFF" },
  { bg: "#CA8A04", fg: "#FFFFFF" },
];

const hashSeed = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

export const getAvatarColors = (seed?: string | null) => {
  const normalizedSeed = seed?.trim() || "user";
  return avatarPalette[hashSeed(normalizedSeed) % avatarPalette.length];
};
