import { useState } from "react";
import type { Student } from "@/types";
import { useStudents } from "@/hooks/student/useStudent";
import { StudentsTable } from "./components/StudentsTable";
import { ViewStudentDialog } from "./components/ViewStudentDialog";
import { BlockStudentDialog } from "./components/BlockStudentDialog";
import { DeleteStudentDialog } from "./components/DeleteStudentDialog";
import { PaginationControls } from "../admins/components/PaginationController";

const Students = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [blockingStudent, setBlockingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Removed 'search' parameter
  const {
    students,
    meta,
    isLoading,
    blockMutation,
    unblockMutation,
    deleteMutation,
  } = useStudents({ page, limit });

  const handleBlock = (id: string, reason: string) => {
    blockMutation.mutate(
      { id, reason },
      {
        onSuccess: () => setBlockingStudent(null),
      },
    );
  };

  const handleUnblock = (id: string) => {
    unblockMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeletingStudent(null),
    });
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* HEADER: Meta on Left, Title on Right */}
      <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-between gap-4">
        {/* Left Side: Total Count Badge */}
        <div>
          {meta && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-muted/20 text-sm text-muted-foreground">
              Total Students:
              <span className="font-bold text-foreground">{meta.total}</span>
            </div>
          )}
        </div>

        {/* Right Side: Title */}
        <div className="text-right">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Students
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all students and their information
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <StudentsTable
          students={students}
          isLoading={isLoading}
          onView={setViewingStudent}
          onBlock={setBlockingStudent}
          onUnblock={handleUnblock}
          onDelete={setDeletingStudent}
        />
      </div>

      {/* Pagination */}
      <PaginationControls
        meta={meta}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Dialogs */}
      <ViewStudentDialog
        student={viewingStudent}
        open={!!viewingStudent}
        onOpenChange={(open) => !open && setViewingStudent(null)}
      />

      <BlockStudentDialog
        student={blockingStudent}
        open={!!blockingStudent}
        onOpenChange={(open) => !open && setBlockingStudent(null)}
        onConfirm={handleBlock}
        isLoading={blockMutation.isPending}
      />

      <DeleteStudentDialog
        student={deletingStudent}
        open={!!deletingStudent}
        onOpenChange={(open) => !open && setDeletingStudent(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Students;
