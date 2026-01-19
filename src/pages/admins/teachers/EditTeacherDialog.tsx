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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Teacher } from "@/types";

import {
  updateTeacherSchema,
  type UpdateTeacherFormData,
} from "@/schemas/teacher";
import { levelLabels, specialtyLabels } from "@/config/constants";

interface EditTeacherDialogProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: UpdateTeacherFormData) => void;
  isLoading: boolean;
}

export const EditTeacherDialog = ({
  teacher,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: EditTeacherDialogProps) => {
  const form = useForm<UpdateTeacherFormData>({
    resolver: zodResolver(updateTeacherSchema) as any,
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        fullName: teacher.fullName,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        cardNumber: teacher.cardNumber,
        specification: teacher.specification,
        level: teacher.level,
        hourPrice: teacher.hourPrice || 0,
        description: teacher.description || "",
        experience: teacher.experience || "",
        isActive: teacher.isActive,
      });
    }
  }, [teacher, form]);

  const handleSubmit = (data: UpdateTeacherFormData) => {
    if (teacher) {
      onSubmit(teacher.id, data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-brand-accent/30 shadow-xl">
        <DialogHeader className="pb-6 border-b border-brand-accent/20">
          <DialogTitle className="text-2xl font-semibold text-brand-secondary">
            Edit Teacher
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full name"
                        {...field}
                        className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Phone number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+998901234567"
                        {...field}
                        className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Card number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="8600123456789012"
                        {...field}
                        className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="specification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Specialty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus:ring-brand-primary/20 focus:ring-2 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-brand-accent/30">
                        {Object.entries(specialtyLabels).map(([key, label]) => (
                          <SelectItem 
                            key={key} 
                            value={key}
                            className="rounded-lg focus:bg-brand-primary/10 focus:text-brand-primary"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus:ring-brand-primary/20 focus:ring-2 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-brand-accent/30">
                        {Object.entries(levelLabels).map(([key, label]) => (
                          <SelectItem 
                            key={key} 
                            value={key}
                            className="rounded-lg focus:bg-brand-primary/10 focus:text-brand-primary"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="hourPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Hourly rate (UZS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-brand-tertiary font-medium">Experience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5 years"
                        {...field}
                        className="h-12 rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-brand-error" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-tertiary font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="About teacher..."
                      {...field}
                      className="min-h-[100px] rounded-xl border-brand-accent/40 bg-slate-50/50 focus:bg-white focus:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-2 transition-all resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-brand-error" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-xl font-medium shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
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