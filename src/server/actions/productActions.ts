
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
  name: z.string().min(1, "Product name is required."),
  description: z.string().min(1, "Description is required."),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, "Category is required."),
  style: z.string().optional(),
  sizes: z.string().optional().refine(value => !value || parseSizes(value).length > 0, {
    message: "Sizes must be a comma-separated list (e.g., S,M,L) if provided.",
  }),
  colors: z.string().optional().refine(value => !value || parseColors(value).length > 0, {
    message: "Colors must be comma-separated Name:Hex pairs (e.g., Red:#FF0000,Blue:#0000FF) if provided.",
  }),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  isFeatured: z.string().transform(val => val === 'true').optional().default(false),
  seasonalCollection: z.string().optional(),
});


export async function addProductAction(
  prevState: { error?: string; success?: boolean; product?: Product | null } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean; product?: Product | null }> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = productActionSchema.safeParse(rawData);
  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => `${e.path.join('.') || 'Error'}: ${e.message}`).join('; ');
    return { error: `Validation failed: ${errorMessages}` };
  }
  const data = validatedFields.data;

  const imageFiles = formData.getAll('productImages').filter(file => file instanceof File && file.size > 0) as File[];

  if (imageFiles.length === 0) {
    return { error: 'At least one product image is required.' };
  }
  if (imageFiles.length > 5) {
    return { error: 'You can upload a maximum of 5 images.' };
  }


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
      return { error: 'Failed to create product. Please try again.' };
    }

    revalidatePath('/admin/products');
    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Add Product Action Error:", error);
    return { error: error instanceof Error ? error.message : 'An unknown server error occurred while adding the product.' };
  }
}

export async function updateProductAction(
  productId: string,
  prevState: { error?: string; success?: boolean; product?: Product | null } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean; product?: Product | null }> {
  if (!productId) return { error: 'Product ID is missing. Cannot update.' };

  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = productActionSchema.safeParse(rawData);
  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => `${e.path.join('.') || 'Error'}: ${e.message}`).join('; ');
    return { error: `Validation failed: ${errorMessages}` };
  }
  const data = validatedFields.data;
  
  const imageFiles = formData.getAll('productImages').filter(file => file instanceof File && file.size > 0) as File[];
  
  if (imageFiles.length > 5) {
    return { error: 'You can upload a maximum of 5 images.' };
  }

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
      return { error: 'Failed to update product or product not found. Please try again.' };
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Update Product Action Error:", error);
    return { error: error instanceof Error ? error.message : 'An unknown server error occurred while updating the product.' };
  }
}

export async function deleteProductAction(productId: string): Promise<{ error?: string; success?: boolean }> {
  if (!productId) return { error: 'Product ID is missing. Cannot delete.' };
  try {
    const success = await productService.deleteProductFromDB(productId);
    if (!success) {
      return { error: 'Failed to delete product or product not found.' };
    }
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error("Delete Product Action Error:", error);
    return { error: error instanceof Error ? error.message : 'An unknown server error occurred while deleting the product.' };
  }
}

export async function getProductsAction(): Promise<Product[]> {
  try {
    return await productService.getAllProductsFromDB();
  } catch (error) {
    console.error("Get Products Action Error:", error);
    // In a client component, you'd handle this state. For now, returning empty.
    // Or throw and let an error boundary catch it.
    throw new Error("Failed to fetch products.");
  }
}

export async function getProductAction(id: string): Promise<Product | null> {
   try {
    return await productService.getProductFromDB(id);
  } catch (error) {
    console.error(`Get Product Action Error (ID: ${id}):`, error);
    // For a page, returning null might lead to a "not found" state handled by the page.
    // Or throw and let an error boundary catch it.
    throw new Error(`Failed to fetch product with ID: ${id}.`);
  }
}
