import { Suspense } from "react";
import LoginForm from "./_components/login-form";
import AnonymousPage from "@/guards/AnonymousPage";
import { APP_NAME } from "@/lib/constants/app-type";

export default function LoginPage() {
  return (
    <AnonymousPage>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {APP_NAME}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your hub to list turfs and manage bookings
            </p>
          </div>
          <Suspense
            fallback={
              <div className="h-96 w-full max-w-md animate-pulse rounded-lg bg-gray-100" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </AnonymousPage>
  );
}
