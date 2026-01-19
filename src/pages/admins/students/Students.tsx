import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Student } from "@/types";
import { useStudents } from "@/hooks/student/useStudent";
import { StudentsTable } from "./components/StudentsTable";
import { StudentsPagination } from "./components/StudentsPagination";
import { ViewStudentDialog } from "./components/ViewStudentDialog";
import { BlockStudentDialog } from "./components/BlockStudentDialog";
import { DeleteStudentDialog } from "./components/DeleteStudentDialog";

const Students = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [blockingStudent, setBlockingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const {
    students,
    meta,
    isLoading,
    blockMutation,
    unblockMutation,
    deleteMutation,
  } = useStudents({ page, search });

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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // console.log(students)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Students</h1>
          <p className="text-foreground/60 text-sm">
            Manage all students and their information
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: "var(--brand-tertiary)" }}
          />
          <Input
            placeholder="Search by name, phone or telegram..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-11 h-11 border-border focus:border-brand-primary"
          />
        </div>
        {meta && (
          <div className="text-sm text-foreground/60">
            Total:{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>{" "}
            students
          </div>
        )}
      </div>

      {/* Table */}
      <StudentsTable
        students={students}
        isLoading={isLoading}
        onView={setViewingStudent}
        onBlock={setBlockingStudent}
        onUnblock={handleUnblock}
        onDelete={setDeletingStudent}
      />

      {/* Pagination */}
      <StudentsPagination
        meta={meta}
        currentPage={page}
        onPageChange={setPage}
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
