
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
// import { useToast } from '@/hooks/use-toast'; // No longer needed for cart
import { Label } from "@/components/ui/label";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const { toast } = useToast(); // No longer needed for cart

  const productId = params?.id;

  useEffect(() => {
    if (productId) {
      const foundProduct = mockProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      } else {
        setProduct(null);
      }
    }
  }, [productId]);

  if (!productId && typeof window !== 'undefined') { // Initial state before productId is available on client
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading product identifier...</p>
      </div>
    );
  }

  if (!product && productId) { // productId is available, but product is not found or still loading
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Product not found.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }
  
  if (!product) { // Fallback, should be covered by above, but good for safety
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;

    const messageParts = [
      "Hi, I'm interested in purchasing this item from StyleCanvas:",
      `Product: ${product.name}`,
    ];
    if (selectedSize) messageParts.push(`Size: ${selectedSize}`);
    if (selectedColor) messageParts.push(`Color: ${selectedColor.name}`);
    messageParts.push(`Quantity: ${quantity}`);
    messageParts.push(`Price per item: $${product.price.toFixed(2)}`);
    messageParts.push(`Total Price: $${(product.price * quantity).toFixed(2)}`);
    
    const message = messageParts.join('\n');
    const whatsappNumber = "2349167108795"; // Ensure no '+' or spaces for wa.me link
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank'); // Open in a new tab
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300 ease-in-out"
              data-ai-hint="fashion clothing detail"
              priority={currentImageIndex === 0}
            />
             {product.images.length > 1 && (
              <>
                <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'
                  } transition-all`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="fashion clothing thumbnail" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(123 reviews)</span>
          </div>

          {product.seasonalCollection && (
            <Badge variant="secondary" className="text-sm py-1 px-3">{product.seasonalCollection}</Badge>
          )}

          <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>

          <Separator />

          <p className="text-foreground/80 leading-relaxed">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="size-select" className="text-sm font-medium">Size:</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size-select" className="w-full md:w-1/2">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Color: <span className="font-normal text-muted-foreground">{selectedColor?.name}</span></Label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor?.name === color.name ? 'ring-2 ring-offset-2 ring-primary' : 'border-muted hover:border-foreground/50'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-pressed={selectedColor?.name === color.name}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity-input" className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity-input"
                type="number"
                className="w-16 text-center"
                value={quantity}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= product.stock && val <=10) setQuantity(val);
                    else if (val < 1) setQuantity(1);
                    else if (val > product.stock) setQuantity(product.stock);
                    else if (val > 10) setQuantity(10);
                }}
                min="1"
                max={Math.min(10, product.stock)}
                aria-live="polite"
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.min(Math.min(10, product.stock), q + 1))} disabled={quantity >= product.stock || quantity >=10}>
                <Plus className="h-4 w-4" />
              </Button>
              {product.stock < 10 && product.stock > 0 && <span className="text-sm text-destructive">Only {product.stock} left!</span>}
              {product.stock === 0 && <span className="text-sm text-destructive">Out of stock</span>}
            </div>
          </div>

          <Separator />

          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'Add to Cart (via WhatsApp)' : 'Out of Stock'}
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Category: {product.category}</p>
            {product.style && <p>Style: {product.style}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for quantity input
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
