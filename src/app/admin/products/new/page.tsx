import { ProductForm } from "@/components/admin/ProductForm";
import { Separator } from "@/components/ui/separator";

export default function AddNewProductPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Product</h1>
        <p className="text-muted-foreground">
          Enter the details below to add a new product to your StyleCanvas store.
        </p>
      </header>
      <Separator />
      <ProductForm />
    </div>
  );
}
