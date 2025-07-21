import { Route, Routes } from "react-router";

import AuthLayout from "@/components/layouts/AuthLayout";
import HomeLayout from "@/components/layouts/home-layout";
import WorkspaceLayout from "@/components/layouts/WorkspaceLayout";
import { Toaster } from "@/components/ui/Toaster";
import CardsPage from "@/pages/cards-page";
import EditorPage from "@/pages/EditorPage";
import LoginPage from "@/pages/LoginPage";
import PersonaPage from "@/pages/PersonaPage";
import RegisterPage from "@/pages/RegisterPage";
import SharePage from "@/pages/SharePage";
import ThemeEditorPage from "@/pages/ThemeEditorPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="cards" element={<CardsPage />} />
        </Route>

        <Route path="auth" element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route path="cards/:slug" element={<WorkspaceLayout />}>
          <Route path="edit" element={<EditorPage />} />
          <Route path="theme" element={<ThemeEditorPage />} />
          <Route path="persona" element={<PersonaPage />} />
        </Route>

        <Route path="share/:slug" element={<SharePage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
