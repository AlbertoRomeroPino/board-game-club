import { Outlet } from "react-router-dom";
import ButtonBackInicio from "../components/BackHomeButton";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <ButtonBackInicio />
        <span className="brand">🎲 Board Game Club</span>
      </div>
      <main className="auth-page">
        <Outlet />
      </main>
    </div>
  );
}
