import { Route, Routes } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout";
import EditorPage from "@/pages/EditorPage";
import RegisterPage from "@/pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route index element={<EditorPage />} />

      <Route path="auth" element={<AuthLayout />}>
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
