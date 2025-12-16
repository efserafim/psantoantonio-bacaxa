import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChurchIcon } from "lucide-react";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Notícias", href: "/noticias" },
  { label: "Pastorais", href: "/pastorais" },
  { label: "Missas", href: "/missas" },
  { label: "Capelas", href: "/capelas" },
];

export default function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" className="flex items-center gap-3" data-testid="link-home-logo">
            <div className="bg-white/10 p-2 rounded-md">
              <ChurchIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-bold text-primary-foreground hidden sm:block">
              Paróquia Santo Antonio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 ${
                    location === item.href ? "bg-white/15 text-primary-foreground" : ""
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/admin" className="hidden sm:block">
              <Button variant="secondary" size="sm" data-testid="button-admin-login">
                Área Administrativa
              </Button>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-primary-foreground" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary border-primary-border w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 ${
                          location === item.href ? "bg-white/15 text-primary-foreground" : ""
                        }`}
                        data-testid={`link-mobile-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full" data-testid="button-mobile-admin">
                      Área Administrativa
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
