'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as productService from '@/server/services/productService';
import type { Product } from '@/lib/types';
import { z } from 'zod';

// Helper to parse comma-separated sizes string
function parseSizes(sizesString?: string): string[] {
  if (!sizesString) return [];
  return sizesString.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to parse comma-separated colors string (e.g., "Red:#FF0000,Blue:#0000FF")
function parseColors(colorsString?: string): { name: string; hex: string }[] {
  if (!colorsString) return [];
  return colorsString.split(',')
    .map(c => {
      const parts = c.split(':');
      if (parts.length === 2) {
        return { name: parts[0].trim(), hex: parts[1].trim() };
      }
      return null;
    })
    .filter(c => c !== null && c.name && c.hex) as { name: string; hex: string }[];
}

const productActionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  style: z.string().optional(),
  sizes: z.string().optional(), // Will be parsed
  colors: z.string().optional(), // Will be parsed
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  isFeatured: z.string().transform(val => val === 'true').optional().default(false), // FormData sends boolean as string
  seasonalCollection: z.string().optional(),
});


export async function addProductAction(
  prevState: { error?: string; success?: boolean; product?: Product | null } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean; product?: Product | null }> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = productActionSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors_prettyStringify() };
  }
  const data = validatedFields.data;

  const imageFiles = formData.getAll('productImages').filter(file => file instanceof File && file.size > 0) as File[];

  try {
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      style: data.style,
      sizes: parseSizes(data.sizes),
      colors: parseColors(data.colors),
      stock: data.stock,
      isFeatured: data.isFeatured,
      seasonalCollection: data.seasonalCollection,
    };

    const newProduct = await productService.saveProduct(productData, imageFiles);
    if (!newProduct) {
      return { error: 'Failed to create product.' };
    }

    revalidatePath('/admin/products');
    // redirect('/admin/products'); // Don't redirect here, let client handle for better UX with toast
    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Add Product Action Error:", error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function updateProductAction(
  productId: string,
  prevState: { error?: string; success?: boolean; product?: Product | null } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean; product?: Product | null }> {
  if (!productId) return { error: 'Product ID is missing.' };

  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = productActionSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors_prettyStringify() };
  }
  const data = validatedFields.data;
  
  const imageFiles = formData.getAll('productImages').filter(file => file instanceof File && file.size > 0) as File[];

  try {
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      style: data.style,
      sizes: parseSizes(data.sizes),
      colors: parseColors(data.colors),
      stock: data.stock,
      isFeatured: data.isFeatured,
      seasonalCollection: data.seasonalCollection,
    };

    const updatedProduct = await productService.saveProduct(productData, imageFiles, productId);
    if (!updatedProduct) {
      return { error: 'Failed to update product or product not found.' };
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);
    // redirect(`/admin/products`); // Don't redirect here
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Update Product Action Error:", error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function deleteProductAction(productId: string): Promise<{ error?: string; success?: boolean }> {
  if (!productId) return { error: 'Product ID is missing.' };
  try {
    const success = await productService.deleteProductFromDB(productId);
    if (!success) {
      return { error: 'Failed to delete product or product not found.' };
    }
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error("Delete Product Action Error:", error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function getProductsAction(): Promise<Product[]> {
  return productService.getAllProductsFromDB();
}

export async function getProductAction(id: string): Promise<Product | null> {
  return productService.getProductFromDB(id);
}
