export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // URLs to images, these will be public URLs after upload
  category: string;
  style?: string; 
  sizes: string[];
  colors: { name: string; hex: string }[]; // Color name and hex value for swatches
  isFeatured?: boolean;
  seasonalCollection?: string; // e.g., "Summer Vibes", "Winter Elegance"
  stock: number;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  avatar?: string; // URL to avatar image
  rating: number; // Stars from 1 to 5
  date: string; // Date of testimonial
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string; // URL to collection banner image
  productIds?: string[]; // Optional: IDs of products in this collection
}
