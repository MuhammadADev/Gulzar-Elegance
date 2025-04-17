// Navigation links
export const mainNavLinks = [
  { name: "New Arrivals", path: "/products?newArrival=true" },
  { name: "Collections", path: "#", hasDropdown: true },
  { name: "Categories", path: "#", hasDropdown: true },
  { name: "Occasion Wear", path: "/products?collection=festive" },
  { name: "Ready to Wear", path: "/products?category=ready-to-wear" },
  { name: "Unstitched", path: "/products?category=unstitched" },
  { name: "Sale", path: "/products?sale=true", highlight: true }
];

export const collectionsDropdown = [
  { name: "Summer Collection", path: "/products?collection=summer" },
  { name: "Wedding Season", path: "/products?collection=wedding" },
  { name: "Festive Wear", path: "/products?collection=festive" },
  { name: "Casual Collection", path: "/products?collection=casual" },
  { name: "Premium Range", path: "/products?collection=premium" }
];

export const categoriesDropdown = [
  { name: "Lawn Suits", path: "/products/lawn_suits" },
  { name: "Chiffon Suits", path: "/products/chiffon_suits" },
  { name: "Cotton Suits", path: "/products/cotton_suits" },
  { name: "Embroidered Suits", path: "/products/embroidered_suits" },
  { name: "Printed Suits", path: "/products/printed_suits" }
];

// Category cards for homepage
export const categories = [
  {
    id: 1,
    name: "Lawn Suits",
    description: "Perfect for summer",
    image: "https://i.imgur.com/jVTXLUH.jpg",
    slug: "lawn_suits"
  },
  {
    id: 2,
    name: "Embroidered",
    description: "Intricate handwork",
    image: "https://i.imgur.com/nC9g6Vj.jpg",
    slug: "embroidered_suits"
  },
  {
    id: 3,
    name: "Chiffon",
    description: "Elegant & flowing",
    image: "https://i.imgur.com/pKdA0K2.jpg",
    slug: "chiffon_suits"
  },
  {
    id: 4,
    name: "Printed",
    description: "Bold patterns",
    image: "https://i.imgur.com/1X9VfbR.jpg",
    slug: "printed_suits"
  },
  {
    id: 5,
    name: "Bridal",
    description: "Wedding elegance",
    image: "https://i.imgur.com/GwRjdvq.jpg",
    slug: "bridal_collection"
  },
  {
    id: 6,
    name: "Cotton",
    description: "Comfort & style",
    image: "https://i.imgur.com/Wv65V7D.jpg",
    slug: "cotton_suits"
  }
];

// Hero slider data
export const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2023",
    description: "Discover the latest in Pakistani 3-piece elegance",
    image: "https://i.imgur.com/jVTXLUH.jpg",
    buttonText: "Shop Now",
    buttonLink: "/products?collection=summer"
  },
  {
    id: 2,
    title: "Festive Collection",
    description: "Celebrate in style with our luxurious festive wear",
    image: "https://i.imgur.com/nC9g6Vj.jpg",
    buttonText: "Explore",
    buttonLink: "/products?collection=festive"
  },
  {
    id: 3,
    title: "Wedding Season",
    description: "Timeless elegance for your special occasions",
    image: "https://i.imgur.com/pKdA0K2.jpg",
    buttonText: "View Collection",
    buttonLink: "/products?collection=wedding"
  }
];

// Features section data
export const features = [
  {
    id: 1,
    icon: "truck",
    title: "Free Shipping",
    description: "On all orders above ₨5,000 within Pakistan"
  },
  {
    id: 2,
    icon: "undo",
    title: "Easy Returns",
    description: "7-day return policy for hassle-free shopping"
  },
  {
    id: 3,
    icon: "shield-check",
    title: "Secure Payments",
    description: "Multiple secure payment options available"
  }
];

// Available sizes for products
export const availableSizes = ["XS", "S", "M", "L", "XL"];

// Available colors for products (with hex codes)
export const availableColors = [
  { name: "Pink", value: "#FB7185" },
  { name: "Blue", value: "#60A5FA" },
  { name: "Green", value: "#34D399" },
  { name: "Yellow", value: "#FBBF24" },
  { name: "Purple", value: "#A78BFA" },
  { name: "Red", value: "#EF4444" }
];

// Product sort options
export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" }
];

// Filter options
export const priceRanges = [
  { id: "price-1", label: "Under ₨3,000", min: 0, max: 3000 },
  { id: "price-2", label: "₨3,000 - ₨5,000", min: 3000, max: 5000 },
  { id: "price-3", label: "₨5,000 - ₨8,000", min: 5000, max: 8000 },
  { id: "price-4", label: "₨8,000 - ₨10,000", min: 8000, max: 10000 },
  { id: "price-5", label: "Over ₨10,000", min: 10000, max: Infinity }
];

// Instagram mock data
export const instagramPosts = [
  {
    id: 1,
    image: "https://i.imgur.com/jVTXLUH.jpg",
    likes: 142,
    comments: 23,
    url: "https://www.instagram.com/"
  },
  {
    id: 2,
    image: "https://i.imgur.com/nC9g6Vj.jpg",
    likes: 217,
    comments: 42,
    url: "https://www.instagram.com/"
  },
  {
    id: 3,
    image: "https://i.imgur.com/1X9VfbR.jpg",
    likes: 185,
    comments: 36,
    url: "https://www.instagram.com/"
  },
  {
    id: 4,
    image: "https://i.imgur.com/GwRjdvq.jpg",
    likes: 298,
    comments: 51,
    url: "https://www.instagram.com/"
  },
  {
    id: 5,
    image: "https://i.imgur.com/pKdA0K2.jpg",
    likes: 231,
    comments: 47,
    url: "https://www.instagram.com/"
  },
  {
    id: 6,
    image: "https://i.imgur.com/Wv65V7D.jpg",
    likes: 176,
    comments: 32,
    url: "https://www.instagram.com/"
  }
];
