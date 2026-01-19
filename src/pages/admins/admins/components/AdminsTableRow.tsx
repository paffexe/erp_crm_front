import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Pencil,
  Trash2,
  Key,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Admin } from "@/types";
import { roleLabels } from "@/config/constants";

interface AdminTableRowProps {
  admin: Admin;
  currentUserId: string;
  isSuperAdmin: boolean;
  onView: (admin: Admin) => void;
  onEdit: (admin: Admin) => void;
  onChangePassword: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export const AdminTableRow = ({
  admin,
  currentUserId,
  isSuperAdmin,
  onView,
  onEdit,
  onChangePassword,
  onDelete,
  onActivate,
  onDeactivate,
}: AdminTableRowProps) => {
  const canEdit = isSuperAdmin || currentUserId === admin.id;
  const canModify = isSuperAdmin && currentUserId !== admin.id;

  return (
    <TableRow className="hover:bg-accent/30 transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{
              backgroundColor:
                admin.role === "superAdmin"
                  ? "rgba(35, 76, 106, 0.15)"
                  : "rgba(69, 104, 130, 0.15)",
            }}
          ></div>
          {admin.username}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-foreground/70">
          <Phone className="h-3.5 w-3.5" />
          {admin.phoneNumber}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className="font-medium"
          style={{
            backgroundColor:
              admin.role === "superAdmin"
                ? "var(--brand-primary)"
                : "var(--brand-tertiary)",
            color: "white",
          }}
        >
          {roleLabels[admin.role]}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className="font-medium"
          style={{
            backgroundColor: admin.isActive
              ? "rgba(125, 166, 125, 0.15)"
              : "rgba(192, 90, 78, 0.15)",
            color: admin.isActive
              ? "var(--brand-success)"
              : "var(--brand-error)",
          }}
        >
          {admin.isActive ? "Faol" : "Nofaol"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(admin.createdAt).toLocaleDateString("uz-UZ")}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(admin)}
            title="See"
            className="h-9 w-9 hover:bg-accent"
          >
            <Eye
              className="h-4 w-4"
              style={{ color: "var(--brand-tertiary)" }}
            />
          </Button>
          {canEdit && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(admin)}
                title="Edit"
                className="h-9 w-9 hover:bg-accent"
              >
                <Pencil
                  className="h-4 w-4"
                  style={{ color: "var(--brand-primary)" }}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChangePassword(admin)}
                title="Change password"
                className="h-9 w-9 hover:bg-accent"
              >
                <Key
                  className="h-4 w-4"
                  style={{ color: "var(--brand-warning)" }}
                />
              </Button>
            </>
          )}
          {canModify && (
            <>
              {admin.isActive ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeactivate(admin.id)}
                  title="Deactivate"
                  className="h-9 w-9 hover:bg-accent"
                >
                  <XCircle
                    className="h-4 w-4"
                    style={{ color: "var(--brand-warning)" }}
                  />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onActivate(admin.id)}
                  title="Activate"
                  className="h-9 w-9 hover:bg-accent"
                >
                  <CheckCircle2
                    className="h-4 w-4"
                    style={{ color: "var(--brand-success)" }}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(admin)}
                title="O'chirish"
                className="h-9 w-9 hover:bg-accent"
              >
                <Trash2
                  className="h-4 w-4"
                  style={{ color: "var(--brand-error)" }}
                />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
