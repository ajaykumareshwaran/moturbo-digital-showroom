export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  badge?: string;
  specs: { label: string; value: string }[];
  hue: number;
};

const mk = (
  slug: string,
  name: string,
  tagline: string,
  price: number,
  category: string,
  brand: string,
  rating: number,
  reviews: number,
  hue: number,
  extra: Partial<Product> = {},
): Product => ({
  id: slug,
  slug,
  name,
  tagline,
  description: `${name} — engineered in the MOTURBO studio for obsessive finish quality. ${tagline} Every unit is bench-tested, hand-inspected and sealed in signature purple-and-gold packaging before it leaves the atelier.`,
  price,
  category,
  brand,
  rating,
  reviews,
  hue,
  specs: [
    { label: "Origin", value: "MOTURBO Atelier" },
    { label: "Warranty", value: "24 months" },
    { label: "Finish", value: "Showroom grade" },
  ],
  ...extra,
});

export const PRODUCTS: Product[] = [
  mk("noir-elixir-perfume", "Noir Élixir Car Perfume", "Oud, leather and cold amber.", 49, "Fragrance", "MOTURBO Signature", 4.9, 214, 300, {
    badge: "Bestseller",
    compareAt: 65,
  }),
  mk("atelier-cleaning-kit", "Atelier Cleaning Kit", "Fourteen pieces of studio discipline.", 289, "Kits", "MOTURBO Signature", 4.8, 132, 288, { badge: "Kit" }),
  mk("ceramic-9h-coating", "Ceramic 9H Coating Kit", "Nine-year gloss architecture.", 449, "Protection", "TitanShield", 5, 96, 275, {
    badge: "Pro",
    compareAt: 559,
  }),
  mk("turbo-pressure-washer", "Turbo Pressure Washer 180", "180 bar of controlled violence.", 899, "Machines", "TurboLine", 4.7, 74, 260),
  mk("gold-foam-cannon", "Gold Foam Cannon", "Brass body, gold anodised lance.", 179, "Machines", "TurboLine", 4.8, 158, 88, { badge: "Gold Series" }),
  mk("silk-microfiber-towel", "Silk Microfiber Towel Set", "1200 GSM edgeless, zero swirl.", 59, "Detailing", "MOTURBO Signature", 4.9, 402, 285),
  mk("cyclone-vacuum", "Cyclone Studio Vacuum", "Silent 25kPa interior extraction.", 649, "Machines", "TurboLine", 4.6, 61, 250),
  mk("interior-cleaner-pro", "Interior Cleaner Pro", "pH-neutral on alcantara and nappa.", 39, "Interior", "LuxCare", 4.7, 289, 296),
  mk("dashboard-polish", "Dashboard Satin Polish", "Matte restoration, no greasy sheen.", 34, "Interior", "LuxCare", 4.6, 176, 92),
  mk("wheel-cleaner-acid-free", "Wheel Cleaner Acid-Free", "Colour-shifting iron dissolver.", 44, "Wheels", "TitanShield", 4.8, 208, 305),
  mk("orbital-polisher-15", "Orbital Polisher DA15", "15mm throw, digital torque hold.", 749, "Machines", "TurboLine", 4.9, 88, 268, { badge: "Pro" }),
  mk("air-freshener-crystal", "Crystal Air Diffuser", "Machined titanium vent diffuser.", 79, "Fragrance", "MOTURBO Signature", 4.7, 143, 86),
  mk("ppf-care-accessory-kit", "PPF Care Accessory Kit", "Maintain film clarity for years.", 129, "Kits", "TitanShield", 4.5, 57, 292),
  mk("graphene-sealant", "Graphene Sealant 12M", "Hydrophobic slickness, one year.", 159, "Protection", "TitanShield", 4.8, 121, 280, { badge: "New" }),
  mk("leather-balm", "Nappa Leather Balm", "Feeds, seals and scents the cabin.", 54, "Interior", "LuxCare", 4.7, 99, 84),
  mk("glass-coat-rain", "Glass Coat Rain Repel", "Optical clarity above 120 km/h.", 42, "Protection", "TitanShield", 4.6, 167, 262),
];

export const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
export const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand)));

export type Service = {
  slug: string;
  name: string;
  summary: string;
  from: number;
  duration: string;
  icon: string;
};

