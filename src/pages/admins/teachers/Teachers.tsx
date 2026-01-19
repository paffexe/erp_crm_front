import { useState } from "react";
import type { Teacher } from "@/types";
import { useTeachers } from "@/hooks/teacher/useTeacher";
import type { UpdateTeacherFormData } from "@/schemas/teacher";
import { TeachersTable } from "./TeachersTable";
import { ViewTeacherDialog } from "./ViewTeacherDialog";
import { EditTeacherDialog } from "./EditTeacherDialog";
import { DeleteTeacherDialog } from "./DeleteTeacherDialog";
import { PaginationControls } from "../admins/components/PaginationController";

const Teachers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  const { teachers, isLoading, updateMutation, deleteMutation, meta } =
    useTeachers({ page, limit });

  const handleUpdate = (id: string, data: UpdateTeacherFormData) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => setEditingTeacher(null),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeletingTeacher(null),
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* HEADER: Title Aligned to the Right */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-end gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Teachers
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your teaching staff
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <TeachersTable
          teachers={teachers}
          isLoading={isLoading}
          onView={setViewingTeacher}
          onEdit={setEditingTeacher}
          onDelete={setDeletingTeacher}
        />
      </div>

      <ViewTeacherDialog
        teacher={viewingTeacher}
        open={!!viewingTeacher}
        onOpenChange={(open) => !open && setViewingTeacher(null)}
      />

      <EditTeacherDialog
        teacher={editingTeacher}
        open={!!editingTeacher}
        onOpenChange={(open) => !open && setEditingTeacher(null)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <DeleteTeacherDialog
        teacher={deletingTeacher}
        open={!!deletingTeacher}
        onOpenChange={(open) => !open && setDeletingTeacher(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />

      <PaginationControls
        meta={meta}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};

export default Teachers;
