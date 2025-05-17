
"use client";

import { useActionState, useEffect } from "react"; // Changed from react-dom and useFormState
import { useFormStatus } from "react-dom"; // useFormStatus remains in react-dom
import { loginUser } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" aria-disabled={pending}>
      {pending ? "Logging in..." : (
        <>
          <LogIn className="mr-2 h-4 w-4" /> Login
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginUser, undefined); // Changed here
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      // Redirect is handled by the server action, but as a fallback or for client-side indication:
      // router.push('/admin'); 
      // No need to explicitly push here if server action `redirect` works reliably.
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/30 via-background to-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Shirt className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl text-foreground tracking-tight">StyleCanvas</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Access your StyleCanvas dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@stylecanvas.com"
                required
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-card"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">{state.error}</p>
            )}
            <LoginButton />
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StyleCanvas. Secure Access.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
