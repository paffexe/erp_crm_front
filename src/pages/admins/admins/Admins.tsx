import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Key,
  Shield,
  UserCog,
  Phone,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Admin, AdminRole } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";

const adminSchema = z.object({
  username: z.string().min(3, "Username at least 3 characters"),
  password: z.string().min(4, "Password at least 4 characters"),
  phoneNumber: z.string().min(9, "Phone number is invalid"),
  role: z.enum(["admin", "superAdmin"]),
  isActive: z.boolean(),
});

const updateAdminSchema = z.object({
  username: z.string().min(3, "Username at least 3 characters"),
  phoneNumber: z.string().min(9, "Phone number is invalid"),
  role: z.enum(["admin", "superAdmin"]),
  newPassword: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(4, "Current password at least 4 characters"),
    newPassword: z.string().min(4, "New password at least 4 characters"),
    confirmPassword: z
      .string()
      .min(4, "Confirm password at least 4 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AdminFormData = z.infer<typeof adminSchema>;
type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const roleLabels: Record<AdminRole, string> = {
  admin: "Admin",
  superAdmin: "Super Admin",
};

const Admins = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<Admin | null>(null);
  const [changingPasswordAdmin, setChangingPasswordAdmin] =
    useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const queryClient = useQueryClient();

  const currentUser = JSON.parse(localStorage.getItem("admin") || "{}");
  const isSuperAdmin = currentUser?.role === "superAdmin";

  const { data, isLoading } = useQuery({
    queryKey: ["admins", search, page, limit],
    queryFn: () =>
      adminService.getAll({ search: search || undefined, page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: adminService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin created successfully");
      createForm.reset();
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Admin> }) =>
      adminService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin updated successfully");
      setEditingAdmin(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deleted successfully");
      setDeletingAdmin(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const activateMutation = useMutation({
    mutationFn: adminService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin activated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: adminService.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deactivated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordFormData }) =>
      adminService.changePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Password changed successfully");
      setChangingPasswordAdmin(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const admins = data?.data || [];
  const meta = data?.meta;

  const createForm = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      username: "",
      password: "",
      phoneNumber: "",
      role: "admin",
      isActive: true,
    },
  });

  const updateForm = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      role: "admin",
      newPassword: "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onCreateSubmit = (data: AdminFormData) => {
    createMutation.mutate(data);
  };

  const onUpdateSubmit = (data: UpdateAdminFormData) => {
    if (editingAdmin) {
      const updateData: any = {
        username: data.username,
        phoneNumber: data.phoneNumber,
        role: data.role,
      };
      if (data.newPassword) {
        updateData.newPassword = data.newPassword;
      }
      updateMutation.mutate({ id: editingAdmin.id, data: updateData });
    }
  };

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    if (changingPasswordAdmin) {
      changePasswordMutation.mutate({ id: changingPasswordAdmin.id, data });
    }
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    updateForm.reset({
      username: admin.username,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      newPassword: "",
    });
  };

  const openPasswordDialog = (admin: Admin) => {
    setChangingPasswordAdmin(admin);
    passwordForm.reset();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1); // Reset to first page when changing limit
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admins</h1>
          <p className="text-foreground/60 text-sm">Manage all admins</p>
        </div>
        {isSuperAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => createForm.reset()}
                className="shadow-sm"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <DialogTitle className="text-xl">Add New Admin</DialogTitle>
                </div>
              </DialogHeader>
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(onCreateSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={createForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="admin_user"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="••••••••"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+998901234567"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Role
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={createMutation.isPending}
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    {createMutation.isPending ? "Saving..." : "Add"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search Bar and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: "var(--brand-tertiary)" }}
          />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="pl-11 h-11 border-border focus:border-brand-primary"
          />
        </div>
        <div className="text-sm text-foreground/60">
          Overall admins:{" "}
          <span className="font-semibold text-foreground">
            {meta?.total || 0}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <span>Show</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className=" my-0.5" value="5">
                5
              </SelectItem>
              <SelectItem className=" my-0.5" value="10">
                10
              </SelectItem>
              <SelectItem className=" my-0.5" value="20">
                20
              </SelectItem>
              <SelectItem className=" my-0.5" value="50">
                50
              </SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm text-foreground/60">
                Page {meta.page} of {meta.totalPages}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!meta.hasPreviousPage}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!meta.hasNextPage}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/50 hover:bg-accent/50">
              <TableHead className="font-semibold">Username</TableHead>
              <TableHead className="font-semibold">Phone Number</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(limit)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <UserCog
                    className="h-12 w-12 mx-auto mb-3 opacity-30"
                    style={{ color: "var(--brand-tertiary)" }}
                  />
                  <p className="text-foreground/50">Admins not found</p>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="hover:bg-accent/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-1.5 rounded-lg"
                        style={{
                          backgroundColor:
                            admin.role === "superAdmin"
                              ? "rgba(35, 76, 106, 0.15)"
                              : "rgba(69, 104, 130, 0.15)",
                        }}
                      ></div>
                      {admin.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Phone className="h-3.5 w-3.5" />
                      {admin.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="font-medium"
                      style={{
                        backgroundColor:
                          admin.role === "superAdmin"
                            ? "var(--brand-primary)"
                            : "var(--brand-tertiary)",
                        color: "white",
                      }}
                    >
                      {roleLabels[admin.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="font-medium"
                      style={{
                        backgroundColor: admin.isActive
                          ? "rgba(125, 166, 125, 0.15)"
                          : "rgba(192, 90, 78, 0.15)",
                        color: admin.isActive
                          ? "var(--brand-success)"
                          : "var(--brand-error)",
                      }}
                    >
                      {admin.isActive ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(admin.createdAt).toLocaleDateString("uz-UZ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingAdmin(admin)}
                        title="See"
                        className="h-9 w-9 hover:bg-accent"
                      >
                        <Eye
                          className="h-4 w-4"
                          style={{ color: "var(--brand-tertiary)" }}
                        />
                      </Button>
                      {(isSuperAdmin || currentUser?.id === admin.id) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(admin)}
                            title="Tahrirlash"
                            className="h-9 w-9 hover:bg-accent"
                          >
                            <Pencil
                              className="h-4 w-4"
                              style={{ color: "var(--brand-primary)" }}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openPasswordDialog(admin)}
                            title="Parolni o'zgartirish"
                            className="h-9 w-9 hover:bg-accent"
                          >
                            <Key
                              className="h-4 w-4"
                              style={{ color: "var(--brand-warning)" }}
                            />
                          </Button>
                        </>
                      )}
                      {isSuperAdmin && currentUser?.id !== admin.id && (
                        <>
                          {admin.isActive ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deactivateMutation.mutate(admin.id)
                              }
                              title="Nofaollashtirish"
                              className="h-9 w-9 hover:bg-accent"
                            >
                              <XCircle
                                className="h-4 w-4"
                                style={{ color: "var(--brand-warning)" }}
                              />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => activateMutation.mutate(admin.id)}
                              title="Faollashtirish"
                              className="h-9 w-9 hover:bg-accent"
                            >
                              <CheckCircle2
                                className="h-4 w-4"
                                style={{ color: "var(--brand-success)" }}
                              />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingAdmin(admin)}
                            title="O'chirish"
                            className="h-9 w-9 hover:bg-accent"
                          >
                            <Trash2
                              className="h-4 w-4"
                              style={{ color: "var(--brand-error)" }}
                            />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingAdmin}
        onOpenChange={() => setDeletingAdmin(null)}
        title="Confirm Deletion"
        description={`Do you want to delete ${deletingAdmin?.username}? This action cannot be undone.`}
        onConfirm={() =>
          deletingAdmin && deleteMutation.mutate(deletingAdmin.id)
        }
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <Pencil className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl">Edit admin</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin_user"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+998901234567"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      New Password (optional)
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11"
                disabled={updateMutation.isPending}
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={!!changingPasswordAdmin}
        onOpenChange={() => setChangingPasswordAdmin(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-warning)" }}
              >
                <Key className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl">Change Password</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11"
                disabled={changePasswordMutation.isPending}
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {changePasswordMutation.isPending ? "Saving..." : "Change"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingAdmin} onOpenChange={() => setViewingAdmin(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-tertiary)" }}
              >
                <Eye className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl">Admin information</DialogTitle>
            </div>
          </DialogHeader>
          {viewingAdmin && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Username
                  </p>
                  <p className="font-semibold text-foreground">
                    {viewingAdmin.username}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Phone Number
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground">
                      {viewingAdmin.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">Role</p>
                  <Badge
                    className="font-medium"
                    style={{
                      backgroundColor:
                        viewingAdmin.role === "superAdmin"
                          ? "var(--brand-primary)"
                          : "var(--brand-tertiary)",
                      color: "white",
                    }}
                  >
                    {roleLabels[viewingAdmin.role]}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Status
                  </p>
                  <Badge
                    className="font-medium"
                    style={{
                      backgroundColor: viewingAdmin.isActive
                        ? "rgba(125, 166, 125, 0.15)"
                        : "rgba(192, 90, 78, 0.15)",
                      color: viewingAdmin.isActive
                        ? "var(--brand-success)"
                        : "var(--brand-error)",
                    }}
                  >
                    {viewingAdmin.isActive ? "active" : "inactive"}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Created
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground text-sm">
                      {new Date(viewingAdmin.createdAt).toLocaleString("uz-UZ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Updated
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground text-sm">
                      {new Date(viewingAdmin.updatedAt).toLocaleString("uz-UZ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admins;
