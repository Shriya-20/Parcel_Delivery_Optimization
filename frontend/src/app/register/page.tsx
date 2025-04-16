import { Register } from "@/components/auth/Register";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
}
