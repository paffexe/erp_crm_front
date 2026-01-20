import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { StudentTableRow } from "./StudentTableRow";
import type { Student } from "@/types";

interface StudentsTableProps {
  students: Student[];
  isLoading: boolean;
  onView: (student: Student) => void;
  onBlock: (student: Student) => void;
  onUnblock: (id: string) => void;
  onDelete: (student: Student) => void;
}

export const StudentsTable = ({
  students,
  isLoading,
  onView,
  onBlock,
  onUnblock,
  onDelete,
}: StudentsTableProps) => {
  // console.log(students);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-brand-primary hover:bg-brand-primary/95 border-b-brand-primary/20">
            <TableHead className="font-semibold text-white">Name</TableHead>
            <TableHead className="font-semibold text-white">Phone</TableHead>
            <TableHead className="font-semibold text-white">Telegram</TableHead>
            <TableHead className="font-semibold text-white">Status</TableHead>
            <TableHead className="font-semibold text-white">
              Registered
            </TableHead>
            <TableHead className="text-right font-semibold text-white">
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
              <StudentTableRow
                key={student.id}
                student={student}
                onView={onView}
                onBlock={onBlock}
                onUnblock={onUnblock}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
