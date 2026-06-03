"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { storageApi } from "@/lib/api/storage";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils/currency";
import {
  userDisplayName,
  withdrawalStatusVariant,
} from "@/lib/utils/withdrawal-display";
import {
  hasCompleteBankDetails,
  hasCompleteUpiDetails,
  hasUpiData,
  hasBankData,
  payoutMethodLabel,
  resolvePrimaryMethod,
} from "@/modules/host/schemas/wallet-form";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import {
  useAddWithdrawalAttachments,
  useAddWithdrawalComment,
  useAdminWithdrawal,
  useInfiniteAdminWithdrawals,
  useUpdateWithdrawalStatus,
} from "@/modules/platform-admin/hooks/use-admin-withdrawals";
import {
  formatWithdrawalStatus,
  getAllowedNextStatuses,
} from "@/modules/platform-admin/schemas/withdrawal-admin";
import type { AdminWithdrawal } from "@/types/withdrawal";
import type { PayoutMethod } from "@/types/wallet";
import type { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Inbox,
  Landmark,
  Loader2,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Smartphone,
  User,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";

const TERMINAL_WITHDRAWAL_STATUSES: WithdrawalStatus[] = [
  "settled",
  "rejected",
  "cancelled",
];

const STATUS_TABS: { label: string; status?: WithdrawalStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "Processing", status: "processing" },
  { label: "Settled", status: "settled" },
  { label: "Rejected", status: "rejected" },
  { label: "Cancelled", status: "cancelled" },
];

function isImageAttachment(url: string): boolean {
  return /\.(jpe?g|png|gif|webp)(\?|$)/i.test(url);
}

function isPdfAttachment(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url);
}

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      ) : null}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StatusPill({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-muted-foreground hover:bg-background hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function AdminWithdrawalRow({
  withdrawal,
  onSelect,
}: {
  withdrawal: Withdrawal;
  onSelect: (id: string) => void;
}) {
  const isPending = withdrawal.status === "pending";

  return (
    <button
      type="button"
      onClick={() => onSelect(withdrawal._id)}
      className="group flex w-full items-center gap-4 border-b border-border/60 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-indigo-50/40"
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          isPending
            ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200/80"
            : "bg-indigo-50 text-indigo-600",
        )}
      >
        <Wallet className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold tabular-nums tracking-tight text-foreground">
            {formatInr(withdrawal.amount)}
          </p>
          <Badge variant={withdrawalStatusVariant(withdrawal.status)}>
            {formatWithdrawalStatus(withdrawal.status)}
          </Badge>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {userDisplayName(withdrawal.requestedBy)}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {format(new Date(withdrawal.createdAt), "MMM d, yyyy · HH:mm")}
          </span>
        </p>
        {withdrawal.reviewedBy ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Reviewed by {userDisplayName(withdrawal.reviewedBy)}
          </p>
        ) : null}
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
    </button>
  );
}

