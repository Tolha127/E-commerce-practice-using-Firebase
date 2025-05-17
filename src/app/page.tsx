import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { mockProducts, mockCollections } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = mockProducts.filter(p => p.isFeatured).slice(0, 4);
  const collections = mockCollections.slice(0, 2);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex items-center justify-center text-center bg-gradient-to-br from-primary/30 via-background to-background">
        <Image 
          src="https://placehold.co/1920x1080.png" 
          alt="Fashion model showcasing StyleCanvas collection" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-30"
          data-ai-hint="fashion model"
          priority
        />
        <div className="relative z-10 p-6 rounded-lg max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Discover Your <span className="text-primary">Signature Style</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-xl mx-auto">
            Explore curated collections and timeless pieces that define elegance and sophistication.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-foreground mb-10">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      {/* Seasonal Collections Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Seasonal Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map(collection => (
              <Card key={collection.id} className="overflow-hidden shadow-lg group">
                <div className="relative h-72">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint="fashion collection"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-foreground">{collection.name}</CardTitle>
                  <CardDescription className="text-foreground/70">{collection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href={`/products?collection=${collection.id}`}>Explore Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
