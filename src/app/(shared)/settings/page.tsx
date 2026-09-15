import ProtectedPage from "@/guards/ProtectedPage";
import ChangePasswordForm from "./_components/change-password-form";
import NotificationSettingsForm from "./_components/notification-settings-form";
import ProfileSettingsForm from "./_components/profile-settings-form";
import TwoFactorSettingsForm from "./_components/two-factor-settings-form";

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
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
      </div>
    </ProtectedPage>
  );
}
