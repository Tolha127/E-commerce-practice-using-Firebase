import Link from 'next/link';
import { Home, ShoppingBag, Settings, Users, BarChart3, Shirt } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AdminNavLink = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => (
  <Link href={href} passHref>
    <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Button>
  </Link>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-sidebar sm:flex">
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-sidebar-primary">
            <Shirt className="h-7 w-7" />
            <span className="text-xl tracking-tight">StyleCanvas Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-4 space-y-1">
          <AdminNavLink href="/admin" icon={Home}>Dashboard</AdminNavLink>
          <AdminNavLink href="/admin/products" icon={ShoppingBag}>Products</AdminNavLink>
          <AdminNavLink href="/admin/orders" icon={BarChart3}>Orders</AdminNavLink> {/* Placeholder */}
          <AdminNavLink href="/admin/customers" icon={Users}>Customers</AdminNavLink> {/* Placeholder */}
          <AdminNavLink href="/admin/settings" icon={Settings}>Settings</AdminNavLink> {/* Placeholder */}
        </nav>
        <Separator className="my-2 bg-sidebar-border" />
         <div className="p-4 mt-auto border-t border-sidebar-border">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100.png?admin=avatar" alt="Admin User" data-ai-hint="person avatar"/>
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                    <p className="text-xs text-sidebar-foreground/70">admin@stylecanvas.com</p>
                </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              Logout
            </Button>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72 flex-1"> {/* Added pl-72 for sidebar width */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Menu Trigger can be added here */}
          <div className="ml-auto flex items-center gap-2">
            {/* Header actions like search or notifications can go here */}
          </div>
        </header>
        <main className="flex-1 p-6 bg-background sm:rounded-tl-xl shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
