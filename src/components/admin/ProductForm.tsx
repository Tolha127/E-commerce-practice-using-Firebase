
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";
import { addProductAction, updateProductAction } from "@/server/actions/productActions";
import { useActionState, useEffect, useState, useRef } from "react"; // Changed from react-dom and useFormState

const productFormSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Category is required." }),
  style: z.string().optional(),
  sizes: z.string().min(1, {message: "Enter comma-separated sizes (e.g., S,M,L)."}),
  colors: z.string().min(1, {message: "Enter comma-separated colors (e.g., Red:#FF0000,Blue:#0000FF)."}),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  isFeatured: z.boolean().default(false),
  seasonalCollection: z.string().optional(),
  // productImages: typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional(), // For client-side validation with react-hook-form
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  productId?: string;
}

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);

  const [addState, addFormAction, isAddPending] = useActionState(addProductAction, undefined);
  const [updateState, updateFormAction, isUpdatePending] = useActionState(
    // Bind productId to updateProductAction if it exists
    productId ? updateProductAction.bind(null, productId) : async () => ({ error: "Product ID missing for update."}),
    undefined
  );
  
  const isPending = isAddPending || isUpdatePending;
  const state = productId ? updateState : addState;

  const defaultValues = initialData
    ? {
        ...initialData,
        sizes: initialData.sizes.join(','),
        colors: initialData.colors.map(c => `${c.name}:${c.hex}`).join(','),
      }
    : {
        name: "",
        description: "",
        price: 0,
        category: "",
        style: "",
        sizes: "",
        colors: "",
        stock: 0,
        isFeatured: false,
        seasonalCollection: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (state?.success) {
      const action = initialData ? "updated" : "created";
      toast({
        title: `Product ${action}!`,
        description: `${state.product?.name || 'Product'} has been successfully ${action}.`,
      });
      router.push("/admin/products");
      router.refresh(); // To see changes
    } else if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, initialData, router, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5)); // Limit to 5 previews
    }
  };

  // This function will be called by the form's onSubmit
  const processForm = (data: ProductFormValues) => {
    const formData = new FormData();
    
    // Append all fields from 'data' (ProductFormValues)
    (Object.keys(data) as Array<keyof ProductFormValues>).forEach((key) => {
        const value = data[key];
        if (key === 'isFeatured') {
          formData.append(key, value ? 'true' : 'false');
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null && typeof value === 'string') {
          formData.append(key, value);
        }
      });

    // Handle file input from the ref
    if (imageInputRef.current && imageInputRef.current.files) {
      for (let i = 0; i < imageInputRef.current.files.length; i++) {
        formData.append('productImages', imageInputRef.current.files[i]);
      }
    }
    
    if (productId) {
      updateFormAction(formData);
    } else {
      addFormAction(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          {initialData ? `Update details for ${initialData.name}.` : "Fill in the details for the new product."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Breeze Dress" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dresses, Tops, Accessories" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the product..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Casual, Formal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <Input placeholder="S,M,L,XL" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list of available sizes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <Input placeholder="Red:#FF0000,Blue:#0000FF" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated Name:Hex pairs (e.g., Sky Blue:#87CEEB).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
                <FormLabel htmlFor="productImages">Product Images</FormLabel>
                <FormControl>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="productImages-input" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Max 5 files)</p>
                            </div>
                            <Input 
                              id="productImages-input" 
                              type="file" 
                              className="hidden" 
                              multiple 
                              accept="image/png, image/jpeg, image/gif"
                              ref={imageInputRef}
                              onChange={handleImageChange}
                              name="productImages" // Important for FormData
                            />
                        </label>
                    </div> 
                </FormControl>
                 {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <img src={src} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                )}
                <FormDescription>Upload up to 5 product images. First image will be the main display.</FormDescription>
                <FormMessage />
            </FormItem>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="seasonalCollection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seasonal Collection (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-full justify-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Feature this product?
                      </FormLabel>
                      <FormDescription>
                        Featured products appear on the homepage.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
                {isPending ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Product")}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
