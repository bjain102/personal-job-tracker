import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import NotFound from "pages/NotFound";
import Login from "./pages/Login";
import JobDashboard from './pages/job-dashboard-table-kanban-views';
import AddEditJobModal from './pages/add-edit-job-modal';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <JobDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/add-job" element={
            <ProtectedRoute>
              <AddEditJobModal />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute>
              <JobDashboard />
            </ProtectedRoute>
          } />
          
          {/* Legacy route redirects */}
          <Route path="/job-dashboard-table-kanban-views" element={<Navigate to="/dashboard" replace />} />
          <Route path="/add-edit-job-modal" element={<Navigate to="/add-job" replace />} />
          
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
