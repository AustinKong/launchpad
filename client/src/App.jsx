import { Navigate, Route, Routes } from "react-router";

import AuthLayout from "@/components/layouts/AuthLayout";
import EditorLayout from "@/components/layouts/editor-layout";
import HomeLayout from "@/components/layouts/home-layout";
import AssistantEditorPage from "@/pages/assistant-editor-page";
import BlockEditorPage from "@/pages/block-editor-page";
import CardsPage from "@/pages/cards-page";
import LoginPage from "@/pages/LoginPage";
import NewCardPage from "@/pages/new-card-page";
import RegisterPage from "@/pages/RegisterPage";
import SharePage from "@/pages/SharePage";
import ThemeEditorPage from "@/pages/theme-editor-page";
import { Confirmation } from "@/utils/ui/confirmation";
import { Toaster } from "@/utils/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="cards" element={<CardsPage />} />
          <Route path="/cards/new" element={<NewCardPage />} />
        </Route>

        <Route path="auth" element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route path="cards/:slug" element={<EditorLayout />}>
          <Route index element={<Navigate to="blocks" replace />} />
          <Route path="blocks" element={<BlockEditorPage />} />
          <Route path="theme" element={<ThemeEditorPage />} />
          <Route path="assistant" element={<AssistantEditorPage />} />
        </Route>

        <Route path="share/:slug" element={<SharePage />} />
      </Routes>
      <Toaster />
      <Confirmation />
    </>
  );
}

export default App;
