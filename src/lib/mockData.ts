
import type { Product, Testimonial, Collection, ProductImage } from './types';

const generateMockImages = (baseName: string, count: number): ProductImage[] => {
  const images: ProductImage[] = [];
  for (let i = 1; i <= count; i++) {
    const imageName = `${baseName}-${i}.png`;
    images.push({
      url: `https://placehold.co/600x800.png?text=${encodeURIComponent(baseName)}-${i}`,
      path: `mock/products/${baseName}/${imageName}`, // Mock GCS path
      name: imageName,
    });
  }
  return images;
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Lavender Bliss Dress',
    description: 'A stunning dress perfect for evening occasions, crafted from the finest silk.',
    price: 129.99,
    images: generateMockImages('lavender-dress', 3),
    category: 'Dresses',
    style: 'Formal',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Lavender', hex: '#E6E6FA' }, { name: 'Deep Indigo', hex: '#C8A2C8' }],
    isFeatured: true,
    seasonalCollection: 'Spring Bloom 2024',
    stock: 15,
  },
  {
    id: '2',
    name: 'Golden Hour Top',
    description: 'A chic top that captures the essence of a golden sunset. Versatile and comfortable.',
    price: 59.99,
    images: generateMockImages('golden-top', 2),
    category: 'Tops',
    style: 'Casual',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Gold', hex: '#FFD700' }, { name: 'Cream', hex: '#FFFDD0' }],
    isFeatured: true,
    stock: 25,
  },
  {
    id: '3',
    name: 'Urban Flow Trousers',
    description: 'Comfortable and stylish trousers for the modern urbanite. Made with breathable cotton.',
    price: 79.99,
    images: generateMockImages('urban-trousers', 1),
    category: 'Bottoms',
    style: 'Urban',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Beige', hex: '#F5F5DC' }],
    stock: 30,
  },
  {
    id: '4',
    name: 'Indigo Dream Scarf',
    description: 'A luxurious scarf in deep indigo tones, perfect for adding a touch of sophistication.',
    price: 39.99,
    images: [{ url: 'https://placehold.co/600x400.png?d=1', path: 'mock/products/indigo-scarf/scarf.png', name: 'scarf.png'}],
    category: 'Accessories',
    style: 'Elegant',
    sizes: ['One Size'],
    colors: [{ name: 'Deep Indigo', hex: '#C8A2C8' }, { name: 'Silver', hex: '#C0C0C0' }],
    seasonalCollection: 'Winter Warmth 2024',
    stock: 50,
  },
  {
    id: '5',
    name: 'Classic White Tee',
    description: 'A wardrobe essential. Soft, durable, and endlessly versatile.',
    price: 29.99,
    images: generateMockImages('white-tee', 1),
    category: 'Tops',
    style: 'Basic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', hex: '#FFFFFF' }],
    stock: 100,
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah L.',
    text: 'I absolutely love the quality and style of StyleCanvas clothing! The Lavender Bliss Dress is my new favorite.',
    avatar: 'https://placehold.co/100x100.png?t=1',
    rating: 5,
    date: '2024-05-15',
  },
  {
    id: '2',
    author: 'John B.',
    text: 'Shopping experience was seamless, and the Urban Flow Trousers are incredibly comfortable. Highly recommend!',
    avatar: 'https://placehold.co/100x100.png?t=2',
    rating: 4,
    date: '2024-05-20',
  },
  {
    id: '3',
    author: 'Emily K.',
    text: 'StyleCanvas has such unique pieces. The Golden Hour Top always gets me compliments. The customer service is also top-notch.',
    avatar: 'https://placehold.co/100x100.png?t=3',
    rating: 5,
    date: '2024-04-28',
  },
];

export const mockCollections: Collection[] = [
  {
    id: 'col1',
    name: 'Spring Bloom 2024',
    description: 'Embrace the new season with fresh styles and vibrant colors.',
    image: 'https://placehold.co/1200x400.png?col=1',
    productIds: ['1'],
  },
  {
    id: 'col2',
    name: 'Winter Warmth 2024',
    description: 'Stay cozy and chic with our latest winter collection.',
    image: 'https://placehold.co/1200x400.png?col=2',
    productIds: ['4'],
  },
  {
    id: 'col3',
    name: 'Urban Essentials',
    description: 'Modern staples for your city lifestyle.',
    image: 'https://placehold.co/1200x400.png?col=3',
    productIds: ['3'],
  }
];
