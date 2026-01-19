import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCog } from "lucide-react";
import type { Admin } from "@/types";
import { AdminTableRow } from "./AdminsTableRow";

interface AdminsTableProps {
  admins: Admin[];
  isLoading: boolean;
  limit: number;
  currentUserId: string;
  isSuperAdmin: boolean;
  onView: (admin: Admin) => void;
  onEdit: (admin: Admin) => void;
  onChangePassword: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export const AdminsTable = ({
  admins,
  isLoading,
  limit,
  currentUserId,
  isSuperAdmin,
  onView,
  onEdit,
  onChangePassword,
  onDelete,
  onActivate,
  onDeactivate,
}: AdminsTableProps) => {
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
            <TableHead className="h-14 font-semibold text-white pl-6">
              Username
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Phone Number
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Role
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Status
            </TableHead>
            <TableHead className="h-14 font-semibold text-white">
              Created
            </TableHead>
            <TableHead className="h-14 text-right font-semibold text-white pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            [...Array(limit)].map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-brand-accent/10 last:border-0"
              >
                {[...Array(6)].map((_, j) => (
                  <TableCell key={j} className="py-4 px-6">
                    <Skeleton className="h-5 w-full rounded-lg bg-brand-accent/20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center">
                    <UserCog className="w-8 h-8 text-brand-tertiary" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-secondary text-lg">
                      No administrators found
                    </p>
                    <p className="text-sm text-brand-tertiary/70 mt-1">
                      Try adjusting your search or add a new admin
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <AdminTableRow
                key={admin.id}
                admin={admin}
                currentUserId={currentUserId}
                isSuperAdmin={isSuperAdmin}
                onView={onView}
                onEdit={onEdit}
                onChangePassword={onChangePassword}
                onDelete={onDelete}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
