import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Event from "./pages/Event";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUserRole } from "./hooks/useUserRole";
import PromoteUser from "./pages/PromoteUser";

function App() {
  const { role, loading, user } = useUserRole();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="profile" element={<Profile />} />

          {/* 🔐 Admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                role={role}
                loading={loading}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/promote"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                role={role}
                loading={loading}
              >
                <PromoteUser />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
