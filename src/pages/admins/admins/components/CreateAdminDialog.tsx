import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Shield,
  Plus,
  User,
  Phone,
  BadgeCheck,
  Lock,
  Loader2,
} from "lucide-react";
import { adminSchema, type AdminFormData } from "@/schemas/admin";
import { cn } from "@/lib/utils";

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdminFormData) => void;
  isLoading: boolean;
}

export const CreateAdminDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateAdminDialogProps) => {
  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      username: "",
      password: "",
      phoneNumber: "",
      role: "admin",
      isActive: true,
    },
  });

  const handleSubmit = (data: AdminFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 p-0 gap-0 overflow-hidden border-border/40 shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-6 bg-muted/30 border-b border-border/50">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-brand-primary/10 p-3 ring-1 ring-brand-primary/20">
              <Shield className="h-6 w-6 text-brand-primary" />
            </div>
            <div className="space-y-1 mt-0.5">
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                Create Administrator
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Enter the details below to provision a new system access level.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-6 space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <User className="h-3.5 w-3.5" /> Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. johndoe_admin"
                        className="h-10 bg-background focus-visible:ring-brand-primary/30"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <Lock className="h-3.5 w-3.5" /> Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••••••"
                        className="h-10 bg-background focus-visible:ring-brand-primary/30"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        <Phone className="h-3.5 w-3.5" /> Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+998..."
                          className="h-10 bg-background focus-visible:ring-brand-primary/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        <BadgeCheck className="h-3.5 w-3.5" /> Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 bg-background focus:ring-brand-primary/30">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/10 border-t border-border/50 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full sm:w-auto min-w-35 font-medium transition-all",
                  "bg-brand-primary hover:bg-brand-primary-dark text-white",
                  "shadow-sm hover:shadow-md active:scale-[0.98]",
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
