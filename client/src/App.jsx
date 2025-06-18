import { Route, Routes } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout";
import EditorPage from "@/pages/EditorPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import CardsPage from "./pages/CardsPage";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index path="cards" element={<CardsPage />} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route path="editor" element={<EditorPage />} />
    </Routes>
  );
}

export default App;
