export const API_URL = import.meta.env.VITE_IMAGE_URL;

import type { TeacherSpecialty, TeacherLevel } from "@/types";

export const specialtyLabels: Record<TeacherSpecialty, string> = {
  english: "english",
  french: "french",
  spanish: "spanish",
  italian: "italian",
  german: "german",
};

export const levelLabels: Record<TeacherLevel, string> = {
  b2: "B2",
  c1: "C1",
  c2: "C2",
};

import type { AdminRole } from "@/types";

export const roleLabels: Record<AdminRole, string> = {
  admin: "Admin",
  superAdmin: "Super Admin",
};

export const PAGE_LIMITS = [5, 10, 20, 50] as const;
export const STUDENTS_PER_PAGE = 10;

export const STUDENT_STATUS = {
  BLOCKED: "blocked",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const STUDENT_STATUS_LABELS = {
  blocked: "Blocked",
  active: "Active",
  inactive: "Inactive",
} as const;
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Users,
  XCircle,
} from "lucide-react";

export const STATS_CONFIG = [
  {
    title: "All Lessons",
    key: "allLessons",
    icon: BookOpen,
    gradient: "from-brand-primary to-brand-tertiary",
    iconBg: "var(--brand-primary)",
  },
  {
    title: "Completed Lessons",
    key: "completedLessons",
    icon: CheckCircle2,
    gradient: "from-brand-success to-emerald-500",
    iconBg: "var(--brand-success)",
  },
  {
    title: "Booked Lessons",
    key: "bookedLessons",
    icon: Clock,
    gradient: "from-brand-warning to-amber-500",
    iconBg: "var(--brand-warning)",
  },
  {
    title: "Overall Teachers",
    key: "teachers",
    icon: GraduationCap,
    gradient: "from-brand-tertiary to-blue-500",
    iconBg: "var(--brand-tertiary)",
  },
  {
    title: "Overall Students",
    key: "students",
    icon: Users,
    gradient: "from-brand-primary to-blue-600",
    iconBg: "var(--brand-primary)",
  },
  {
    title: "Cancelled Lessons",
    key: "cancelledLessons",
    icon: XCircle,
    gradient: "from-brand-error to-red-500",
    iconBg: "var(--brand-error)",
  },
] as const;

export const RECENT_ITEMS_LIMIT = 5;
