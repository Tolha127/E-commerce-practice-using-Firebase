
"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductAction } from "@/server/actions/productActions";
import { useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const foundProduct = await getProductAction(productId);
          setProduct(foundProduct);
          if (!foundProduct) {
            setError("Product not found. It may have been deleted.");
             toast({ title: "Error", description: "Product not found.", variant: "destructive" });
          }
        } catch (e: any) {
          const errorMessage = e.message || "Failed to load product details.";
          console.error("Failed to fetch product:", e);
          setError(errorMessage);
          toast({ title: "Error", description: errorMessage, variant: "destructive" });
          setProduct(null); // Explicitly set to null on error
        }
      };
      fetchProduct();
    }
  }, [productId, toast]);

  if (product === undefined) { // Still loading
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) { // Error occurred or product is null (not found)
    return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">{error || "Product not found."}</h1>
        <p className="text-muted-foreground mb-4">
          The product you are trying to edit could not be loaded. It might have been deleted or an error occurred.
        </p>
        <Button asChild variant="outline" className="mt-4">
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
          Update the details for this product. New image uploads will replace all current images.
        </p>
      </header>
      <Separator />
      <ProductForm initialData={product} productId={productId} />
    </div>
  );
}
