"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  AdminWithdrawalDetailPanel,
  default as AdminWithdrawalsList,
} from "./_components/admin-withdrawals-content";

function AdminWithdrawalsDrawer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const drawer = searchParams.get("drawer");

  if (!drawer) return null;

  return (
    <MyDrawer
      title="Withdrawal request"
      onClose={() => router.push("/platform-admin/withdrawals")}
    >
      <AdminWithdrawalDetailPanel id={drawer} />
    </MyDrawer>
  );
}

function AdminWithdrawalsPageContent() {
  return (
    <>
      <AdminWithdrawalsList />
      <AdminWithdrawalsDrawer />
    </>
  );
}

export default function PlatformAdminWithdrawalsPage() {
  return (
    <Suspense fallback={null}>
      <AdminWithdrawalsPageContent />
    </Suspense>
  );
}
