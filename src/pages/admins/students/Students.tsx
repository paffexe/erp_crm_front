import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
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
import {
  Search,
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  Users,
  Phone,
  Calendar,
  MessageSquare,
  Hash,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Student } from "@/types";
import { Textarea } from "@/components/ui/textarea";

const Students = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [blockingStudent, setBlockingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["students", page, search],
    queryFn: () => studentService.getAll({ page, limit: 10, search }),
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      studentService.block(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student blocked successfully");
      setBlockingStudent(null);
      setBlockReason("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const unblockMutation = useMutation({
    mutationFn: studentService.unblock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student unblocked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully");
      setDeletingStudent(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const students = data?.students || [];
  const meta = data?.meta;

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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/50 hover:bg-accent/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Telegram</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Registered</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Users
                    className="h-12 w-12 mx-auto mb-3 opacity-30"
                    style={{ color: "var(--brand-tertiary)" }}
                  />
                  <p className="text-foreground/50">No students found</p>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-accent/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: student.isBlocked
                            ? "rgba(192, 90, 78, 0.15)"
                            : student.isActive
                            ? "rgba(125, 166, 125, 0.15)"
                            : "rgba(69, 104, 130, 0.15)",
                        }}
                      >
                        <Users
                          className="h-5 w-5"
                          style={{
                            color: student.isBlocked
                              ? "var(--brand-error)"
                              : student.isActive
                              ? "var(--brand-success)"
                              : "var(--brand-tertiary)",
                          }}
                        />
                      </div>
                      <span>
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Phone className="h-3.5 w-3.5" />
                      {student.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {student.tgUsername ? `@${student.tgUsername}` : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.isBlocked ? (
                      <Badge
                        className="font-medium"
                        style={{
                          backgroundColor: "rgba(192, 90, 78, 0.15)",
                          color: "var(--brand-error)",
                        }}
                      >
                        Blocked
                      </Badge>
                    ) : student.isActive ? (
                      <Badge
                        className="font-medium"
                        style={{
                          backgroundColor: "rgba(125, 166, 125, 0.15)",
                          color: "var(--brand-success)",
                        }}
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        className="font-medium"
                        style={{
                          backgroundColor: "rgba(69, 104, 130, 0.15)",
                          color: "var(--brand-tertiary)",
                        }}
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(student.createdAt).toLocaleDateString("en-US")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingStudent(student)}
                        className="h-9 w-9 hover:bg-accent"
                        title="View Details"
                      >
                        <Eye
                          className="h-4 w-4"
                          style={{ color: "var(--brand-tertiary)" }}
                        />
                      </Button>
                      {student.isBlocked ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => unblockMutation.mutate(student.id)}
                          className="h-9 w-9 hover:bg-accent"
                          title="Unblock Student"
                        >
                          <CheckCircle2
                            className="h-4 w-4"
                            style={{ color: "var(--brand-success)" }}
                          />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setBlockingStudent(student)}
                          className="h-9 w-9 hover:bg-accent"
                          title="Block Student"
                        >
                          <Ban
                            className="h-4 w-4"
                            style={{ color: "var(--brand-warning)" }}
                          />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingStudent(student)}
                        className="h-9 w-9 hover:bg-accent"
                        title="Delete Student"
                      >
                        <Trash2
                          className="h-4 w-4"
                          style={{ color: "var(--brand-error)" }}
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-foreground/60">
            Page {page} of {meta.totalPage} • Total: {meta.total} students
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div
              className="flex items-center justify-center min-w-15 px-4 text-sm font-medium rounded-lg border"
              style={{
                backgroundColor: "var(--brand-accent)",
                borderColor: "var(--brand-tertiary)",
                color: "var(--brand-primary)",
              }}
            >
              {page} / {meta.totalPage}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage}
              className="h-9"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingStudent}
        onOpenChange={() => setDeletingStudent(null)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${deletingStudent?.firstName} ${deletingStudent?.lastName}?`}
        onConfirm={() =>
          deletingStudent && deleteMutation.mutate(deletingStudent.id)
        }
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* View Dialog */}
      <Dialog
        open={!!viewingStudent}
        onOpenChange={() => setViewingStudent(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <Eye className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl">Student Information</DialogTitle>
            </div>
          </DialogHeader>
          {viewingStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    First Name
                  </p>
                  <p className="font-semibold text-foreground">
                    {viewingStudent.firstName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Last Name
                  </p>
                  <p className="font-semibold text-foreground">
                    {viewingStudent.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Phone Number
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground">
                      {viewingStudent.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Telegram Username
                  </p>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground">
                      {viewingStudent.tgUsername
                        ? `@${viewingStudent.tgUsername}`
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Telegram ID
                  </p>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground">
                      {viewingStudent.tgId}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Status
                  </p>
                  {viewingStudent.isBlocked ? (
                    <Badge
                      className="font-medium"
                      style={{
                        backgroundColor: "rgba(192, 90, 78, 0.15)",
                        color: "var(--brand-error)",
                      }}
                    >
                      Blocked
                    </Badge>
                  ) : viewingStudent.isActive ? (
                    <Badge
                      className="font-medium"
                      style={{
                        backgroundColor: "rgba(125, 166, 125, 0.15)",
                        color: "var(--brand-success)",
                      }}
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      className="font-medium"
                      style={{
                        backgroundColor: "rgba(69, 104, 130, 0.15)",
                        color: "var(--brand-tertiary)",
                      }}
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/50 font-medium">
                    Registration Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-foreground/50" />
                    <p className="font-semibold text-foreground text-sm">
                      {new Date(viewingStudent.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {viewingStudent.isBlocked && viewingStudent.blockedReason && (
                <div
                  className="p-4 rounded-lg border-l-4 mt-4"
                  style={{
                    backgroundColor: "rgba(192, 90, 78, 0.1)",
                    borderLeftColor: "var(--brand-error)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert
                      className="h-5 w-5 mt-0.5"
                      style={{ color: "var(--brand-error)" }}
                    />
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--brand-error)" }}
                      >
                        Block Reason
                      </p>
                      <p className="text-sm text-foreground/80">
                        {viewingStudent.blockedReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Dialog */}
      <Dialog
        open={!!blockingStudent}
        onOpenChange={() => setBlockingStudent(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "var(--brand-warning)" }}
              >
                <Ban className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl">Block Student</DialogTitle>
            </div>
          </DialogHeader>
          {blockingStudent && (
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "var(--brand-accent)" }}
              >
                <p className="text-sm">
                  You are about to block{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {blockingStudent.firstName} {blockingStudent.lastName}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Block Reason{" "}
                  <span style={{ color: "var(--brand-error)" }}>*</span>
                </label>
                <Textarea
                  placeholder="Enter the reason for blocking this student..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="min-h-25 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBlockingStudent(null);
                    setBlockReason("");
                  }}
                  className="h-10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    blockMutation.mutate({
                      id: blockingStudent.id,
                      reason: blockReason,
                    })
                  }
                  disabled={!blockReason.trim() || blockMutation.isPending}
                  className="h-10"
                  style={{ backgroundColor: "var(--brand-warning)" }}
                >
                  {blockMutation.isPending ? "Blocking..." : "Block Student"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
