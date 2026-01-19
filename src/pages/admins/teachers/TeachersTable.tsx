import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Teacher } from "@/types";
import { TeacherTableRow } from "./TeachersTableRow";

interface TeachersTableProps {
  teachers: Teacher[];
  isLoading: boolean;
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export const TeachersTable = ({
  teachers,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: TeachersTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-brand-accent/30 overflow-hidden shadow-lg shadow-brand-primary/5">
      <Table>
        <TableHeader>
          <TableRow
            className="
    bg-brand-secondary
    border-b border-brand-accent/30
    transition-colors duration-200
    hover:bg-brand-secondary-light
    dark:bg-sidebar
    dark:hover:bg-sidebar-accent
  "
          >
            <TableHead className="h-14 font-semibold text-white">
              Full Name
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Email
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Phone number
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Specialty
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Level
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Status
            </TableHead>
            <TableHead className="h-14 text-right font-semibold text-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-brand-accent/10 last:border-0"
              >
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j} className="py-4">
                    <Skeleton className="h-5 w-full rounded-lg bg-brand-accent/20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : teachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-brand-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-secondary text-lg">
                      No teachers found
                    </p>
                    <p className="text-sm text-brand-tertiary/70 mt-1">
                      Start by adding your first teacher
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            teachers.map((teacher) => (
              <TeacherTableRow
                key={teacher.id}
                teacher={teacher}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
