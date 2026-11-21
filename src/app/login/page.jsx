import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="auth-page">Loading sign-in...</main>}>
      <LoginForm />
    </Suspense>
  );
}
