import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, UserCircle, Shirt } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shirt className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl text-foreground tracking-tight">StyleCanvas</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-foreground/70 hover:text-foreground transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/admin" className="text-foreground/70 hover:text-foreground transition-colors">
            Admin
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" aria-label="User Account">
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
