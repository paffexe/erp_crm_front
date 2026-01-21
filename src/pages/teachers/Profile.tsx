import { memo, useState } from "react";
import { useUpdateTeacherProfile } from "./service/mutate/useUpdateTeacher";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Cookie from "js-cookie";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  TeacherLevel,
  TeacherSpecialty,
  type LessonResponse,
  type TeacherField,
} from "./TeacherTypes";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";
import UpdatePasswordModal from "./passwordModal";
import UploadTeacherImage from "./uploadTeacherImg";
import { getImageUrl } from "@/utils/imageUrl";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, refetch } = useGetQuery({
    pathname: "profile",
    url: "auth/teacher/me",
  });

  console.log(data);
  Cookie.set("teacherName", data?.teacher.fullName || "");

  const teacherId = user?.id;
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateTeacherProfile(teacherId!);

  const teacher = data?.teacher;

  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    specification: "",
    level: "",
    experience: "",
    hourPrice: "",
    portfolioLink: "",
    description: "",
    fullName: "",
    cardNumber: "",
    email: "",
  });

  if (!isAuthenticated || !user) {
    return <div className="p-4">Please log in to view profile</div>;
  }

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  if (!teacher) {
    return <p className="text-center text-brand-error">Profile not found</p>;
  }

  const completedLessonsCount =
    teacher.lessons?.filter(
      (lesson: LessonResponse) => lesson.status === "completed",
    ).length ?? 0;

  const totalLessons = teacher.lessons?.length ?? 0;

  const handleEdit = () => {
    setForm({
      phoneNumber: teacher.phoneNumber ?? "",
      specification: teacher.specification ?? "",
      level: teacher.level ?? "",
      experience: teacher.experience ?? "",
      hourPrice: teacher.hourPrice?.toString() ?? "",
      portfolioLink: teacher.portfolioLink ?? "",
      description: teacher.description ?? "",
      fullName: teacher.fullName ?? "",
      cardNumber: teacher.cardNumber ?? "",
      email: teacher.email ?? "",
    });
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleSave = async () => {
    if (!teacherId) {
      toast.error("User not identified");
      return;
    }

    if (!form.experience || form.experience.trim() === "") {
      toast.error("Experience is required");
      return;
    }

    const expValue = parseFloat(form.experience);
    if (isNaN(expValue)) {
      toast.error(
        "Experience must start with a valid number (e.g., '2 years')",
      );
      return;
    }

    if (expValue < 0) {
      toast.error("Experience cannot be negative");
      return;
    }

    if (
      !form.cardNumber ||
      form.cardNumber.trim() === "" ||
      form.cardNumber.length < 16
    ) {
      toast.error("Card number is required and must be 16 digits");
      return;
    }

    const hasChanges =
      form.phoneNumber !== (teacher.phoneNumber ?? "") ||
      form.specification !== (teacher.specification ?? "") ||
      form.level !== (teacher.level ?? "") ||
      form.experience !== (teacher.experience ?? "") ||
      form.hourPrice !== (teacher.hourPrice?.toString() ?? "") ||
      form.portfolioLink !== (teacher.portfolioLink ?? "") ||
      form.description !== (teacher.description ?? "") ||
      form.fullName !== (teacher.fullName ?? "") ||
      form.cardNumber !== (teacher.cardNumber ?? "") ||
      form.email !== (teacher.email ?? "");

    if (!hasChanges) {
      toast.success("Profile updated successfully");
      setIsEdit(false);
      return;
    }

    const payload: TeacherField = {
      fullName: form.fullName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      specification: form.specification as TeacherSpecialty,
      level: form.level as TeacherLevel,
      experience: form.experience,
      hourPrice: form.hourPrice === "" ? null : Number(form.hourPrice),
      portfolioLink:
        form.portfolioLink.trim() === "" ? null : form.portfolioLink,
      description: form.description,
      cardNumber: form.cardNumber,
      imageUrl: teacher.imageUrl || null,
    };

    updateProfile(payload, {
      onSuccess: async () => {
        // Refetch the data to get fresh data from server
        await refetch();

        toast.success("Profile updated successfully");
        setIsEdit(false);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update profile",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-8">
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* Header Section with Brand Colors */}
        <div className="bg-brand-accent px-8 py-12 relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-tertiary rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <UploadTeacherImage
              teacherId={teacherId!}
              currentImageUrl={getImageUrl(teacher.imageUrl)}
              teacherName={teacher.fullName}
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-3xl sm:text-4xl font-bold text-brand-secondary mb-2">
                {teacher.fullName}
              </CardTitle>
              <p className="text-brand-tertiary text-sm sm:text-base font-medium">
                {teacher.email}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Badge
                variant={teacher.isActive ? "default" : "secondary"}
                className={`px-4 py-2 text-base font-semibold shadow-sm ${
                  teacher.isActive
                    ? "bg-brand-success hover:bg-brand-success text-white"
                    : "bg-muted hover:bg-muted text-muted-foreground"
                }`}
              >
                {teacher.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Show loading overlay when updating */}
          {isUpdating && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
                <p className="text-sm font-medium text-brand-primary">
                  Updating profile...
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid with Brand Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Completed Lessons
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-brand-primary">
                {completedLessonsCount}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Total Lessons
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-brand-tertiary">
                {totalLessons}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Hourly Rate
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-brand-success">
                {teacher.hourPrice !== null ? `$${teacher.hourPrice}` : "—"}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Experience
              </p>
              <p className="text-xl sm:text-2xl font-bold text-brand-secondary">
                {teacher.experience || "—"}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Phone Number
                </label>
                {isEdit ? (
                  <Input
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    className="h-11 rounded-lg border-border focus-visible:ring-brand-primary"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {teacher.phoneNumber || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Specification
                </label>
                {isEdit ? (
                  <Select
                    value={form.specification}
                    onValueChange={(value) =>
                      setForm({ ...form, specification: value })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-border focus:ring-brand-primary">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TeacherSpecialty).map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {capitalize(specialty)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">
                    {teacher.specification
                      ? capitalize(teacher.specification)
                      : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Level
                </label>
                {isEdit ? (
                  <Select
                    value={form.level}
                    onValueChange={(value) =>
                      setForm({ ...form, level: value })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-border focus:ring-brand-primary">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TeacherLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">
                    {teacher.level ? teacher.level.toUpperCase() : "Not set"}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Hourly Price
                </label>
                {isEdit ? (
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={form.hourPrice}
                      onChange={(e) =>
                        setForm({ ...form, hourPrice: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "." ||
                          e.key === "," ||
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="h-11 rounded-lg border-border focus-visible:ring-brand-primary pl-7"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {teacher.hourPrice !== null
                      ? `$${teacher.hourPrice}`
                      : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Portfolio
                </label>
                {isEdit ? (
                  <Input
                    type="url"
                    value={form.portfolioLink}
                    onChange={(e) =>
                      setForm({ ...form, portfolioLink: e.target.value })
                    }
                    placeholder="https://example.com/portfolio"
                    className="h-11 rounded-lg border-border focus-visible:ring-brand-primary"
                  />
                ) : teacher.portfolioLink ? (
                  <a
                    href={teacher.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-brand-primary-dark font-medium underline transition-colors"
                  >
                    View Portfolio →
                  </a>
                ) : (
                  <p className="text-muted-foreground">Not provided</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Teacher experience
                </label>
                {isEdit ? (
                  <Input
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className="h-11 rounded-lg border-border focus-visible:ring-brand-primary"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {teacher.experience || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Teacher Card
                </label>
                {isEdit ? (
                  <Input
                    value={form.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 17);

                      setForm({ ...form, cardNumber: value });
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={16}
                    className="h-11 rounded-lg border-border focus-visible:ring-brand-primary"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {teacher.cardNumber || "Not set"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {(isEdit || teacher.description) && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">
                Description
              </label>
              {isEdit ? (
                <Textarea
                  rows={5}
                  className="rounded-lg border-border resize-none focus-visible:ring-brand-primary"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Tell us about your teaching experience and style..."
                />
              ) : (
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {teacher.description || "No description provided"}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons with Brand Colors */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border">
            {/* Left side - Update Password */}
            <div className="w-full sm:w-auto">
              <UpdatePasswordModal teacherId={teacherId!} />
            </div>

            {/* Right side - Edit/Save/Cancel */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {isEdit ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="h-11 rounded-lg border-brand-tertiary text-brand-tertiary hover:bg-brand-tertiary/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="h-11 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold shadow-sm transition-all duration-200"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="h-11 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold shadow-sm transition-all duration-200"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(Profile);
