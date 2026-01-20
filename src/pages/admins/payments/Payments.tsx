import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Transaction, TransactionStatus } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";

const statusLabels: Record<TransactionStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
};

const statusColors: Record<TransactionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Payments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [viewingTransaction, setViewingTransaction] =
    useState<Transaction | null>(null);
  const [cancellingTransaction, setCancellingTransaction] =
    useState<Transaction | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const queryClient = useQueryClient();
  const limit = 10;

  // Build query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (statusFilter !== "all") {
    queryParams.append("status", statusFilter);
  }

  // Note: Backend doesn't support search by student name, so we'll do client-side filtering
  // If you add a search parameter to your backend, you can add it here like:
  // if (search) queryParams.append("search", search);

  const { data, isLoading } = useGetQuery({
    pathname: `payments?${queryParams.toString()}`,
    url: `transactions?${queryParams.toString()}`,
  });

  const completeMutation = useMutation({
    mutationFn: transactionService.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment accepted");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      transactionService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment cancelled");
      setCancellingTransaction(null);
      setCancelReason("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error occurred");
    },
  });

  const transactions = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalCount = meta?.total || 0;

  // Client-side filtering for student name (since backend doesn't support it)
  const filteredTransactions = transactions.filter((t: Transaction) => {
    if (!search) return true;
    const studentName = t.student
      ? `${t.student.firstName} ${t.student.lastName}`.toLowerCase()
      : "";
    return studentName.includes(search.toLowerCase());
  });

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            View and manage all transactions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.student
                      ? `${transaction.student.firstName} ${transaction.student.lastName}`
                      : "-"}
                  </TableCell>

                  <TableCell>{transaction.lesson?.name || "-"}</TableCell>

                  <TableCell>
                    {Number(transaction.price).toLocaleString()} UZS
                  </TableCell>

                  <TableCell>
                    <Badge className={statusColors[transaction.status]}>
                      {statusLabels[transaction.status]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-US",
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {transaction.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              completeMutation.mutate(transaction.id)
                            }
                            disabled={completeMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setCancellingTransaction(transaction)
                            }
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Total: {totalCount} payments
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="flex items-center px-3 text-sm">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog
        open={!!viewingTransaction}
        onOpenChange={() => setViewingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>

          {viewingTransaction && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-medium">
                  {viewingTransaction.student
                    ? `${viewingTransaction.student.firstName} ${viewingTransaction.student.lastName}`
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Lesson</p>
                <p className="font-medium">
                  {viewingTransaction.lesson?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">
                  {Number(viewingTransaction.price).toLocaleString()} UZS
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={statusColors[viewingTransaction.status]}>
                  {statusLabels[viewingTransaction.status]}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(viewingTransaction.createdAt).toLocaleString(
                    "en-US",
                  )}
                </p>
              </div>

              {viewingTransaction.performedTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid At</p>
                  <p className="font-medium">
                    {new Date(viewingTransaction.performedTime).toLocaleString(
                      "en-US",
                    )}
                  </p>
                </div>
              )}

              {viewingTransaction.reason && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium text-red-600">
                    {viewingTransaction.reason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={!!cancellingTransaction}
        onOpenChange={() => setCancellingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this payment? Enter a reason
              (optional):
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Cancellation reason..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancellingTransaction(null);
                setCancelReason("");
              }}
            >
              Close
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                cancellingTransaction &&
                cancelMutation.mutate({
                  id: cancellingTransaction.id,
                  reason: cancelReason,
                })
              }
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
