import { Route, Routes } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout";
import EditorPage from "@/pages/EditorPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import CardsPage from "@/pages/CardsPage";
import WorkspaceLayout from "@/components/layouts/WorkspaceLayout";
import { Toaster } from "@/components/ui/toaster";
import ThemeEditorPage from "./pages/ThemeEditorPage";
import SharePage from "./pages/SharePage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="cards" element={<CardsPage />} />
        </Route>

        <Route path="auth" element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route path="cards/:slug" element={<WorkspaceLayout />}>
          <Route path="edit" element={<EditorPage />} />
          <Route path="theme" element={<ThemeEditorPage />} />
        </Route>

        <Route path="share/:slug" element={<SharePage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
