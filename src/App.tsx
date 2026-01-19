import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./pages/auth/guard/ProtectedRoute";
const Login = lazy(() => import("./pages/auth/teacher/Login"));
const AdminLogin = lazy(() => import("./pages/auth/admin/AdminLogin"));
const GoogleCallback = lazy(
  () => import("./pages/auth/teacher/GoogleCallback"),
);
const PhoneVerification = lazy(
  () => import("./pages/auth/teacher/PhoneVerify"),
);
const Register = lazy(() => import("./pages/auth/teacher/GoogleCallback"));
const Statistic = lazy(() => import("./pages/admins/statistic/Statistic"));
const Profile = lazy(() => import("./pages/teachers/Profile"));
import adminRoute from "./router/admin-route";
import teacherRoute from "./router/teacher-route";
import { HelpMeHelpYou } from "./components/loader/Loader";

const App = () => {
  return (
    <Suspense fallback={<HelpMeHelpYou />}>
      <Routes>
        <Route path="/login/teacher" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/phone-verification" element={<PhoneVerification />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app" element={<MainLayout />}>
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}
          >
            <Route path="admin">
              <Route index element={<Statistic />} />
              {adminRoute.map(({ page: Page, path }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="teacher">
              <Route index element={<Profile />} />
              {teacherRoute.map(({ page: Page, path }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
