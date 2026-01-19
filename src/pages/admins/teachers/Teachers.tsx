import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher.service";
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
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { Search, Pencil, Trash2, Eye } from "lucide-react";
import type { Teacher, TeacherSpecialty, TeacherLevel } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";

const updateTeacherSchema = z.object({
  email: z.string().email("Email noto'g'ri").optional(),
  phoneNumber: z.string().max(20).optional(),
  fullName: z.string().max(255).optional(),
  cardNumber: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  specification: z
    .enum(["english", "french", "spanish", "italian", "german"])
    .optional(),
  level: z.enum(["b2", "c1", "c2"]).optional(),
  description: z.string().max(1000).optional(),
  hourPrice: z.coerce.number().min(0).optional(),
  portfolioLink: z.string().optional(),
  experience: z.string().max(50).optional(),
});

type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>;

const specialtyLabels: Record<TeacherSpecialty, string> = {
  english: "english",
  french: "french",
  spanish: "spanish",
  italian: "italian",
  german: "german",
};

const levelLabels: Record<TeacherLevel, string> = {
  b2: "B2",
  c1: "C1",
  c2: "C2",
};

const Teachers = () => {
  const [search, setSearch] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherService.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherFormData }) =>
      teacherService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated successfully");
      setEditingTeacher(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teacherService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher deleted successfully");
      setDeletingTeacher(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const teachers = data?.teachers || [];
  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phoneNumber.includes(search)
  );

  const updateForm = useForm<UpdateTeacherFormData>({
    resolver: zodResolver(updateTeacherSchema) as any,
  });

  const onUpdateSubmit = (data: UpdateTeacherFormData) => {
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data });
    }
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    updateForm.reset({
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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            Teachers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all teachers
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-lg focus-visible:ring-brand-primary"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-brand-secondary">
                Full Name
              </TableHead>
              <TableHead className="font-semibold text-brand-secondary">
                Email
              </TableHead>
              <TableHead className="font-semibold text-brand-secondary">
                Phone number
              </TableHead>
              <TableHead className="font-semibold text-brand-secondary">
                Specialty
              </TableHead>
              <TableHead className="font-semibold text-brand-secondary">
                Level
              </TableHead>
              <TableHead className="font-semibold text-brand-secondary">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-brand-secondary">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-muted-foreground">
                    <p className="font-medium">Teachers page</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {teacher.fullName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {teacher.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {teacher.phoneNumber}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {specialtyLabels[teacher.specification].toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-brand-tertiary text-brand-tertiary"
                    >
                      {levelLabels[teacher.level]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={teacher.isActive ? "default" : "destructive"}
                      className={
                        teacher.isActive
                          ? "bg-brand-success hover:bg-brand-success text-white"
                          : "bg-brand-error hover:bg-brand-error text-white"
                      }
                    >
                      {teacher.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingTeacher(teacher)}
                        className="hover:bg-brand-primary/10 hover:text-brand-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(teacher)}
                        className="hover:bg-brand-tertiary/10 hover:text-brand-tertiary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingTeacher(teacher)}
                        className="hover:bg-brand-error/10 hover:text-brand-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingTeacher}
        onOpenChange={() => setDeletingTeacher(null)}
        title="Confirm Deletion"
        description={` Are you sure you want to delete ${deletingTeacher?.fullName}?`}
        onConfirm={() =>
          deletingTeacher && deleteMutation.mutate(deletingTeacher.id)
        }
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Edit Dialog */}
      <Dialog
        open={!!editingTeacher}
        onOpenChange={() => setEditingTeacher(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-secondary">
              Edit Teacher
            </DialogTitle>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full name"
                          {...field}
                          className="h-11 rounded-lg focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                          className="h-11 rounded-lg focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+998901234567"
                          {...field}
                          className="h-11 rounded-lg focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="8600123456789012"
                          {...field}
                          className="h-11 rounded-lg focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="specification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-lg focus:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(specialtyLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-lg focus:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(levelLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="hourPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly rate (UZS)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50000"
                          {...field}
                          className="h-11 rounded-lg focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="5 years"
                          {...field}
                          className="h-11 rounded-lg focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="About teacher..."
                        {...field}
                        className="rounded-lg focus-visible:ring-brand-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 bg-brand-primary hover:bg-brand-primary-dark text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={!!viewingTeacher}
        onOpenChange={() => setViewingTeacher(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-secondary">
              Teacher Information
            </DialogTitle>
          </DialogHeader>
          {viewingTeacher && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Name
                </p>
                <p className="font-semibold text-foreground">
                  {viewingTeacher.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Email
                </p>
                <p className="font-semibold text-foreground">
                  {viewingTeacher.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Phone number
                </p>
                <p className="font-semibold text-foreground">
                  {viewingTeacher.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Card number
                </p>
                <p className="font-semibold text-foreground">
                  {viewingTeacher.cardNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Specialty
                </p>
                <p className="font-semibold text-foreground">
                  {specialtyLabels[viewingTeacher.specification]}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Level
                </p>
                <p className="font-semibold text-foreground">
                  {levelLabels[viewingTeacher.level]}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Hourly rate
                </p>
                <p className="font-semibold text-brand-success">
                  {viewingTeacher.hourPrice?.toLocaleString() || 0} UZS
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Rating
                </p>
                <p className="font-semibold text-brand-warning">
                  {viewingTeacher.rating || 0} / 5
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Experience
                </p>
                <p className="font-semibold text-foreground">
                  {viewingTeacher.experience || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </p>
                <Badge
                  variant={viewingTeacher.isActive ? "default" : "destructive"}
                  className={
                    viewingTeacher.isActive
                      ? "bg-brand-success hover:bg-brand-success text-white"
                      : "bg-brand-error hover:bg-brand-error text-white"
                  }
                >
                  {viewingTeacher.isActive ? "Faol" : "Nofaol"}
                </Badge>
              </div>
              {viewingTeacher.description && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="font-medium text-foreground leading-relaxed">
                    {viewingTeacher.description}
                  </p>
                </div>
              )}
              {viewingTeacher.portfolioLink && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Portfolio
                  </p>
                  <a
                    href={viewingTeacher.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-primary hover:text-brand-primary-dark underline transition-colors"
                  >
                    {viewingTeacher.portfolioLink}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
