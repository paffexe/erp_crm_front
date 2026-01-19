import { lazy } from "react";
const Admins = lazy(() => import("@/pages/admins/admins/Admins"));
const Earnings = lazy(() => import("@/pages/admins/earnings/Earnings"));
const Lessons = lazy(() => import("@/pages/admins/lessons/Lessons"));
const Payments = lazy(() => import("@/pages/admins/payments/Payments"));
const Students = lazy(() => import("@/pages/admins/students/Students"));
const Teachers = lazy(() => import("@/pages/admins/teachers/Teachers"));
const Profile = lazy(() => import("@/pages/admins/Profile"));

export default [
  {
    path: "profile",
    page: Profile,
  },
  {
    path: "admins",
    page: Admins,
  },
  {
    path: "teachers",
    page: Teachers,
  },
  {
    path: "students",
    page: Students,
  },
  {
    path: "lessons",
    page: Lessons,
  },
  {
    path: "payments",
    page: Payments,
  },
  {
    path: "earnings",
    page: Earnings,
  },
];
