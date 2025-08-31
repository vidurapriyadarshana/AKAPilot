import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Home";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
