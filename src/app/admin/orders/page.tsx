
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <BarChart3 className="mr-3 h-6 w-6" /> Orders Management
        </h1>
        <p className="text-muted-foreground">
          View and manage customer orders.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>A list of all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Orders functionality will be implemented here.</p>
            <p className="text-sm text-muted-foreground/70">
              You'll be able to see order details, statuses, and manage fulfillment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