export const SERVICES: Service[] = [
  { slug: "ceramic-coating", name: "Ceramic Coating", summary: "9H nano-ceramic layered in a dust-controlled bay for liquid depth.", from: 899, duration: "2 days", icon: "Sparkles" },
  { slug: "ppf", name: "Paint Protection Film", summary: "Self-healing TPU cut to your exact chassis geometry.", from: 2400, duration: "3 days", icon: "ShieldCheck" },
  { slug: "car-wrapping", name: "Car Wrapping", summary: "Full colour change in satin, gloss, chrome and custom print.", from: 1900, duration: "4 days", icon: "Layers" },
  { slug: "window-tinting", name: "Window Tinting", summary: "Nano-ceramic IR rejection without signal loss.", from: 420, duration: "4 hours", icon: "Sun" },
  { slug: "interior-detailing", name: "Interior Detailing", summary: "Steam, extraction and leather reconditioning to factory scent.", from: 340, duration: "1 day", icon: "Armchair" },
  { slug: "exterior-detailing", name: "Exterior Detailing", summary: "Decontamination, gloss enhancement and sealed finish.", from: 260, duration: "6 hours", icon: "Car" },
  { slug: "bike-detailing", name: "Bike Detailing", summary: "Superbike-specific chain, fairing and chrome program.", from: 180, duration: "4 hours", icon: "Bike" },
  { slug: "wheel-detailing", name: "Wheel Detailing", summary: "Wheels-off deep clean, barrel coating and caliper refinish.", from: 300, duration: "1 day", icon: "CircleDot" },
  { slug: "engine-bay", name: "Engine Bay Cleaning", summary: "Low-pressure degrease and dressing of every harness.", from: 190, duration: "3 hours", icon: "Cog" },
  { slug: "headlight-restoration", name: "Headlight Restoration", summary: "Wet-sanded, UV-sealed optical clarity restored.", from: 150, duration: "2 hours", icon: "Lightbulb" },
  { slug: "paint-correction", name: "Paint Correction", summary: "Multi-stage machine polishing measured with paint depth gauges.", from: 780, duration: "2 days", icon: "Wand2" },
  { slug: "car-wash", name: "Signature Car Wash", summary: "Touchless pre-wash, pH-neutral foam, filtered water rinse.", from: 60, duration: "60 min", icon: "Droplets" },
  { slug: "custom-accessories", name: "Custom Accessories", summary: "Bespoke lighting, badges, trims and cabin hardware.", from: 240, duration: "Varies", icon: "Gem" },
];

export const PACKAGES = [
  { id: "essential", name: "Essential", price: 240, perks: ["Signature wash", "Interior vacuum", "Tyre dressing"] },
  { id: "signature", name: "Signature", price: 690, perks: ["Full decontamination", "One-stage correction", "6-month sealant"] },
  { id: "flagship", name: "Flagship", price: 1890, perks: ["Multi-stage correction", "9H ceramic", "Interior protection", "12-month care plan"] },
];

export const BRANCHES = [
  { id: "downtown", name: "MOTURBO Downtown Atelier", address: "Level 1, Marina Tower, Downtown" },
  { id: "north", name: "MOTURBO North Studio", address: "Unit 14, Titanium Park, North District" },
  { id: "airport", name: "MOTURBO Airport Bay", address: "Hangar 7, Airport Business Road" },
];

export const VEHICLE_BRANDS = ["Porsche", "BMW", "Mercedes-Benz", "Audi", "Lamborghini", "Ferrari", "Range Rover", "Tesla", "Toyota", "Ducati"];
export const VEHICLE_TYPES = ["Coupe", "Sedan", "SUV", "Hypercar", "Motorcycle"];

export const TIMELINE = [
  { year: "2013", title: "One bay, one obsession", body: "MOTURBO opens as a single-bay paint correction studio." },
  { year: "2016", title: "The ceramic era", body: "First certified 9H coating line in the region." },
  { year: "2019", title: "The flagship showroom", body: "A 2,400 m² glass-walled studio with reflective black floors." },
  { year: "2022", title: "Accessory atelier", body: "In-house product line launches across 9 countries." },
  { year: "2026", title: "Digital showroom", body: "The MOTURBO experience goes fully immersive online." },
];

export const TEAM = [
  { name: "Aran Velasco", role: "Founder & Master Detailer" },
  { name: "Mira Kohl", role: "Head of Paint Correction" },
  { name: "Dev Suriya", role: "PPF & Wrap Lead" },
  { name: "Lena Oyelaran", role: "Client Experience Director" },
];

export const POSTS = [
  { slug: "ceramic-vs-graphene", title: "Ceramic vs Graphene: what actually survives a summer", excerpt: "We ran both chemistries across 14 panels for 90 days. The results were not what the marketing claims.", tag: "Protection", read: "8 min" },
  { slug: "art-of-paint-correction", title: "The art of reading paint before you touch it", excerpt: "Depth gauges, inspection lighting and knowing when to stop.", tag: "Craft", read: "6 min" },
  { slug: "wrapping-hypercars", title: "Wrapping a hypercar without a single relief cut", excerpt: "Inside a four-day satin transformation.", tag: "Wrapping", read: "11 min" },
  { slug: "interior-scent-design", title: "Designing the scent of a cabin", excerpt: "How Noir Élixir was blended over 40 iterations.", tag: "Atelier", read: "5 min" },
  { slug: "winter-care-protocol", title: "The MOTURBO winter care protocol", excerpt: "Salt, grit and the maintenance calendar we give every client.", tag: "Care", read: "7 min" },
];

export const GALLERY = [
  { id: 1, title: "Satin Nardo Wrap", tag: "Wrapping" },
  { id: 2, title: "9H Ceramic — Onyx GT", tag: "Coating" },
  { id: 3, title: "Wheels-off Refinish", tag: "Wheels" },
  { id: 4, title: "Nappa Restoration", tag: "Interior" },
  { id: 5, title: "PPF Full Front", tag: "PPF" },
  { id: 6, title: "Engine Bay Detail", tag: "Engine" },
  { id: 7, title: "Headlight Clarity", tag: "Restoration" },
  { id: 8, title: "Midnight Purple Build", tag: "Custom" },
];

export const currency = (n: number) => `$${n.toLocaleString("en-US")}`;