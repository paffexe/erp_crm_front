import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Lesson } from "../TeacherTypes";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import EditLessonModal from "./modal/editLessonModal";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Helper function to convert Prisma Decimal to number
const decimalToNumber = (decimal: any): number => {
  if (decimal === null || decimal === undefined) return 0;

  // If it's already a number or string, convert directly
  if (typeof decimal === "number") return decimal;
  if (typeof decimal === "string") return parseFloat(decimal);

  // If it's a Prisma Decimal object with s, e, d properties
  if (decimal && typeof decimal === "object" && "d" in decimal) {
    const sign = decimal.s || 1;
    const exponent = decimal.e || 0;
    const digits = decimal.d || [0];

    let numStr = digits.join("");
    const decimalPlaces = numStr.length - exponent - 1;

    if (decimalPlaces > 0) {
      const intPart = numStr.slice(0, exponent + 1) || "0";
      const decPart = numStr.slice(exponent + 1);
      numStr = `${intPart}.${decPart}`;
    }

    return sign * parseFloat(numStr);
  }

  return 0;
};

// Helper function to format price
const formatPrice = (price: any): string => {
  const numPrice = decimalToNumber(price);
  return numPrice > 0 ? `$${numPrice.toFixed(2)}` : "Free";
};

const Lessons = () => {
  const { user, isAuthenticated } = useAuth();

  // Pagination and filter states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchInput, setSearchInput] = useState(""); // Local input state
  const [search, setSearch] = useState(""); // Debounced search for API
  const [status, setStatus] = useState<string>("");
  const [isPaid, setIsPaid] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build query params
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (isPaid) params.append("isPaid", isPaid);
    return params.toString();
  }, [page, limit, search, status, isPaid]);

  const queryUrl = `lesson/${user?.id}/teacher?${buildQueryParams()}`;

  const { data, isLoading, isError, refetch } = useGetQuery({
    pathname: `lessons-${page}-${limit}-${search}-${status}-${isPaid}`,
    url: queryUrl,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center p-8 rounded-xl bg-card border border-border">
          <BookOpen
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "var(--brand-tertiary)" }}
          />
          <p className="text-foreground/70 text-base">
            Please log in to view lessons
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-lg"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center p-8 rounded-xl bg-card border border-border max-w-md">
          <XCircle
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "var(--brand-error)" }}
          />
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Error Loading Lessons
          </h3>
          <p className="text-foreground/60 text-sm">{isError}</p>
        </div>
      </div>
    );
  }

  const lessons = data?.data || [];
  const meta = data?.meta;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "var(--brand-success)";
      case "active":
      case "ongoing":
      case "booked":
        return "var(--brand-primary)";
      case "cancelled":
        return "var(--brand-error)";
      case "pending":
      case "available":
        return "var(--brand-warning)";
      default:
        return "var(--brand-tertiary)";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "rgba(125, 166, 125, 0.1)";
      case "active":
      case "ongoing":
      case "booked":
        return "rgba(35, 76, 106, 0.1)";
      case "cancelled":
        return "rgba(192, 90, 78, 0.1)";
      case "pending":
      case "available":
        return "rgba(212, 163, 115, 0.1)";
      default:
        return "rgba(69, 104, 130, 0.1)";
    }
  };

  const handleLessonUpdated = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value); // Update local input immediately
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePaymentStatusChange = (value: string) => {
    setIsPaid(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setIsPaid("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Lessons
          </h1>
          <p className="text-foreground/60 text-sm">
            {meta?.total || 0} {meta?.total === 1 ? "lesson" : "lessons"} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter
            className="h-5 w-5"
            style={{ color: "var(--brand-tertiary)" }}
          />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <Input
            placeholder="Search lessons..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10"
          />

          {/* Status Filter */}
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Status Filter */}
          <Select value={isPaid} onValueChange={handlePaymentStatusChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Payments</SelectItem>
              <SelectItem value="true">Paid</SelectItem>
              <SelectItem value="false">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant="outline" onClick={resetFilters} className="h-10">
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {lessons.length === 0 ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center p-12 rounded-xl bg-card border border-border max-w-md">
            <div
              className="h-16 w-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--brand-accent)" }}
            >
              <BookOpen
                className="h-8 w-8"
                style={{ color: "var(--brand-tertiary)" }}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No Lessons Found
            </h3>
            <p className="text-foreground/60 text-sm">
              {search || status || isPaid
                ? "Try adjusting your filters"
                : "You don't have any lessons scheduled at the moment."}
            </p>
          </div>
        </div>
      ) : (
        /* Lessons Grid */
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson: Lesson) => (
            <div
              key={lesson.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-brand-primary/30 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                  {lesson.name}
                </h3>
              </div>

              <div className="mb-4">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{
                    color: getStatusColor(lesson.status),
                    backgroundColor: getStatusBgColor(lesson.status),
                  }}
                >
                  {lesson.status}
                </span>
              </div>

              <div className="space-y-3 grow">
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--brand-tertiary)" }}
                  />
                  <span className="text-foreground/70">
                    <span className="font-semibold text-foreground">
                      {formatPrice(lesson.price)}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--brand-tertiary)" }}
                  />
                  <span className="text-foreground/70">
                    {new Date(lesson.startTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--brand-tertiary)" }}
                  />
                  <span className="text-foreground/70">
                    {new Date(lesson.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm pt-2 border-t border-border/50">
                  {lesson.isPaid ? (
                    <>
                      <CheckCircle2
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--brand-success)" }}
                      />
                      <span
                        style={{ color: "var(--brand-success)" }}
                        className="font-medium"
                      >
                        Paid
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--brand-warning)" }}
                      />
                      <span
                        style={{ color: "var(--brand-warning)" }}
                        className="font-medium"
                      >
                        Unpaid
                      </span>
                    </>
                  )}
                </div>
              </div>

              <EditLessonModal
                lesson={{
                  ...lesson,
                  price: decimalToNumber(lesson.price),
                }}
                onSuccess={handleLessonUpdated}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <span>Show</span>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-9 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-foreground/60">
              Page {meta.page} of {meta.totalPages}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={!meta.hasPreviousPage}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={!meta.hasNextPage}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;
