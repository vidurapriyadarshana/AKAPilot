import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/Home";
import Layout from "../layout/Layout";
import Subbjects from "../pages/Dashboard/Subjects";
import MemoryCards from "../pages/Dashboard/MemoryCards";
import StudySession from "../pages/Dashboard/StudySession";
import PomodoroTimer from "../pages/Dashboard/PomodoroTimer";
import Analytics from "../pages/Dashboard/Analytics";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subbjects />} />
            <Route path="/memory-cards" element={<MemoryCards />} />
            <Route path="/study-session" element={<StudySession />} />
            <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Redirect any unknown route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
