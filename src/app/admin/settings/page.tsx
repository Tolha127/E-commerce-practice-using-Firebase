
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Kept for standalone labels if any, FormLabel for linked
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const settingsFormSchema = z.object({
  storeName: z.string().min(1, "Store name is required."),
  contactEmail: z.string().email("Invalid email address."),
  maintenanceMode: z.boolean().default(false),
  logoUrl: z.string().optional(), // For simplicity, not handling actual file upload
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format."),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const router = useRouter(); // if we want to redirect or refresh

  // In a real app, these defaults would come from a database or config
  const defaultValues: Partial<SettingsFormValues> = {
    storeName: "StyleCanvas",
    contactEmail: "contact@stylecanvas.com",
    maintenanceMode: false,
    themeColor: "#C8A2C8",
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: SettingsFormValues) {
    console.log("Settings submitted:", data);
    // In a real app, you would send this data to your API to save it.
    toast({
      title: "Settings Saved!",
      description: "Your store settings have been updated.",
    });
    // Optionally, refresh data or redirect
    // router.refresh(); 
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Settings className="mr-3 h-6 w-6" /> Store Settings
        </h1>
        <p className="text-muted-foreground">
          Configure various settings for your StyleCanvas store.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic store information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Maintenance Mode
                      </FormLabel>
                      <FormDescription>
                        Temporarily make your store unavailable to customers.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormItem>
                <FormLabel htmlFor="logoUpload">Store Logo</FormLabel>
                {/* Actual file upload is complex and not implemented here. This is a placeholder. */}
                <FormControl>
                  <Input id="logoUpload" type="file" />
                </FormControl>
                <FormDescription>Recommended size: 200x50px. Accepts PNG, JPG.</FormDescription>
                {/* For actual logo URL management, you might use a separate field in schema */}
              </FormItem>
              
              <FormField
                control={form.control}
                name="themeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Theme Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="w-24 h-10 p-1" />
                    </FormControl>
                    <FormDescription>Note: Full theme customization is in globals.css.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Settings</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
