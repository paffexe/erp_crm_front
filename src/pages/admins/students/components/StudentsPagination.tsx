import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudentsPaginationProps {
  meta?: {
    totalPages: number;
    total: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const StudentsPagination = ({
  meta,
  currentPage,
  onPageChange,
}: StudentsPaginationProps) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2">
      <p className="text-sm text-foreground/60">
        Page {currentPage} of {meta.totalPages} • Total: {meta.total} students
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
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
          {currentPage} / {meta.totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(meta.totalPages, currentPage + 1))
          }
          disabled={currentPage === meta.totalPages}
          className="h-9"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
