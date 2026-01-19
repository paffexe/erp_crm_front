import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Pencil } from "lucide-react";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/schemas/profile";

interface EditProfileDialogProps {
  admin: {
    username: string;
    phoneNumber: string;
  } | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateProfileFormData) => void;
  isLoading: boolean;
}

export const EditProfileDialog = ({
  admin,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: EditProfileDialogProps) => {
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        username: admin.username,
        phoneNumber: admin.phoneNumber,
      });
    }
  }, [admin, form]);

  const handleSubmit = (data: UpdateProfileFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
            variant="outline" 
            className="border-border hover:bg-accent hover:text-accent-foreground"
        >
          <Pencil className="mr-2 h-4 w-4 text-brand-primary" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="admin_user" 
                        className="bg-muted/30"
                        {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="+998901234567" 
                        className="bg-muted/30"
                        {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white" 
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