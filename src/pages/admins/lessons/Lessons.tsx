import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";
import type { Lesson, LessonStatus } from "@/types";

const statusLabels: Record<LessonStatus, string> = {
  available: "Available",
  booked: "Booked",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusColors: Record<LessonStatus, string> = {
  available: "bg-blue-100 text-blue-700",
  booked: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Lessons = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const limit = 10;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  if (statusFilter !== "all") {
    queryParams.append("status", statusFilter);
  }

  const { data, isLoading, isError } = useGetQuery({
    pathname: `lessons?${queryParams.toString()}`,
    url: `lesson?${queryParams.toString()}`,
  });

  const lessons = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalCount = meta?.total || 0;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("uz-UZ"),
      time: date.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lessons</h1>
        <p className="text-gray-600 mt-1">Manage all lessons</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by lesson, teacher, or student name..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All lessons</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lessons title</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  Lessons not found
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson: Lesson) => {
                const start = formatDateTime(lesson.startTime);
                const end = formatDateTime(lesson.endTime);
                return (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.name}</TableCell>
                    <TableCell>{lesson.teacher?.fullName || "-"}</TableCell>
                    <TableCell>
                      {lesson.student
                        ? `${lesson.student.firstName} ${lesson.student.lastName}`
                        : "-"}
                    </TableCell>
                    <TableCell>{start.date}</TableCell>
                    <TableCell>
                      {start.time} - {end.time}
                    </TableCell>
                    <TableCell>
                      {Number(lesson.price).toLocaleString()} $
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lesson.status]}>
                        {statusLabels[lesson.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingLesson(lesson)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Jami: {totalCount} ta dars</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Oldingi
            </Button>
            <span className="text-sm px-3">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Keyingi
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog
        open={!!viewingLesson}
        onOpenChange={() => setViewingLesson(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lessons more</DialogTitle>
          </DialogHeader>
          {viewingLesson && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Lesson name</p>
                <p className="font-medium">{viewingLesson.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={statusColors[viewingLesson.status]}>
                  {statusLabels[viewingLesson.status]}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teacher</p>
                <p className="font-medium">
                  {viewingLesson.teacher?.fullName || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-medium">
                  {viewingLesson.student
                    ? `${viewingLesson.student.firstName} ${viewingLesson.student.lastName}`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start</p>
                <p className="font-medium">
                  {new Date(viewingLesson.startTime).toLocaleString("uz-UZ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End</p>
                <p className="font-medium">
                  {new Date(viewingLesson.endTime).toLocaleString("uz-UZ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium">
                  {Number(viewingLesson.price).toLocaleString()} $
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment status</p>
                <Badge variant={viewingLesson.isPaid ? "default" : "secondary"}>
                  {viewingLesson.isPaid ? "Paid" : "Not paid"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lessons;
