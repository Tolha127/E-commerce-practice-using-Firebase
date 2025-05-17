"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { mockProducts } from "@/lib/mockData";
import type { Product } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === params.id);
    setProduct(foundProduct || null);
  }, [params.id]);

  if (product === undefined) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">Product not found.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/admin/products">Back to Products List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Product: {product.name}</h1>
        <p className="text-muted-foreground">
          Update the details for this product.
        </p>
      </header>
      <Separator />
      <ProductForm initialData={product} productId={params.id} />
    </div>
  );
}
