
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
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

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic store information and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="StyleCanvas" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeEmail">Contact Email</Label>
            <Input id="storeEmail" type="email" defaultValue="contact@stylecanvas.com" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="maintenance-mode" />
            <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of your store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="logoUpload">Store Logo</Label>
            <Input id="logoUpload" type="file" />
            <p className="text-xs text-muted-foreground">Recommended size: 200x50px. Accepts PNG, JPG.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="themeColor">Primary Theme Color</Label>
            <Input id="themeColor" type="color" defaultValue="#C8A2C8" className="w-24 h-10 p-1" />
             <p className="text-xs text-muted-foreground">Note: Full theme customization is in globals.css.</p>
          </div>
        </CardContent>
      </Card>

      <Separator />
      
      <div className="flex justify-end">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Settings</Button>
      </div>
    </div>
  );
}
