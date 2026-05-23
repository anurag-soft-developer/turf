"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useApplyHostOnboarding,
  useHostOnboardingStatus,
} from "@/modules/host/hooks/use-host-onboarding";
import {
  hostOnboardingFormSchema,
  hostOnboardingFormToPayload,
  type HostOnboardingFormValues,
} from "@/modules/host/schemas/host-onboarding-form";
import type { RazorpayHostKycStatus } from "@/modules/host/types/host-onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

function StatusBanner({
  status,
  message,
}: {
  status: RazorpayHostKycStatus;
  message?: string;
}) {
  const configs: Record<
    RazorpayHostKycStatus,
    { title: string; icon: React.ReactNode; className: string }
  > = {
    not_started: {
      title: "Become a host",
      icon: <AlertCircle className="h-5 w-5" />,
      className: "border-gray-200 bg-white",
    },
    pending: {
      title: "Verification in progress",
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      className: "border-amber-200 bg-amber-50",
    },
    under_review: {
      title: "Verification in progress",
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      className: "border-amber-200 bg-amber-50",
    },
    needs_clarification: {
      title: "Action required",
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      className: "border-amber-200 bg-amber-50",
    },
    activated: {
      title: "Account activated",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      className: "border-emerald-200 bg-emerald-50",
    },
    rejected: {
      title: "Application rejected",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      className: "border-red-200 bg-red-50",
    },
    suspended: {
      title: "Account suspended",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      className: "border-red-200 bg-red-50",
    },
  };

  const config = configs[status];

  return (
    <Card className={config.className}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        {config.icon}
        <div>
          <CardTitle className="text-lg">{config.title}</CardTitle>
          <CardDescription className="mt-1 text-sm">
            {message ??
              (status === "rejected"
                ? "Please review your details and submit again."
                : "Your account will be activated soon after Razorpay verifies your bank and business details.")}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  );
}

function OnboardingForm() {
  const applyMutation = useApplyHostOnboarding();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HostOnboardingFormValues>({
    resolver: zodResolver(hostOnboardingFormSchema),
    defaultValues: {
      businessType: "individual",
      category: "sports",
      subcategory: "outdoor_sports",
    },
  });

  const businessType = watch("businessType");
  const isSubmitting = applyMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Host payout setup</CardTitle>
        <CardDescription>
          Register your business, address, and bank account with Razorpay to
          receive booking payouts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={handleSubmit((values) =>
            applyMutation.mutate(hostOnboardingFormToPayload(values)),
          )}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="legalBusinessName">
                Legal business name <RequiredMark />
              </Label>
              <Input
                id="legalBusinessName"
                disabled={isSubmitting}
                {...register("legalBusinessName")}
              />
              {errors.legalBusinessName ? (
                <p className="text-sm text-red-600">
                  {errors.legalBusinessName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">
                Contact name <RequiredMark />
              </Label>
              <Input
                id="contactName"
                disabled={isSubmitting}
                {...register("contactName")}
              />
              {errors.contactName ? (
                <p className="text-sm text-red-600">
                  {errors.contactName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone <RequiredMark />
              </Label>
              <Input id="phone" disabled={isSubmitting} {...register("phone")} />
              {errors.phone ? (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>
                Business type <RequiredMark />
              </Label>
              <Select
                value={businessType}
                disabled={isSubmitting}
                onValueChange={(v) =>
                  setValue(
                    "businessType",
                    v as HostOnboardingFormValues["businessType"],
                  )
                }
              >
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="proprietorship">Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="private_limited">Private limited</SelectItem>
                  <SelectItem value="llp">LLP</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">
                PAN <RequiredMark />
              </Label>
              <Input
                id="pan"
                className="uppercase"
                disabled={isSubmitting}
                {...register("pan")}
              />
              {errors.pan ? (
                <p className="text-sm text-red-600">{errors.pan.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST (optional)</Label>
              <Input id="gst" disabled={isSubmitting} {...register("gst")} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Registered address</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street1">
                  Street line 1 <RequiredMark />
                </Label>
                <Input
                  id="street1"
                  disabled={isSubmitting}
                  {...register("street1")}
                />
                {errors.street1 ? (
                  <p className="text-sm text-red-600">{errors.street1.message}</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street2">Street line 2 (optional)</Label>
                <Input
                  id="street2"
                  disabled={isSubmitting}
                  {...register("street2")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <RequiredMark />
                </Label>
                <Input id="city" disabled={isSubmitting} {...register("city")} />
                {errors.city ? (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">
                  State <RequiredMark />
                </Label>
                <Input
                  id="state"
                  disabled={isSubmitting}
                  {...register("state")}
                />
                {errors.state ? (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Postal code <RequiredMark />
                </Label>
                <Input
                  id="postalCode"
                  disabled={isSubmitting}
                  {...register("postalCode")}
                />
                {errors.postalCode ? (
                  <p className="text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Bank account</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bankBeneficiaryName">
                  Beneficiary name <RequiredMark />
                </Label>
                <Input
                  id="bankBeneficiaryName"
                  disabled={isSubmitting}
                  {...register("bankBeneficiaryName")}
                />
                {errors.bankBeneficiaryName ? (
                  <p className="text-sm text-red-600">
                    {errors.bankBeneficiaryName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">
                  Account number <RequiredMark />
                </Label>
                <Input
                  id="bankAccountNumber"
                  disabled={isSubmitting}
                  {...register("bankAccountNumber")}
                />
                {errors.bankAccountNumber ? (
                  <p className="text-sm text-red-600">
                    {errors.bankAccountNumber.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankIfsc">
                  IFSC <RequiredMark />
                </Label>
                <Input
                  id="bankIfsc"
                  className="uppercase"
                  disabled={isSubmitting}
                  {...register("bankIfsc")}
                />
                {errors.bankIfsc ? (
                  <p className="text-sm text-red-600">
                    {errors.bankIfsc.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {applyMutation.isError ? (
            <p className="text-sm text-red-600">
              {(applyMutation.error as { response?: { data?: { message?: string | string[] } } })
                ?.response?.data?.message
                ? String(
                    (applyMutation.error as {
                      response?: { data?: { message?: string | string[] } };
                    }).response?.data?.message,
                  )
                : "Failed to submit onboarding. Please try again."}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit for verification"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function HostOnboardingPage() {
  const { data, isLoading } = useHostOnboardingStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const showForm =
    data.razorpayKycStatus === "not_started" ||
    data.razorpayKycStatus === "rejected";

  const showWaiting =
    data.razorpayKycStatus === "pending" ||
    data.razorpayKycStatus === "under_review" ||
    data.razorpayKycStatus === "needs_clarification" ||
    data.razorpayKycStatus === "suspended";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Host onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your bank account to publish turfs and receive booking payouts.
        </p>
      </div>

      <StatusBanner
        status={data.razorpayKycStatus}
        message={data.statusMessage}
      />

      {showWaiting ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            You cannot publish turfs until Razorpay activates your account. We
            will update this page automatically once verification is complete.
          </CardContent>
        </Card>
      ) : null}

      {showForm ? <OnboardingForm /> : null}

      {data.razorpayKycStatus === "activated" ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="py-6 text-sm text-emerald-900">
            Your payout account is ready. You can publish turfs from the host
            dashboard.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
