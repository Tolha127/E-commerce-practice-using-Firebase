
"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductAction } from "@/server/actions/productActions";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string; // Ensure id is string type

  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const foundProduct = await getProductAction(productId);
          setProduct(foundProduct);
          if (!foundProduct) {
            setError("Product not found.");
          }
        } catch (e) {
          console.error("Failed to fetch product:", e);
          setError("Failed to load product details.");
          setProduct(null);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  if (product === undefined) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold">{error || "Product not found."}</h1>
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
      <ProductForm initialData={product} productId={productId} />
    </div>
  );
}
