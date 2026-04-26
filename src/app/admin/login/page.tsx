import LoginForm from "@/components/admin/login-form";
import Logo from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm glass-card">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-fit">
              <Logo />
            </div>
          <CardTitle className="text-2xl">Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
