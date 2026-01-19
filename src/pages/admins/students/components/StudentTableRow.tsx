import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  Users,
  Phone,
  Calendar,
  MessageSquare,
} from "lucide-react";
import type { Student } from "@/types";
import { StudentStatusBadge } from "./StudentBadge";

interface StudentTableRowProps {
  student: Student;
  onView: (student: Student) => void;
  onBlock: (student: Student) => void;
  onUnblock: (id: string) => void;
  onDelete: (student: Student) => void;
}

export const StudentTableRow = ({
  student,
  onView,
  onBlock,
  onUnblock,
  onDelete,
}: StudentTableRowProps) => {
  return (
    <TableRow className="hover:bg-accent/30 transition-colors">
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
        <StudentStatusBadge
          isBlocked={student.isBlocked}
          isActive={student.isActive}
        />
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
            onClick={() => onView(student)}
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
              onClick={() => onUnblock(student.id)}
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
              onClick={() => onBlock(student)}
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
            onClick={() => onDelete(student)}
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
  );
};
