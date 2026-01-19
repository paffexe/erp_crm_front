import { useState, useRef } from "react";
import { Camera, Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadTeacherImage } from "./service/mutate/useUploadTeacherImg";

interface UploadTeacherImageProps {
  teacherId: string;
  currentImageUrl?: string;
  teacherName: string;
}

const UploadTeacherImage = ({
  teacherId,
  currentImageUrl,
  teacherName,
}: UploadTeacherImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutate: uploadImage, isPending } = useUploadTeacherImage(teacherId);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    uploadImage(formData, {
      onSuccess: (response: any) => {
        toast.success(response.message || "Image uploaded successfully!");
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        handleClose();
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to upload image"
        );
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  console.log(currentImageUrl);

  return (
    <>
      {/* Upload Button Overlay on Avatar */}
      <div className="relative group">
        <Avatar className="h-28 w-28 border-4 border-white shadow-xl shrink-0 ring-2 ring-brand-primary/20">
          <AvatarImage src={currentImageUrl} />
          <AvatarFallback className=" text-white text-2xl font-bold">
            {teacherName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Hover Overlay */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <Camera className="h-8 w-8 text-white" />
        </button>
      </div>

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-brand-accent border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-brand-secondary flex items-center gap-2">
                <Camera className="h-6 w-6" />
                Upload Profile Picture
              </h2>
              <button
                onClick={handleClose}
                disabled={isPending}
                className="text-brand-tertiary hover:text-brand-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-40 w-40 border-4 border-brand-primary/20">
                    <AvatarImage
                      src={preview || currentImageUrl || undefined}
                    />
                    <AvatarFallback className="bg-brand-primary text-white text-5xl font-bold">
                      {teacherName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {preview && (
                    <div className="absolute -top-2 -right-2 bg-brand-success rounded-full p-1">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* File Input (Hidden) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isPending}
              />

              {/* Upload Area */}
              <div
                onClick={handleButtonClick}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isPending
                    ? "border-border bg-muted cursor-not-allowed"
                    : "border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/5"
                }`}
              >
                <Upload
                  className="h-10 w-10 mx-auto mb-3"
                  style={{ color: "var(--brand-primary)" }}
                />
                <p className="text-sm font-medium text-foreground mb-1">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to select an image"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, or WebP (Max 5MB)
                </p>
              </div>

              {/* Info Message */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-primary/5 border border-brand-primary/20">
                <AlertCircle
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                />
                <p className="text-xs text-muted-foreground">
                  Your image will be automatically compressed and optimized for
                  best performance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11 rounded-lg"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isPending}
                  className="flex-1 h-11 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadTeacherImage;
