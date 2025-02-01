import AppLayout from "./components/AppLayout";
import Task from "./components/Task";
import { Toaster } from "react-hot-toast";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthPage from "./Pages/Auth";
import { useEffect } from "react";

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthRoute = location.pathname === "/";

  useEffect(() => {
    if (isAuthenticated() && isAuthRoute) {
      navigate(`/dashboard/:projectId`, { replace: true });
    }
  }, [isAuthRoute, navigate]);

  return (
    <>
      <Toaster position="top-right" gutter={8} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to={`/dashboard/:projectId`} replace />
            ) : (
              <AuthPage />
            )
          }
        />
        <Route
          path="/dashboard/:projectId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Task />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <div className="flex flex-col items-center w-full pt-10">
                  <img src="./image/welcome.svg" className="w-5/12" alt="" />
                  <h1 className="text-lg text-gray-600">
                    Select or create new project
                  </h1>
                </div>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
