import { ActiveLink } from "@/components/ui/active-link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { links } from "./layoutData";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Cookie from "js-cookie";
import { toast } from "sonner";

type RoleType = "teacher" | "admin" | "superAdmin";

const NavbarLayout = ({ role }: { role: RoleType }) => {
  const navigate = useNavigate();
  const currentLinks = links[role] || links.teacher;

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("role");
    toast.success("Tizimdan chiqdingiz", { position: "bottom-right" });
    if (role === "teacher") {
      navigate("/login/teacher");
    } else {
      navigate("/login/admin");
    }
  };

  return (
    <Sidebar className=" bg-brand-secondary border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <Link
          to={`/app/${role === "superAdmin" ? "admin" : role}`}
          className="flex items-center gap-3 group"
        >
          <span className="font-semibold text-lg text-sidebar-foreground">
            HelpMeHelpYou
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {currentLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="h-11 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <ActiveLink href={item.url}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </ActiveLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-11 rounded-lg text-brand-error hover:text-white hover:bg-brand-error transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="font-medium">Profildan Chiqish</span>
              </Button>
            </div>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
};

export default NavbarLayout;
