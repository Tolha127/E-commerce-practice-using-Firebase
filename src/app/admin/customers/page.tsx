
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Users className="mr-3 h-6 w-6" /> Customer Management
        </h1>
        <p className="text-muted-foreground">
          View and manage customer information.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>A list of all registered customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Customer management features will be implemented here.</p>
            <p className="text-sm text-muted-foreground/70">
              You'll be able to see customer details, order history, and manage accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
