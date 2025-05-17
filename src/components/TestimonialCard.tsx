import Image from 'next/image';
import type { Testimonial } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-4 pb-3">
        <Avatar className="h-12 w-12">
          {testimonial.avatar && <AvatarImage src={testimonial.avatar} alt={testimonial.author} data-ai-hint="person avatar" />}
          <AvatarFallback>{testimonial.author.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/80 italic">&quot;{testimonial.text}&quot;</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{new Date(testimonial.date).toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  );
}
