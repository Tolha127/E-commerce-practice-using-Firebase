
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockProducts } from '@/lib/mockData'; // Will be updated if product fetching changes
import type { Product } from '@/lib/types'; // Product type now uses ProductImage
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Label } from "@/components/ui/label";
import { getProductAction } from '@/server/actions/productActions'; // Using server action
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const productId = params?.id;

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      setError(null);
      const fetchProduct = async () => {
        try {
          // Replace mockProducts.find with actual data fetching if not using mock for this page
          // const foundProduct = mockProducts.find(p => p.id === productId);
          const foundProduct = await getProductAction(productId);

          if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.sizes.length > 0) {
              setSelectedSize(foundProduct.sizes[0]);
            }
            if (foundProduct.colors.length > 0) {
              setSelectedColor(foundProduct.colors[0]);
            }
          } else {
            setError("Product not found.");
            setProduct(null);
          }
        } catch (e: any) {
           const errorMessage = e.message || "Failed to load product details.";
           setError(errorMessage);
           toast({ title: "Error", description: errorMessage, variant: "destructive"});
           setProduct(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    } else {
        setIsLoading(false); // No ID, so not loading
    }
  }, [productId, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">Oops! Something went wrong.</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }
  
  if (!product) {
     return ( // Should ideally be caught by error state if fetch fails or not found
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you are looking for does not exist or may have been removed.</p>
        <Button asChild variant="default">
          <Link href="/products">Browse Other Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const messageParts = [
      "Hi, I'm interested in purchasing this item from StyleCanvas:",
      `Product: ${product.name} (ID: ${product.id})`,
    ];
    if (selectedSize) messageParts.push(`Size: ${selectedSize}`);
    if (selectedColor) messageParts.push(`Color: ${selectedColor.name}`);
    messageParts.push(`Quantity: ${quantity}`);
    messageParts.push(`Price per item: $${product.price.toFixed(2)}`);
    messageParts.push(`Total Price: $${(product.price * quantity).toFixed(2)}`);
    
    const message = messageParts.join('\n');
    const whatsappNumber = "2349167108795";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const currentImageSrc = product.images[currentImageIndex]?.url || 'https://placehold.co/600x800.png?text=Image+Not+Available';


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg bg-muted">
            <Image
              src={currentImageSrc}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300 ease-in-out"
              data-ai-hint="fashion clothing detail"
              priority={currentImageIndex === 0}
              unoptimized={currentImageSrc.startsWith('https://placehold.co')} // Avoid optimizing placeholder.co
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
                  key={img.path || index} // Use path for key if available
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'
                  } transition-all bg-muted`}
                >
                  <Image 
                    src={img.url || 'https://placehold.co/100x100.png'} 
                    alt={`${product.name} thumbnail ${index + 1}`} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint="fashion clothing thumbnail"
                    unoptimized={img.url?.startsWith('https://placehold.co')}
                   />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(123 reviews)</span> {/* Mock reviews */}
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
              <input
                id="quantity-input"
                type="number"
                className="w-16 text-center h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={quantity}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                        if (val >= 1 && val <= product.stock && val <=10) setQuantity(val);
                        else if (val < 1) setQuantity(1);
                        else if (val > product.stock) setQuantity(product.stock);
                        else if (val > 10) setQuantity(10);
                    } else {
                        setQuantity(1); // Reset to 1 if input is not a number
                    }
                }}
                min="1"
                max={Math.min(10, product.stock)} // Max 10 or available stock, whichever is less
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
            <p>Available Stock: {product.stock}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
