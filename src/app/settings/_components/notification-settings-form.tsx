"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useProfile,
  useUpdateNotificationSettings,
} from "@/lib/hooks/auth";
import { APP_NAME } from "@/lib/constants/app-type";
import { getErrorMessage } from "@/lib/utils";
import { Bell, Loader2, Mail, MessageSquare } from "lucide-react";

export default function NotificationSettingsForm() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: user, isLoading } = useProfile();
  const updateSettings = useUpdateNotificationSettings();

  useEffect(() => {
    if (user) {
      setEmailEnabled(user.emailNotificationsEnabled ?? true);
      setSmsEnabled(user.smsNotificationsEnabled ?? false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        emailNotificationsEnabled: emailEnabled,
        smsNotificationsEnabled: smsEnabled,
      });
      setSuccessMessage("Notification preferences saved.");
    } catch {
      setSuccessMessage(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-600" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose how you want to receive updates from {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
          />
          <div>
            <Label className="flex cursor-pointer items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email notifications
            </Label>
            <p className="text-sm text-gray-500">
              Booking confirmations, reminders, and account alerts
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
            checked={smsEnabled}
            onChange={(e) => setSmsEnabled(e.target.checked)}
          />
          <div>
            <Label className="flex cursor-pointer items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              SMS notifications
            </Label>
            <p className="text-sm text-gray-500">
              Text messages for urgent booking updates
            </p>
          </div>
        </label>

        {successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}

        {updateSettings.error && (
          <p className="text-sm text-red-600">
            {getErrorMessage(
              updateSettings.error,
              "Could not save notification settings.",
            )}
          </p>
        )}

        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save preferences"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