function PayoutMethodCard({
  title,
  icon,
  preferred,
  children,
}: {
  title: string;
  icon: ReactNode;
  preferred: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-sm transition-colors",
        preferred
          ? "border-indigo-200 bg-indigo-50/60 ring-1 ring-indigo-100"
          : "border-border/60 bg-muted/20",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-foreground">
          {icon}
          {title}
        </div>
        {preferred ? (
          <Badge className="bg-indigo-600 hover:bg-indigo-600">Preferred</Badge>
        ) : null}
      </div>
      <div className="mt-3 font-mono text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}

function AdminHostPayoutSection({
  withdrawal,
}: {
  withdrawal: AdminWithdrawal;
}) {
  const hostPayout = withdrawal.hostPayoutDetails;
  const preferredMethod =
    hostPayout?.primaryMethod ?? resolvePrimaryMethod(hostPayout);
  const showUpi = hasUpiData(hostPayout);
  const showBank = hasBankData(hostPayout);

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <SectionHeader
          icon={<Landmark className="h-4 w-4" />}
          title="Host payout details"
          description="Use live wallet details to pay the host. Try the preferred method first."
        />
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {!hostPayout || (!showUpi && !showBank) ? (
          <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
            No payout details on file for this host.
          </p>
        ) : (
          <div className="space-y-3">
            {showUpi && hasCompleteUpiDetails(hostPayout) ? (
              <PayoutMethodCard
                title="UPI"
                icon={<Smartphone className="h-4 w-4 text-indigo-600" />}
                preferred={preferredMethod === "upi"}
              >
                {hostPayout.upiId ?? "—"}
              </PayoutMethodCard>
            ) : null}

            {showBank && hasCompleteBankDetails(hostPayout) ? (
              <PayoutMethodCard
                title="Bank account"
                icon={<Building2 className="h-4 w-4 text-indigo-600" />}
                preferred={preferredMethod === "bank"}
              >
                <div className="space-y-1">
                  <p>{hostPayout.accountHolderName ?? "—"}</p>
                  <p>{hostPayout.bankName ?? "—"}</p>
                  <p>Account: {hostPayout.accountNumber ?? "—"}</p>
                  <p>IFSC: {hostPayout.ifscCode ?? "—"}</p>
                </div>
              </PayoutMethodCard>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminPaymentRecordSection({
  withdrawal,
}: {
  withdrawal: AdminWithdrawal;
}) {
  const snapshot = withdrawal.payoutSnapshot;

  if (withdrawal.status === "settled" && snapshot) {
    return (
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <SectionHeader
            icon={<FileText className="h-4 w-4" />}
            title="Payment record"
            description="Method used when this withdrawal was settled."
          />
        </CardHeader>
        <CardContent className="pt-5">
          <PayoutMethodCard
            title={`Paid via ${payoutMethodLabel(snapshot.method)}`}
            icon={
              snapshot.method === "upi" ? (
                <Smartphone className="h-4 w-4 text-indigo-600" />
              ) : (
                <Building2 className="h-4 w-4 text-indigo-600" />
              )
            }
            preferred={false}
          >
            {snapshot.method === "upi" ? (
              snapshot.upiId ?? "—"
            ) : (
              <div className="space-y-1">
                <p>{snapshot.accountHolderName ?? "—"}</p>
                <p>{snapshot.bankName ?? "—"}</p>
                <p>Account: {snapshot.accountNumber ?? "—"}</p>
                <p>IFSC: {snapshot.ifscCode ?? "—"}</p>
              </div>
            )}
          </PayoutMethodCard>
        </CardContent>
      </Card>
    );
  }

  if (withdrawal.status !== "settled") {
    return (
      <p className="rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Payment record is saved when you mark this request as settled.
      </p>
    );
  }

  return null;
}

function AdminActivitySection({
  withdrawal,
}: {
  withdrawal: AdminWithdrawal;
}) {
  const addComment = useAddWithdrawalComment();
  const addAttachments = useAddWithdrawalAttachments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment.mutateAsync({
        id: withdrawal._id,
        payload: { message: comment.trim() },
      });
      setComment("");
      toastSuccess("Comment added");
    } catch (error) {
      toastError(error, "Failed to add comment");
    }
  };

  const commentsNewestFirst = [...withdrawal.comments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await storageApi.uploadFile(file, "withdrawalAttachment");
      await addAttachments.mutateAsync({
        id: withdrawal._id,
        payload: { attachments: [url] },
      });
      toastSuccess("Attachment added");
    } catch (error) {
      toastError(error, "Failed to upload attachment");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-center justify-between gap-3">
          <SectionHeader
            icon={<MessageSquare className="h-4 w-4" />}
            title="Activity"
            description="Attachments and internal notes for this request."
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="sr-only"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={uploading || addAttachments.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading || addAttachments.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
              Attach
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {withdrawal.attachments.length > 0 ? (
          <ul className="flex flex-wrap gap-3">
            {withdrawal.attachments.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {isImageAttachment(url) ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-muted shadow-sm ring-1 ring-border/60 transition group-hover:ring-indigo-300">
                      <Image
                        src={url}
                        alt={`Attachment ${i + 1}`}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border bg-muted/50 p-2 text-center text-xs text-muted-foreground shadow-sm ring-1 ring-border/60 transition group-hover:bg-muted group-hover:ring-indigo-300">
                      <FileText className="h-6 w-6 shrink-0" />
                      <span className="font-medium">
                        {isPdfAttachment(url) ? "PDF" : "File"}
                      </span>
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No attachments yet.</p>
        )}

        <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-200">
          <Textarea
            placeholder="Add an internal comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="min-h-0 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleAddComment();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            className="shrink-0 rounded-lg"
            disabled={!comment.trim() || addComment.isPending}
            onClick={handleAddComment}
            aria-label="Send comment"
          >
            {addComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {commentsNewestFirst.length > 0 ? (
          <ul className="space-y-3 border-l-2 border-indigo-100 pl-4">
            {commentsNewestFirst.map((c, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[calc(1rem+5px)] top-2 h-2.5 w-2.5 rounded-full bg-indigo-400 ring-2 ring-background" />
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {userDisplayName(c.addedBy)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(c.createdAt), "MMM d, yyyy · HH:mm")}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {c.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminWithdrawalDetailPanel({ id }: { id: string }) {
  const { data: withdrawal, isLoading, isError } = useAdminWithdrawal(id);
  const updateStatus = useUpdateWithdrawalStatus();

  const [selectedStatus, setSelectedStatus] = useState<WithdrawalStatus | "">("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [paidViaMethod, setPaidViaMethod] = useState<PayoutMethod | "">("");

  const hostPayout = withdrawal?.hostPayoutDetails;
  const canPayViaUpi = hasCompleteUpiDetails(hostPayout);
  const canPayViaBank = hasCompleteBankDetails(hostPayout);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm text-muted-foreground">Loading request…</p>
      </div>
    );
  }

  if (isError || !withdrawal) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
        <p className="text-muted-foreground">Withdrawal request not found.</p>
      </div>
    );
  }

  const allowedNext = getAllowedNextStatuses(withdrawal.status);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    if (selectedStatus === "settled" && !paidViaMethod) return;
    try {
      await updateStatus.mutateAsync({
        id,
        payload: {
          status: selectedStatus,
          rejectionReason:
            selectedStatus === "rejected" ? rejectionReason : undefined,
          paidViaMethod:
            selectedStatus === "settled" && paidViaMethod
              ? paidViaMethod
              : undefined,
        },
      });
      setSelectedStatus("");
      setRejectionReason("");
      setPaidViaMethod("");
      toastSuccess("Status updated");
    } catch (error) {
      toastError(error, "Failed to update status");
    }
  };

  return (
    <div className="space-y-5 pb-2">
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600/80">
              Withdrawal amount
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {formatInr(withdrawal.amount)}
            </p>
          </div>
          <Badge
            variant={withdrawalStatusVariant(withdrawal.status)}
            className="px-3 py-1 text-sm"
          >
            {formatWithdrawalStatus(withdrawal.status)}
          </Badge>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <MetaItem
            icon={<User className="h-4 w-4" />}
            label="Host"
            value={userDisplayName(withdrawal.requestedBy)}
          />
          <MetaItem
            icon={<Calendar className="h-4 w-4" />}
            label="Requested"
            value={format(
              new Date(withdrawal.createdAt),
              "MMM d, yyyy · HH:mm",
            )}
          />
          {withdrawal.reviewedAt ? (
            <MetaItem
              icon={<Clock className="h-4 w-4" />}
              label="Reviewed"
              value={
                <>
                  {format(
                    new Date(withdrawal.reviewedAt),
                    "MMM d, yyyy · HH:mm",
                  )}
                  {withdrawal.reviewedBy
                    ? ` · ${userDisplayName(withdrawal.reviewedBy)}`
                    : ""}
                </>
              }
            />
          ) : null}
        </div>

        {withdrawal.rejectionReason ? (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            <span className="font-medium">Rejection reason:</span>{" "}
            {withdrawal.rejectionReason}
          </div>
        ) : null}
      </div>

      {!TERMINAL_WITHDRAWAL_STATUSES.includes(withdrawal.status) ? (
        <AdminHostPayoutSection withdrawal={withdrawal} />
      ) : null}

      <AdminPaymentRecordSection withdrawal={withdrawal} />

      {allowedNext.length > 0 ? (
        <Card className="overflow-hidden border-indigo-100 shadow-sm ring-1 ring-indigo-50">
          <CardHeader className="border-b bg-indigo-50/40 pb-3">
            <CardTitle className="text-base">Update status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose the next state and apply when ready.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="inline-flex flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
              {allowedNext.map((status) => (
                <StatusPill
                  key={status}
                  active={selectedStatus === status}
                  onClick={() => {
                    setSelectedStatus(status);
                    if (status !== "settled") setPaidViaMethod("");
                  }}
                >
                  {formatWithdrawalStatus(status)}
                </StatusPill>
              ))}
            </div>

            {selectedStatus === "rejected" ? (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection reason</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                  placeholder="Explain why this request was rejected…"
                />
              </div>
            ) : null}

            {selectedStatus === "settled" ? (
              <div className="space-y-2">
                <Label>Paid via (required)</Label>
                <p className="text-xs text-muted-foreground">
                  Record which method you used to pay the host.
                </p>
                <div className="inline-flex flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
                  {(["upi", "bank"] as const).map((method) => {
                    const isComplete =
                      method === "upi" ? canPayViaUpi : canPayViaBank;
                    return (
                      <StatusPill
                        key={method}
                        active={paidViaMethod === method}
                        disabled={!isComplete}
                        onClick={() => setPaidViaMethod(method)}
                      >
                        {payoutMethodLabel(method)}
                      </StatusPill>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={
                !selectedStatus ||
                updateStatus.isPending ||
                (selectedStatus === "rejected" && !rejectionReason.trim()) ||
                (selectedStatus === "settled" && !paidViaMethod)
              }
              onClick={handleStatusUpdate}
            >
              {updateStatus.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Apply status change"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <AdminActivitySection withdrawal={withdrawal} />
    </div>
  );
}

export default function AdminWithdrawalsList({
  onSelectWithdrawal,
}: {
  onSelectWithdrawal: (id: string) => void;
}) {
  const [activeStatus, setActiveStatus] = useState<WithdrawalStatus | undefined>();
  const [userId, setUserId] = useState("");
  const [userIdFilter, setUserIdFilter] = useState<string | undefined>();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteAdminWithdrawals({
    status: activeStatus,
    userId: userIdFilter,
  });

  const withdrawals = flattenPaginatedPages(data?.pages);
  const totalDocuments = data?.pages[0]?.totalDocuments;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Withdrawal requests
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and process host payout requests.
            </p>
          </div>
          {totalDocuments !== undefined && !isLoading ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {totalDocuments}
              </span>{" "}
              total
              {userIdFilter ? " (filtered)" : ""}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by host user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setUserIdFilter(userId.trim() || undefined);
                }
              }}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setUserIdFilter(userId.trim() || undefined)}
          >
            Apply filter
          </Button>
          {userIdFilter ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserId("");
                setUserIdFilter(undefined);
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <div className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-border/60 bg-muted/30 p-1">
          {STATUS_TABS.map((tab) => (
            <StatusPill
              key={tab.label}
              active={activeStatus === tab.status}
              onClick={() => setActiveStatus(tab.status)}
            >
              {tab.label}
            </StatusPill>
          ))}
        </div>
      </div>

      <ScrollableListPanel className="mt-6 min-h-0 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/20 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-muted-foreground">Loading requests…</p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
            <p className="text-muted-foreground">Failed to load withdrawals.</p>
            <Button
              type="button"
              variant="link"
              className="mt-2 text-indigo-600"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <Inbox className="h-7 w-7" />
            </div>
            <p className="mt-4 font-medium text-foreground">
              No withdrawal requests
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {activeStatus || userIdFilter
                ? "Try a different filter or status tab."
                : "New host withdrawal requests will appear here."}
            </p>
          </div>
        ) : (
          <div className="pb-4">
            <Card className="overflow-hidden border-border/60 py-0 shadow-sm">
              <CardContent className="p-0">
                {withdrawals.map((w) => (
                  <AdminWithdrawalRow
                    key={w._id}
                    withdrawal={w}
                    onSelect={onSelectWithdrawal}
                  />
                ))}
              </CardContent>
            </Card>
            <InfiniteScrollSentinel
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={() => fetchNextPage()}
              isError={isFetchNextPageError}
              onRetry={() => fetchNextPage()}
            />
          </div>
        )}
      </ScrollableListPanel>
    </div>
  );
}
