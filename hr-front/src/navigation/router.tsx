import { Employees } from "@/screens/employees/employees";
import { Login } from "@/screens/login/login";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { Departments } from "@/screens/departments/departments";
import { Positions } from "@/screens/positions/positions";
import { Home } from "@/screens/home/home";
import { Leaves } from "@/screens/leaves/leaves";
import { Apply } from "@/screens/apply/apply";
import { Applications } from "@/screens/applications/applications";
import { Employee } from "@/screens/employee/employee";
import { Schedules } from "@/screens/schedules/schedules";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/apply",
    element: <Apply />,
  },
  {
    path: "/employees",
    element: (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employees/:id",
    element: (
      <ProtectedRoute>
        <Employee />
      </ProtectedRoute>
    ),
  },
  {
    path: "/departments",
    element: (
      <ProtectedRoute>
        <Departments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/positions",
    element: (
      <ProtectedRoute>
        <Positions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaves",
    element: (
      <ProtectedRoute>
        <Leaves />
      </ProtectedRoute>
    ),
  },
  {
    path: "/applications",
    element: (
      <ProtectedRoute>
        <Applications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedules",
    element: (
      <ProtectedRoute>
        <Schedules />
      </ProtectedRoute>
    ),
  },
]);
