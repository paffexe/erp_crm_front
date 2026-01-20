import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Bookmark,
  Plus,
  Trash2,
  BookOpen,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateLesson } from "../service/mutate/useCreateLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";

const ALLOWED_DURATIONS_MINUTES = [30, 45, 60, 90, 120];

const lessonSchema = z.object({
  name: z.string().min(2, "Lesson name must be at least 2 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.number().min(1, "Duration is required"),
  price: z.string().transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0)
      throw new Error("Price must be a valid positive number");
    return num;
  }),
});

const templateSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters"),
  durationMinutes: z.number().min(1, "Duration is required"),
  price: z.string().transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0)
      throw new Error("Price must be a valid positive number");
    return num;
  }),
  description: z.string().optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;
type TemplateFormData = z.infer<typeof templateSchema>;

interface LessonTemplate {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  isActive: boolean;
}

const LessonCreationForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTemplate, setSelectedTemplate] =
    useState<LessonTemplate | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // TODO: Replace with actual API call using useGetQuery
  const [templates, setTemplates] = useState<LessonTemplate[]>([
    {
      id: "1",
      name: "English Grammar Basics",
      durationMinutes: 60,
      price: 50,
      description: "Introduction to English grammar and conversation",
      isActive: true,
    },
    {
      id: "2",
      name: "Advanced Conversation",
      durationMinutes: 90,
      price: 75,
      description: "Advanced speaking practice for fluent learners",
      isActive: true,
    },
    {
      id: "3",
      name: "IELTS Preparation",
      durationMinutes: 120,
      price: 100,
      description: "Comprehensive IELTS exam preparation",
      isActive: true,
    },
  ]);

  const { user, isAuthenticated } = useAuth();
  const { mutate, isPending } = useCreateLesson();

  const { data } = useGetQuery({
    pathname: "schedules",
    url: `lesson-template/${user?.id}/teacher`,
  });

  console.log(data);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema) as any,
  });

  const {
    register: registerTemplate,
    handleSubmit: handleSubmitTemplate,
    formState: { errors: templateErrors },
    reset: resetTemplate,
    control: controlTemplate,
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema) as any,
  });

  const selectedDate = watch("date");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    // Format date as YYYY-MM-DD without timezone conversion
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setValue("date", formatted);
    setShowDatePicker(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Select date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min of [0, 30]) {
        const h = hour.toString().padStart(2, "0");
        const m = min.toString().padStart(2, "0");
        slots.push(`${h}:${m}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const applyTemplate = (template: LessonTemplate) => {
    setValue("name", template.name);
    setValue("duration", template.durationMinutes);
    setValue("price", template.price as any);
    setSelectedTemplate(template);
  };

  const onSubmitTemplate = (data: TemplateFormData) => {
    // TODO: Call API to create template using mutation hook
    const newTemplate: LessonTemplate = {
      id: Date.now().toString(),
      name: data.name,
      durationMinutes: data.durationMinutes,
      price: data.price,
      description: data.description,
      isActive: true,
    };
    setTemplates([...templates, newTemplate]);
    resetTemplate();
    setSuccessMessage("Template created successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const confirmDeleteTemplate = (id: string) => {
    setTemplateToDelete(id);
    setShowDeleteDialog(true);
  };

  const deleteTemplate = () => {
    if (!templateToDelete) return;

    // TODO: Call API to delete template
    setTemplates(templates.filter((t) => t.id !== templateToDelete));
    if (selectedTemplate?.id === templateToDelete) {
      setSelectedTemplate(null);
    }
    setShowDeleteDialog(false);
    setTemplateToDelete(null);
    setSuccessMessage("Template deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const onSubmit = async (data: LessonFormData) => {
    if (!isAuthenticated || !user) {
      setErrorMessage("You must be logged in to create a lesson");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const startDateTime = new Date(`${data.date}T${data.time}`);
    const endDateTime = new Date(
      startDateTime.getTime() + data.duration * 60000,
    );

    const lessonData = {
      name: data.name,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      teacherId: user.id,
      price: data.price,
    };

    mutate(lessonData, {
      onSuccess: (response) => {
        setSuccessMessage(
          response.data.message || "Lesson created successfully!",
        );
        reset();
        setSelectedTemplate(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      onError: (error: any) => {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to create lesson",
        );
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-brand-warning/10 border border-brand-warning rounded-lg flex items-center gap-3 text-brand-warning">
              <AlertCircle size={20} />
              <span className="font-medium">
                Please log in to create a lesson
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Lesson</CardTitle>
              <CardDescription>
                Schedule a lesson for your students or create from a template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {successMessage && (
                <div className="mb-6 p-4 bg-brand-success/10 border border-brand-success rounded-lg flex items-center gap-3 text-brand-success">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-brand-error/10 border border-brand-error rounded-lg flex items-center gap-3 text-brand-error">
                  <AlertCircle size={20} />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="create">Create Lesson</TabsTrigger>
                  <TabsTrigger value="template">New Template</TabsTrigger>
                </TabsList>

                {/* Create Lesson Tab */}
                <TabsContent value="create" className="space-y-6">
                  {/* Selected Template Indicator */}
                  {selectedTemplate && (
                    <div className="p-3 bg-brand-primary/10 border border-brand-primary rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bookmark size={16} className="text-brand-primary" />
                        <span className="text-sm font-medium">
                          Using:{" "}
                          <span className="text-brand-primary">
                            {selectedTemplate.name}
                          </span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTemplate(null)}
                        className="h-7 text-xs"
                      >
                        Clear
                      </Button>
                    </div>
                  )}

                  {/* Lesson Name */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Lesson Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Advanced Mathematics"
                      {...register("name")}
                      className="mt-2"
                    />
                    {errors.name && (
                      <p className="text-brand-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Date Picker */}
                  <div>
                    <Label className="text-sm font-medium">Lesson Date</Label>
                    <div className="relative mt-2">
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`w-full h-10 px-3 border rounded-lg flex items-center justify-between bg-background ${
                          errors.date
                            ? "border-brand-error"
                            : "border-input hover:border-brand-primary"
                        }`}
                      >
                        <span
                          className={
                            selectedDate
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {formatDisplayDate(selectedDate)}
                        </span>
                        <Calendar size={18} className="text-muted-foreground" />
                      </button>

                      {showDatePicker && (
                        <div className="absolute z-50 mt-2 bg-card border rounded-lg shadow-lg p-4 w-full">
                          <div className="flex items-center justify-between mb-4">
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentMonth(new Date(year, month - 1))
                              }
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                            >
                              ←
                            </button>
                            <span className="font-semibold">
                              {currentMonth.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentMonth(new Date(year, month + 1))
                              }
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                            >
                              →
                            </button>
                          </div>

                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                              (day) => (
                                <div
                                  key={day}
                                  className="text-center text-xs font-semibold text-muted-foreground py-2"
                                >
                                  {day}
                                </div>
                              ),
                            )}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: startingDayOfWeek }).map(
                              (_, i) => (
                                <div key={`empty-${i}`} />
                              ),
                            )}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const disabled = isDateDisabled(day);
                              const isSelected =
                                selectedDate ===
                                new Date(year, month, day)
                                  .toISOString()
                                  .split("T")[0];

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => handleDateSelect(day)}
                                  disabled={disabled}
                                  className={`h-9 rounded-lg text-sm transition-all ${
                                    disabled
                                      ? "text-muted-foreground/30 cursor-not-allowed"
                                      : "hover:bg-accent cursor-pointer"
                                  } ${
                                    isSelected
                                      ? "bg-brand-primary text-white hover:bg-brand-primary"
                                      : ""
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.date && (
                      <p className="text-brand-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Time and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time" className="text-sm font-medium">
                        Start Time
                      </Label>
                      <select
                        id="time"
                        {...register("time")}
                        className="w-full h-10 px-3 border rounded-lg bg-background mt-2"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.time && (
                        <p className="text-brand-error text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.time.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="duration" className="text-sm font-medium">
                        Duration
                      </Label>
                      <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                          <select
                            value={field.value || ""}
                            id="duration"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="w-full h-10 px-3 border rounded-lg bg-background mt-2"
                          >
                            <option value="">Select duration</option>
                            {ALLOWED_DURATIONS_MINUTES.map((duration) => (
                              <option key={duration} value={duration}>
                                {duration} min
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.duration && (
                        <p className="text-brand-error text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.duration.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price (USD)
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register("price")}
                        className="pl-7"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-brand-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    onClick={handleSubmit(onSubmit)}
                    className="w-full bg-brand-primary hover:bg-brand-primary-dark"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create Lesson"
                    )}
                  </Button>
                </TabsContent>

                {/* Create Template Tab */}
                <TabsContent value="template" className="space-y-6">
                  <div>
                    <Label
                      htmlFor="template-name"
                      className="text-sm font-medium"
                    >
                      Template Name
                    </Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Morning English Lesson"
                      {...registerTemplate("name")}
                      className="mt-2"
                    />
                    {templateErrors.name && (
                      <p className="text-brand-error text-sm mt-1">
                        {templateErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="template-duration"
                        className="text-sm font-medium"
                      >
                        Duration
                      </Label>
                      <Controller
                        name="durationMinutes"
                        control={controlTemplate}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {ALLOWED_DURATIONS_MINUTES.map((dur) => (
                                <SelectItem key={dur} value={dur.toString()}>
                                  {dur} min
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="template-price"
                        className="text-sm font-medium"
                      >
                        Price (USD)
                      </Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="template-price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...registerTemplate("price")}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="template-description"
                      className="text-sm font-medium"
                    >
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="template-description"
                      placeholder="Brief description of this lesson type..."
                      {...registerTemplate("description")}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitTemplate(onSubmitTemplate)}
                    className="w-full bg-brand-primary hover:bg-brand-primary-dark"
                  >
                    <Plus size={18} className="mr-2" />
                    Create Template
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Templates Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bookmark size={20} className="text-brand-primary" />
                My Templates
              </CardTitle>
              <CardDescription>Click to apply a template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No templates yet</p>
                    <p className="text-xs mt-1">Create your first template</p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-3 transition-all cursor-pointer hover:shadow-md ${
                        selectedTemplate?.id === template.id
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border hover:border-brand-primary/50"
                      }`}
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {template.name}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteTemplate(template.id);
                          }}
                          className="p-1 hover:bg-brand-error/10 rounded text-brand-error transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {template.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock size={12} />
                          {template.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-brand-success">
                          <DollarSign size={12} />
                          {template.price}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteTemplate}
              className="bg-brand-error hover:bg-brand-error/90"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonCreationForm;
