// =====================================================
// FARMVERSE - AGRICULTURE IMAGES
// =====================================================

// -----------------------------------------------------
// FARMER IMAGE - LOGIN LEFT SIDE
// -----------------------------------------------------

export const LOGIN_FARMER_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=90";


// -----------------------------------------------------
// CROP FIELD IMAGE - LOGIN RIGHT SIDE
// -----------------------------------------------------

export const LOGIN_CROP_FIELD_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=90";


// =====================================================
// FARM IMAGES
// =====================================================

const FARM_IMAGES = [

  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",

  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85",

  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=90",

  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85",

  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1600&q=85"
];


// -----------------------------------------------------
// GET FARM IMAGE
// -----------------------------------------------------

export const getFarmImage = (index = 0) => {
  return FARM_IMAGES[index % FARM_IMAGES.length];
};


// =====================================================
// CROP IMAGES
// =====================================================

const CROP_IMAGES = {

  tomato:
    "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80",

  rice:
    "https://images.unsplash.com/photo-1536058901702-1e2c5c4f9e0c?auto=format&fit=crop&w=1200&q=80",

  wheat:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",

  sugarcane:
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",

  cotton:
    "https://images.unsplash.com/photo-1598512752271-33f74c6b6f3c?auto=format&fit=crop&w=1200&q=80",

  maize:
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80",

  corn:
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80",

  banana:
    "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",

  mango:
    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80",

  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80",

  onion:
    "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80",

  chilli:
    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=80"
};


const DEFAULT_CROP_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";


// -----------------------------------------------------
// GET CROP IMAGE
// -----------------------------------------------------

export const getCropHeroImage = (cropName = "") => {

  const name = String(cropName)
    .toLowerCase()
    .trim();

  for (const key of Object.keys(CROP_IMAGES)) {

    if (name.includes(key)) {
      return CROP_IMAGES[key];
    }

  }

  return DEFAULT_CROP_IMAGE;
};


// =====================================================
// GENERAL AGRICULTURE IMAGE
// =====================================================

export const getAgricultureImage = (
  type,
  name = "",
  index = 0
) => {

  if (type === "farm") {
    return getFarmImage(index);
  }

  if (type === "crop") {
    return getCropHeroImage(name);
  }

  if (type === "login-farmer") {
    return LOGIN_FARMER_IMAGE;
  }

  if (type === "login") {
    return LOGIN_CROP_FIELD_IMAGE;
  }

  return DEFAULT_CROP_IMAGE;
};


// =====================================================
// PAGE HERO IMAGES
// =====================================================

export const PAGE_HERO_IMAGES = {

  login: LOGIN_CROP_FIELD_IMAGE,

  dashboard:
    "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&w=1600&q=85",

  farm:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",

  crop:
    "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1600&q=85",

  expense:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=85",

  input:
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=85",

  ai:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85",

  report:
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1600&q=85"
};


export const getPageHeroImage = (pageName = "dashboard") => {

  return (
    PAGE_HERO_IMAGES[pageName] ||
    PAGE_HERO_IMAGES.dashboard
  );

};


// =====================================================
// INPUT CATEGORY IMAGES
// =====================================================

export const INPUT_CATEGORY_IMAGES = {

  seed:
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",

  fertilizer:
    "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",

  pesticide:
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",

  irrigation:
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?auto=format&fit=crop&w=800&q=80",

  equipment:
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",

  tractor:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
};


export const getInputCategoryImage = (
  categoryName = ""
) => {

  const name = String(categoryName).toLowerCase();

  if (name.includes("seed")) {
    return INPUT_CATEGORY_IMAGES.seed;
  }

  if (name.includes("fertil")) {
    return INPUT_CATEGORY_IMAGES.fertilizer;
  }

  if (name.includes("pestic")) {
    return INPUT_CATEGORY_IMAGES.pesticide;
  }

  if (
    name.includes("water") ||
    name.includes("irrig")
  ) {
    return INPUT_CATEGORY_IMAGES.irrigation;
  }

  if (
    name.includes("tractor") ||
    name.includes("equipment") ||
    name.includes("machine")
  ) {
    return INPUT_CATEGORY_IMAGES.tractor;
  }

  return INPUT_CATEGORY_IMAGES.equipment;
};