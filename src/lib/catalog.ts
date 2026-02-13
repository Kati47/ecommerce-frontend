export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  sizes: string[];
  concentration: string;
  stock: "In Stock" | "Low Stock";
  notes: string[];
  audience: "her" | "him" | "unisex";
};

export const categories = [
  "Floral Amber",
  "Woody Musk",
  "Citrus Noir",
  "Powdered Rose",
];

export const collections = [
  {
    title: "Maison Signature",
    description: "A curated line of long-lasting extrait blends.",
  },
  {
    title: "Atelier Nocturne",
    description: "Depth-forward compositions for evening rituals.",
  },
  {
    title: "Velvet Botanique",
    description: "A modern floral study with airy musks.",
  },
];

export const products: Product[] = [
  {
    slug: "nocturne-veil",
    name: "Nocturne Veil",
    category: "Floral Amber",
    price: 165,
    description:
      "A velvet blend of black tea, rose petals, and glowing amber for a soft, ceremonial finish.",
    sizes: ["30ml", "50ml", "100ml"],
    concentration: "Eau de Parfum",
    stock: "In Stock",
    notes: ["black tea", "rose", "amber", "cashmere musk"],
    audience: "her",
  },
  {
    slug: "lune-noire",
    name: "Lune Noire",
    category: "Woody Musk",
    price: 190,
    description:
      "Smoky sandalwood wrapped in iris and soft leather, balanced by a clean, luminous dry down.",
    sizes: ["30ml", "75ml"],
    concentration: "Extrait de Parfum",
    stock: "Low Stock",
    notes: ["sandalwood", "iris", "leather", "tonka"],
    audience: "him",
  },
  {
    slug: "serene-bloom",
    name: "Serene Bloom",
    category: "Powdered Rose",
    price: 145,
    description:
      "A calm composition of peony, skin musk, and soft vanilla for everyday elegance.",
    sizes: ["50ml", "100ml"],
    concentration: "Eau de Parfum",
    stock: "In Stock",
    notes: ["peony", "vanilla", "white musk"],
    audience: "her",
  },
  {
    slug: "atelier-ambre",
    name: "Atelier Ambre",
    category: "Floral Amber",
    price: 175,
    description:
      "Golden amber resin with saffron and jasmine, designed to linger with a tailored glow.",
    sizes: ["30ml", "50ml", "100ml"],
    concentration: "Eau de Parfum",
    stock: "In Stock",
    notes: ["amber", "saffron", "jasmine", "benzoin"],
    audience: "unisex",
  },
  {
    slug: "citron-noir",
    name: "Citron Noir",
    category: "Citrus Noir",
    price: 150,
    description:
      "Sparkling bergamot, smoked citrus peel, and a mineral cedar base.",
    sizes: ["50ml", "100ml"],
    concentration: "Eau de Parfum",
    stock: "In Stock",
    notes: ["bergamot", "cedar", "grapefruit zest"],
    audience: "him",
  },
  {
    slug: "silk-petals",
    name: "Silk Petals",
    category: "Powdered Rose",
    price: 160,
    description:
      "Creamy rose accord with pear skin and a whisper of almond.",
    sizes: ["30ml", "50ml", "100ml"],
    concentration: "Eau de Parfum",
    stock: "In Stock",
    notes: ["rose", "pear", "almond", "cashmere"],
    audience: "her",
  },
];

export const featuredProducts = products.slice(0, 4);
