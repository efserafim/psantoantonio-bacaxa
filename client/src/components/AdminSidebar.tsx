import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Clock,
  ChurchIcon,
  LogOut,
  Home,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const menuItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Notícias", href: "/admin/noticias", icon: Newspaper },
  { title: "Pastorais", href: "/admin/pastorais", icon: Users },
  { title: "Horários de Missas", href: "/admin/missas", icon: Clock },
  { title: "Capelas", href: "/admin/capelas", icon: ChurchIcon },
];

export default function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAdminAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-primary p-2 rounded-md">
            <ChurchIcon className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-sm">Paróquia Santo Antonio</h2>
            <p className="text-xs text-sidebar-foreground/60">Painel Administrativo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                  >
                    <Link href={item.href} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2" size="sm" data-testid="button-admin-view-site">
              <Home className="h-4 w-4" />
              Ver Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-destructive" 
            size="sm" 
            data-testid="button-admin-logout"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
