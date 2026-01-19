import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import NavbarLayout from "./NavbarLayout";
import Cookie from "js-cookie";

const MainLayout = () => {
  const location = useLocation();
  const cookieRole = Cookie.get("role");

  const isAdminPath = location.pathname.startsWith("/app/admin");
  let role: "teacher" | "admin" | "superAdmin" = "teacher";

  if (isAdminPath) {
    role = cookieRole === "superadmin" ? "superAdmin" : "admin";
  }

  return (
    <SidebarProvider>
      <NavbarLayout role={role} />

      <SidebarInset>
        <main className="flex flex-col grow bg-background min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-50 w-full bg-brand-secondary border-b border-border backdrop-blur-md shadow-sm">
            <div className="px-6 py-4 flex items-center gap-4">
              <SidebarTrigger className="cursor-pointer p-2 hover:bg-accent rounded-lg transition-colors duration-200 text-white hover:text-foreground" />
              <div className="flex-1 text-white">
                {role === "teacher"
                  ? "Teacher Panel"
                  : role === "admin"
                  ? "Admin Panel"
                  : "Super Admin Panel"}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="px-8 py-6">
              <div className="max-w-350 mx-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
