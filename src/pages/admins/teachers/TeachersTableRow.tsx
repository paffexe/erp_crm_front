import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Teacher } from "@/types";
import { levelLabels, specialtyLabels } from "@/config/constants";

interface TeacherTableRowProps {
  teacher: Teacher;
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export const TeacherTableRow = ({
  teacher,
  onView,
  onEdit,
  onDelete,
}: TeacherTableRowProps) => {
  return (
    <TableRow className="hover:bg-brand-accent/10 transition-all duration-200 border-b border-brand-accent/10 last:border-0">
      <TableCell className="font-semibold text-brand-secondary py-4">
        {teacher.fullName}
      </TableCell>
      <TableCell className="text-brand-tertiary/80 py-4">
        {teacher.email}
      </TableCell>
      <TableCell className="text-brand-tertiary/80 py-4">
        {teacher.phoneNumber}
      </TableCell>
      <TableCell className="py-4">
        <span className="text-sm font-medium text-brand-primary">
          {specialtyLabels[teacher.specification].toUpperCase()}
        </span>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant="outline"
          className="border-brand-tertiary/40 bg-brand-tertiary/5 text-brand-tertiary font-medium px-3 py-1 rounded-full"
        >
          {levelLabels[teacher.level]}
        </Badge>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant={teacher.isActive ? "default" : "destructive"}
          className={
            teacher.isActive
              ? "bg-brand-success hover:bg-brand-success-dark text-white font-medium px-3 py-1 rounded-full shadow-sm"
              : "bg-brand-error hover:bg-brand-error-dark text-white font-medium px-3 py-1 rounded-full shadow-sm"
          }
        >
          {teacher.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-right py-4">
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(teacher)}
            className="h-9 w-9 hover:bg-brand-primary/15 hover:text-brand-primary transition-all duration-200 rounded-lg"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(teacher)}
            className="h-9 w-9 hover:bg-brand-tertiary/15 hover:text-brand-tertiary transition-all duration-200 rounded-lg"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(teacher)}
            className="h-9 w-9 hover:bg-brand-error/15 hover:text-brand-error transition-all duration-200 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};