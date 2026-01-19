import { useAuth } from "@/hooks/useAuth";
import type { Payment } from "../TeacherTypes";
import {
  DollarSign,
  GraduationCap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useGetQuery } from "@/hooks/useQuery/useGetQuery";

const Payments = () => {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useGetQuery({
    pathname: "payments",
    url: `teacher-payments/teacher/${user?.id}`,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="p-8 bg-brand-accent/20 rounded-xl border-2 border-brand-accent">
        <p className="text-brand-secondary font-medium">
          Please log in to view payments
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-brand-primary">
          <div className="w-6 h-6 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading your payments...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-brand-error/10 border-2 border-brand-error rounded-xl">
        <div className="flex items-center gap-3 text-brand-error">
          <AlertCircle size={24} />
          <div>
            <p className="font-semibold">Error loading payments</p>
            <p className="text-sm">{isError}</p>
          </div>
        </div>
      </div>
    );
  }

  const payments = data?.payments || [];

  if (payments.length === 0) {
    return (
      <div className="p-8 bg-card rounded-xl border border-border text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-brand-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-brand-tertiary" />
          </div>
          <h3 className="text-xl font-semibold text-brand-secondary mb-2">
            No Payments Yet
          </h3>
          <p className="text-muted-foreground">
            You haven't received any payments yet. Complete lessons to start
            earning!
          </p>
        </div>
      </div>
    );
  }

  const totalEarnings = payments.reduce(
    (sum: number, p: Payment) => sum + p.teacherAmount,
    0
  );
  const totalLessons = payments.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-secondary mb-2">
          My Payments
        </h1>
        <p className="text-muted-foreground">
          Track your earnings and payment history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-brand-success/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <DollarSign className="w-6 h-6 text-brand-success" />
            </div>
          </div>
          <p className="text-sm font-semibold text-muted-foreground mb-1">
            Total Earnings
          </p>
          <p className="text-3xl font-bold text-brand-success">
            ${(totalEarnings / 100).toFixed(2)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-brand-primary" />
            </div>
          </div>
          <p className="text-sm font-semibold text-muted-foreground mb-1">
            Total Lessons
          </p>
          <p className="text-3xl font-bold text-brand-secondary">
            {totalLessons}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-brand-tertiary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-6 h-6 text-brand-tertiary" />
            </div>
          </div>
          <p className="text-sm font-semibold text-muted-foreground mb-1">
            Average per Lesson
          </p>
          <p className="text-3xl font-bold text-brand-tertiary">
            ${(totalEarnings / totalLessons / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Paid At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Paid By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Lesson Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Your Earnings
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-brand-secondary uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {payments.map((payment: Payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-foreground">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {new Date(payment.paidAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {payment.paidBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-primary">
                    ${(payment.totalLessonAmount / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="text-muted-foreground">
                      ${(payment.platformComission / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      (
                      {(
                        (payment.platformComission /
                          payment.totalLessonAmount) *
                        100
                      ).toFixed(0)}
                      %)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-success">
                    ${(payment.teacherAmount / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.isCanceled ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-error/10 text-brand-error border border-brand-error/20">
                        Canceled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-success/10 text-brand-success border border-brand-success/20">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs">
                    {payment.isCanceled && payment.canceledReason ? (
                      <div className="text-brand-error">
                        <p className="font-semibold text-xs mb-1">
                          Canceled by: {payment.canceledBy}
                        </p>
                        <p className="text-xs opacity-90">
                          {payment.canceledReason}
                        </p>
                      </div>
                    ) : (
                      <p
                        className="text-muted-foreground truncate text-xs"
                        title={payment.notes}
                      >
                        {payment.notes}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
