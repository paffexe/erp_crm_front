import { ProfileLoadingSkeleton } from "@/components/loader/Loader";
import { useProfile } from "@/hooks/superAdmin/useProfil";
import type { ChangePasswordFormData } from "@/schemas/admin";
import type { UpdateProfileFormData } from "@/schemas/profile";
import { useState } from "react";
import { EditProfileDialog } from "./components/editProfDialog";
import { ChangePasswordProfileDialog } from "./components/changePasswordDialog";
import { ProfileInfoCard } from "./components/profInfoCard";
import { ProfileAdditionalInfoCard } from "./components/profAddInfoCard";

const Profile = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const { admin, isLoading, updateMutation, changePasswordMutation } =
    useProfile();

  const handleUpdateProfile = (data: UpdateProfileFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => setIsEditOpen(false),
    });
  };

  const handleChangePassword = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => setIsPasswordOpen(false),
    });
  };

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <EditProfileDialog
            admin={admin}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleUpdateProfile}
            isLoading={updateMutation.isPending}
          />
          <ChangePasswordProfileDialog
            open={isPasswordOpen}
            onOpenChange={setIsPasswordOpen}
            onSubmit={handleChangePassword}
            isLoading={changePasswordMutation.isPending}
          />
        </div>

        <div className="text-right self-end sm:self-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal information
          </p>
        </div>
      </div>

      {admin && (
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileInfoCard admin={admin} />
          <ProfileAdditionalInfoCard admin={admin} />
        </div>
      )}
    </div>
  );
};

export default Profile;
