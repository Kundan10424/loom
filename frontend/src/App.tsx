// App.tsx (example using react-router v6)
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      {/* other routes */}
    </Routes>
  );
}
