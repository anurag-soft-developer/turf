import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer";
import ProtectedPage from "@/guards/ProtectedPage";
import ProfileSettingsForm from "./components/profile-settings-form";
import ChangePasswordForm from "./components/change-password-form";
import TwoFactorSettingsForm from "./components/two-factor-settings-form";
import NotificationSettingsForm from "./components/notification-settings-form";

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="mt-1 text-gray-600">
                Manage your profile, security, and notification preferences.
              </p>
            </div>

            <ProfileSettingsForm />
            <ChangePasswordForm />
            <TwoFactorSettingsForm />
            <NotificationSettingsForm />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedPage>
  );
}
