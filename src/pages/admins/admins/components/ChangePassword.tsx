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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Key } from "lucide-react";
import type { Admin } from "@/types";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/admin";

interface ChangePasswordDialogProps {
  admin: Admin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: ChangePasswordFormData) => void;
  isLoading: boolean;
}

export const ChangePasswordDialog = ({
  admin,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ChangePasswordDialogProps) => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset();
    }
  }, [admin, form]);

  const handleSubmit = (data: ChangePasswordFormData) => {
    if (admin) {
      onSubmit(admin.id, data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-brand-accent/30 shadow-xl">
        <DialogHeader className="pb-5 border-b border-brand-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent from-brand-warning to-brand-warning-dark shadow-lg shadow-brand-warning/20">
              <Key className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-brand-secondary">
              Change Password
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
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">
                    Current Password
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
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">
                    New Password
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">
                    Confirm Password
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
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
