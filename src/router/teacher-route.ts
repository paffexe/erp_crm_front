import { lazy } from "react";

const Lessons = lazy(() => import("@/pages/teachers/lessons/Lessons"));
const Payments = lazy(() => import("@/pages/teachers/payments/Payments"));
const Profile = lazy(() => import("@/pages/teachers/Profile"));
const Schedules = lazy(() => import("@/pages/teachers/schedules/Schedules"));

export default [
  {
    path: "lessons",
    page: Lessons,
  },
  {
    path: "schedules",
    page: Schedules,
  },
  {
    path: "payments",
    page: Payments,
  },
  {
    path: "profile",
    page: Profile,
  },
];
