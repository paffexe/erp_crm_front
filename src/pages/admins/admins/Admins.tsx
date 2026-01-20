import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Admin } from "@/types";
import { useAdmins } from "@/hooks/admin/useAdmin";
import type { AdminFormData, ChangePasswordFormData } from "@/schemas/admin";
import { CreateAdminDialog } from "./components/CreateAdminDialog";
import { PaginationControls } from "./components/PaginationController";
import { AdminsTable } from "./components/AdminsTable";
import { ViewAdminDialog } from "./components/ViewAdminDialog";
import { EditAdminDialog } from "./components/EditAdminDialog";
import { ChangePasswordDialog } from "./components/ChangePassword";
import { DeleteAdminDialog } from "./components/DeleteAdminDto";

const Admins = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<Admin | null>(null);
  const [changingPasswordAdmin, setChangingPasswordAdmin] =
    useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("admin") || "{}");
  const isSuperAdmin = currentUser?.role === "superAdmin";

  const {
    admins,
    meta,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation,
    changePasswordMutation,
  } = useAdmins({ search, page, limit });

  const handleCreate = (data: AdminFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (id: string, data: any) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => setEditingAdmin(null),
      },
    );
  };

  const handleChangePassword = (id: string, data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(
      { id, data },
      {
        onSuccess: () => setChangingPasswordAdmin(null),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeletingAdmin(null),
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search admins..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-background border-border shadow-sm focus-visible:ring-brand-primary/20 transition-all hover:border-brand-primary/30"
            />
          </div>

          {isSuperAdmin && (
            <CreateAdminDialog
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
            />
          )}
        </div>

        <div className="text-right self-end sm:self-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admins
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage system administrators
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <AdminsTable
          admins={admins}
          isLoading={isLoading}
          limit={limit}
          currentUserId={currentUser?.id || ""}
          isSuperAdmin={isSuperAdmin}
          onView={setViewingAdmin}
          onEdit={setEditingAdmin}
          onChangePassword={setChangingPasswordAdmin}
          onDelete={setDeletingAdmin}
          onActivate={(id) => activateMutation.mutate(id)}
          onDeactivate={(id) => deactivateMutation.mutate(id)}
        />
      </div>

      <PaginationControls
        meta={meta}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <ViewAdminDialog
        admin={viewingAdmin}
        open={!!viewingAdmin}
        onOpenChange={(open) => !open && setViewingAdmin(null)}
      />

      <EditAdminDialog
        admin={editingAdmin}
        open={!!editingAdmin}
        onOpenChange={(open) => !open && setEditingAdmin(null)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <ChangePasswordDialog
        admin={changingPasswordAdmin}
        open={!!changingPasswordAdmin}
        onOpenChange={(open) => !open && setChangingPasswordAdmin(null)}
        onSubmit={handleChangePassword}
        isLoading={changePasswordMutation.isPending}
      />

      <DeleteAdminDialog
        admin={deletingAdmin}
        open={!!deletingAdmin}
        onOpenChange={(open) => !open && setDeletingAdmin(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Admins;
