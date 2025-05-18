
export interface ProductImage {
  url: string; // Publicly accessible URL
  path: string; // GCS file path for storage management (e.g., deletion)
  name?: string; // Original file name, optional
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[]; // Array of image objects
  category: string;
  style?: string; 
  sizes: string[];
  colors: { name: string; hex: string }[];
  isFeatured?: boolean;
  seasonalCollection?: string;
  stock: number;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  avatar?: string;
  rating: number;
  date: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productIds?: string[];
}
