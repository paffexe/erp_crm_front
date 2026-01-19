import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  X,
  Edit,
} from "lucide-react";
import { useUpdateLesson } from "../../service/mutate/useUpdateLessons";
import type { LessonFieldEdit } from "../../TeacherTypes";

const ALLOWED_DURATIONS_MINUTES = [30, 45, 60, 90, 120];

// Available status options
const STATUS_OPTIONS = [
  "available",
  "booked",
  "completed",
  "cancelled",
] as const;

const lessonSchema = z.object({
  name: z.string().min(2, "Lesson name must be at least 2 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.number().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be a positive number"),
  status: z.string().optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface EditLessonModalProps {
  lesson: LessonFieldEdit;
  onSuccess: () => void;
}

const EditLessonModal = ({ lesson, onSuccess }: EditLessonModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { mutate, isPending } = useUpdateLesson(lesson.id);

  // Calculate initial duration
  const getInitialDuration = () => {
    if (!lesson.startTime || !lesson.endTime) return 0;
    const start = new Date(lesson.startTime);
    const end = new Date(lesson.endTime);
    return Math.round((end.getTime() - start.getTime()) / 60000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema) as any,
    defaultValues: {
      name: lesson.name,
      date: lesson.startTime
        ? new Date(lesson.startTime).toISOString().split("T")[0]
        : "",
      time: lesson.startTime
        ? new Date(lesson.startTime).toTimeString().slice(0, 5)
        : "",
      duration: getInitialDuration(),
      price: lesson.price,
      status: lesson.status,
    },
  });

  const selectedDate = watch("date");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const startDate = lesson.startTime
        ? new Date(lesson.startTime)
        : new Date();
      reset({
        name: lesson.name,
        date: startDate.toISOString().split("T")[0],
        time: startDate.toTimeString().slice(0, 5),
        duration: getInitialDuration(),
        price: lesson.price,
        status: lesson.status,
      });
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen, lesson, reset]);

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
    const date = new Date(year, month, day);
    const formatted = date.toISOString().split("T")[0];
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

  const onSubmit = async (data: LessonFormData) => {
    setErrorMessage("");
    setSuccessMessage("");

    const startDateTime = new Date(`${data.date}T${data.time}`);
    const endDateTime = new Date(
      startDateTime.getTime() + data.duration * 60000
    );

    const lessonData = {
      name: data.name,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      price: data.price,
      status: data.status,
    };

    mutate(lessonData, {
      onSuccess: (response: any) => {
        setSuccessMessage(
          response.data.message || "Lesson updated successfully!"
        );
        setTimeout(() => {
          setIsOpen(false);
          onSuccess();
        }, 1500);
      },
      onError: (error: any) => {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to update lesson"
        );
      },
    });
  };

  // Don't show edit button for completed lessons
  if (lesson.status?.toLowerCase() === "completed") {
    return null;
  }

  return (
    <>
      {/* Edit Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="w-full mt-4 border-brand-primary/30 hover:bg-brand-primary/10 hover:border-brand-primary transition-colors"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Lesson
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Edit Lesson
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-brand-success/10 border border-brand-success/30">
                  <CheckCircle2
                    className="h-5 w-5 shrink-0"
                    style={{ color: "var(--brand-success)" }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--brand-success)" }}
                  >
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-brand-error/10 border border-brand-error/30">
                  <AlertCircle
                    className="h-5 w-5 shrink-0"
                    style={{ color: "var(--brand-error)" }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--brand-error)" }}
                  >
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Lesson Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Lesson Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Introduction to JavaScript"
                  className="bg-background border-border focus:border-brand-primary"
                />
                {errors.name && (
                  <p className="text-sm text-brand-error">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground font-medium">
                  Date
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full px-4 py-2 text-left bg-background border border-border rounded-lg hover:border-brand-primary transition-colors flex items-center justify-between"
                  >
                    <span className="text-foreground">
                      {formatDisplayDate(selectedDate)}
                    </span>
                    <Calendar className="h-4 w-4 text-foreground/60" />
                  </button>

                  {showDatePicker && (
                    <div className="absolute z-10 mt-2 bg-card border border-border rounded-lg shadow-xl p-4 w-full">
                      {/* Month Navigation */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentMonth(new Date(year, month - 1, 1))
                          }
                          className="p-1 hover:bg-brand-primary/10 rounded"
                        >
                          ←
                        </button>
                        <span className="font-semibold text-foreground">
                          {currentMonth.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentMonth(new Date(year, month + 1, 1))
                          }
                          className="p-1 hover:bg-brand-primary/10 rounded"
                        >
                          →
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                          (day) => (
                            <div
                              key={day}
                              className="text-center text-xs font-medium text-foreground/60 py-2"
                            >
                              {day}
                            </div>
                          )
                        )}
                        {Array.from({ length: startingDayOfWeek }).map(
                          (_, i) => (
                            <div key={`empty-${i}`} />
                          )
                        )}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const isDisabled = isDateDisabled(day);
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
                              disabled={isDisabled}
                              className={`p-2 text-sm rounded transition-colors ${
                                isDisabled
                                  ? "text-foreground/30 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-brand-primary text-white"
                                  : "hover:bg-brand-primary/10 text-foreground"
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
                  <p className="text-sm text-brand-error">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Time and Duration */}
              <div className="grid grid-cols-2 gap-4">
                {/* Time Picker */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-foreground font-medium">
                    Time
                  </Label>
                  <div className="relative">
                    <select
                      id="time"
                      {...register("time")}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-brand-primary focus:outline-none appearance-none text-foreground"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60 pointer-events-none" />
                  </div>
                  {errors.time && (
                    <p className="text-sm text-brand-error">
                      {errors.time.message}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-foreground font-medium"
                  >
                    Duration (minutes)
                  </Label>
                  <select
                    id="duration"
                    {...register("duration", { valueAsNumber: true })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-brand-primary focus:outline-none text-foreground"
                  >
                    {ALLOWED_DURATIONS_MINUTES.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration} min
                      </option>
                    ))}
                  </select>
                  {errors.duration && (
                    <p className="text-sm text-brand-error">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground font-medium">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="bg-background border-border focus:border-brand-primary"
                />
                {errors.price && (
                  <p className="text-sm text-brand-error">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground font-medium">
                  Status
                </Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-brand-primary focus:outline-none text-foreground capitalize"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditLessonModal;
