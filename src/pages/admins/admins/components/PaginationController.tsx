import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_LIMITS } from "@/config/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  meta?: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total: number;
  };
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: string) => void;
}

export const PaginationControls = ({
  meta,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) => {
  if (!meta) return null;

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        <span className="mr-2">Total records:</span>
        <span className="inline-flex items-center justify-center rounded-md bg-brand-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-brand-primary ring-1 ring-inset ring-brand-primary/20">
          {meta.total.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Rows per page
          </p>
          <Select value={limit.toString()} onValueChange={onLimitChange}>
            <SelectTrigger className="h-8 w-17.5 bg-background text-xs focus:ring-brand-primary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_LIMITS.map((pageLimit) => (
                <SelectItem
                  key={pageLimit}
                  className="text-xs"
                  value={pageLimit.toString()}
                >
                  {pageLimit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {meta.totalPages > 1 && (
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-muted-foreground">
              Page <span className="text-foreground">{meta.page}</span> of{" "}
              <span className="text-foreground">{meta.totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 transition-colors hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary"
                onClick={() => onPageChange(meta.page - 1)}
                disabled={!meta.hasPreviousPage}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 transition-colors hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary"
                onClick={() => onPageChange(meta.page + 1)}
                disabled={!meta.hasNextPage}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
