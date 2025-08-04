import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Auth wrappers
import PrivateRoute from "./routes/PrivateRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import HomeRedirect from "./pages/HomeRedirect";

// ✅ Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from "./pages/Unauthorized";
import AdminRegister from './pages/AdminRegister';

// ✅ Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSummary from "./components/dashboard/AdminSummary";
import Departments from "./pages/departments/DepartmentList";
import AddDepartment from "./pages/departments/AddDepartment";
import EditEmployeeProfile from "./pages/admin/EditEmployeeProfile";
import EmployeeList from "./pages/admin/EmployeeList";
import EmployeeDetail from './pages/admin/EmployeeDetail'
import LeaveCalendarPage from "./pages/admin/LeaveCalendarPage";
import AdminSalaryPage from "./pages/admin/AdminSalaryPage";
import AdminLeavePage from "./pages/admin/AdminLeavePage";
import EmployeeAnalytics from "./pages/admin/EmployeeAnalytics";
import AdminFileDashboard from "./pages/admin/AdminFileDashboard";
import FileManagerPage from "./pages/admin/FileManagerPage";

// ✅ Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeSummary from "./components/dashboard/EmployeeSummary";
import EditProfile from "./pages/employee/EditProfile";
import ViewProfile from "./pages/employee/ViewProfile";
import EmployeeProfileView from "./pages/employee/EmployeeProfileView";
import LeaveRequests from "./pages/employee/LeaveRequests";
import SalaryDetails from "./pages/employee/SalaryDetails";
import AttendancePage from "./pages/employee/AttendancePage";
import AttendanceHeatmap from "./pages/employee/AttendanceHeatmap";
import MyLeaveSummary from "./pages/employee/MyLeaveSummary";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* ✅ Public routes */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ✅ Admin-only registration route (secured) */}
          <Route
            path="/admin/register"
            element={
              <PrivateRoute>
                <RoleBasedRoute requiredRoles={["admin"]}>
                  <AdminRegister />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />

          {/* ✅ Admin dashboard and routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <RoleBasedRoute requiredRoles={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<AdminSummary />} />
            <Route path="departments" element={<Departments />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="employees/edit/:id" element={<EditEmployeeProfile />} />
            <Route path="calendar" element={<LeaveCalendarPage />} />
            <Route path="leaves" element={<AdminLeavePage />} />
            <Route path="salary" element={<AdminSalaryPage />} />
            <Route path="files" element={<AdminFileDashboard />} />
            <Route path="file-manager" element={<FileManagerPage />} />
            <Route path="employee-analytics" element={<EmployeeAnalytics />} />
          </Route>

          {/* ✅ Employee dashboard and routes */}
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoute>
                <RoleBasedRoute requiredRoles={["employee"]}>
                  <EmployeeDashboard />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<EmployeeSummary />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="profile/view" element={<ViewProfile />} />
            <Route path="profile/employee" element={<EmployeeProfileView />} />
            <Route path="leave" element={<LeaveRequests />} />
            <Route path="leave/summary" element={<MyLeaveSummary />} />
            <Route path="salary" element={<SalaryDetails />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="attendance-heatmap" element={<AttendanceHeatmap />} />
            <Route path="*" element={<Navigate to="/unauthorized" />} />
          </Route>

        </Routes>
      </BrowserRouter>

      {/* ✅ Global toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
