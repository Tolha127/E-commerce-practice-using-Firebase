import Image from 'next/image';
import { TestimonialCard } from '@/components/TestimonialCard';
import { mockTestimonials } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Feather, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/20 to-background">
         <Image 
          src="https://placehold.co/1920x600.png" 
          alt="StyleCanvas brand essence" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-20"
          data-ai-hint="abstract texture"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">About StyleCanvas</h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
            We believe fashion is more than just clothing – it&apos;s a form of self-expression, a canvas for your unique style.
          </p>
        </div>
      </section>

      {/* Brand Ethos Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Philosophy</h2>
            <p className="text-foreground/80 mb-4 leading-relaxed">
              At StyleCanvas, our mission is to empower individuals to express their authentic selves through thoughtfully curated fashion. We are committed to blending timeless elegance with contemporary trends, ensuring every piece in our collection is crafted with quality, passion, and an eye for detail.
            </p>
            <p className="text-foreground/80 mb-4 leading-relaxed">
              Sustainability and ethical practices are at the heart of what we do. We strive to partner with artisans and manufacturers who share our values, creating fashion that not only looks good but also feels good to wear and own.
            </p>
            <Button asChild variant="link" className="text-primary p-0 h-auto">
              <Link href="/sustainability">Learn More About Our Commitment</Link>
            </Button>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://placehold.co/600x600.png"
              alt="Behind the scenes at StyleCanvas"
              layout="fill"
              objectFit="cover"
              data-ai-hint="fashion design studio"
            />
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Passion for Style</h3>
              <p className="text-foreground/70">Curating pieces that inspire confidence and celebrate individuality.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Feather className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Quality Craftsmanship</h3>
              <p className="text-foreground/70">Ensuring every item meets our high standards of quality and durability.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Customer Centricity</h3>
              <p className="text-foreground/70">Providing an exceptional experience for our valued community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground mb-10">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTestimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </div>
  );
}
