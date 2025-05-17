import { ProductCard } from '@/components/ProductCard';
import { ProductFilter } from '@/components/ProductFilter';
import { mockProducts } from '@/lib/mockData';
import { Separator } from '@/components/ui/separator';
import { ListFilter } from 'lucide-react';

export default function ProductsPage() {
  // TODO: Implement actual filtering based on ProductFilter state
  const productsToDisplay = mockProducts;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our carefully curated selection of high-quality fashion items.
        </p>
      </header>
      
      <Separator className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside className="lg:col-span-1">
          <ProductFilter />
        </aside>

        <main className="lg:col-span-3">
          {productsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productsToDisplay.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ListFilter className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-xl font-semibold text-foreground">No Products Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
          {/* TODO: Add pagination if many products */}
        </main>
      </div>
    </div>
  );
}
