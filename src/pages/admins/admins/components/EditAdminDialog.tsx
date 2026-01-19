import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Pencil } from "lucide-react";
import type { Admin } from "@/types";
import { updateAdminSchema, type UpdateAdminFormData } from "@/schemas/admin";

interface EditAdminDialogProps {
  admin: Admin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: any) => void;
  isLoading: boolean;
}

export const EditAdminDialog = ({
  admin,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: EditAdminDialogProps) => {
  const form = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      role: "admin",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        username: admin.username,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
        newPassword: "",
      });
    }
  }, [admin, form]);

  const handleSubmit = (data: UpdateAdminFormData) => {
    if (admin) {
      const updateData: any = {
        username: data.username,
        phoneNumber: data.phoneNumber,
        role: data.role,
      };
      if (data.newPassword) {
        updateData.newPassword = data.newPassword;
      }
      onSubmit(admin.id, updateData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-brand-accent/30 shadow-xl">
        <DialogHeader className="pb-5 border-b border-brand-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary to-brand-primary-dark shadow-lg shadow-brand-primary/20">
              <Pencil className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-brand-secondary">
              Edit Admin
            </DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 pt-2"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin_user"
                      className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-brand-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+998901234567"
                      className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-brand-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">
                    New Password
                    <span className="text-brand-tertiary/60 text-xs ml-2">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-brand-error" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl font-medium shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
