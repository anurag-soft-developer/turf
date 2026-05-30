"use client";

import { adminWithdrawalDrawerUrl } from "@/app/host/_lib/wallet-drawer-urls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatInr } from "@/lib/utils/currency";
import {
  userDisplayName,
  withdrawalStatusVariant,
} from "@/lib/utils/withdrawal-display";
import {
  useAddWithdrawalAttachments,
  useAddWithdrawalComment,
  useAdminWithdrawal,
  useAdminWithdrawals,
  useUpdateWithdrawalStatus,
} from "@/modules/platform-admin/hooks/use-admin-withdrawals";
import {
  formatWithdrawalStatus,
  getAllowedNextStatuses,
} from "@/modules/platform-admin/schemas/withdrawal-admin";
import type { Withdrawal, WithdrawalStatus } from "@/types/withdrawal";
import { format } from "date-fns";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const STATUS_TABS: { label: string; status?: WithdrawalStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "Processing", status: "processing" },
  { label: "Settled", status: "settled" },
  { label: "Rejected", status: "rejected" },
  { label: "Cancelled", status: "cancelled" },
];

function AdminWithdrawalRow({ withdrawal }: { withdrawal: Withdrawal }) {
  return (
    <Link href={adminWithdrawalDrawerUrl(withdrawal._id)} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">
                {formatInr(withdrawal.amount)}
              </p>
              <Badge variant={withdrawalStatusVariant(withdrawal.status)}>
                {withdrawal.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {userDisplayName(withdrawal.requestedBy)} ·{" "}
              {format(new Date(withdrawal.createdAt), "MMM d, yyyy · HH:mm")}
            </p>
            {withdrawal.reviewedBy ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Reviewed by {userDisplayName(withdrawal.reviewedBy)}
              </p>
            ) : null}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}

export function AdminWithdrawalDetailPanel({ id }: { id: string }) {
  const { data: withdrawal, isLoading, isError } = useAdminWithdrawal(id);
  const updateStatus = useUpdateWithdrawalStatus();
  const addComment = useAddWithdrawalComment();
  const addAttachments = useAddWithdrawalAttachments();

  const [selectedStatus, setSelectedStatus] = useState<WithdrawalStatus | "">("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [comment, setComment] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !withdrawal) {
    return <p className="text-muted-foreground">Withdrawal request not found.</p>;
  }

  const allowedNext = getAllowedNextStatuses(withdrawal.status);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    await updateStatus.mutateAsync({
      id,
      payload: {
        status: selectedStatus,
        rejectionReason:
          selectedStatus === "rejected" ? rejectionReason : undefined,
      },
    });
    setSelectedStatus("");
    setRejectionReason("");
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await addComment.mutateAsync({ id, payload: { message: comment.trim() } });
    setComment("");
  };

  const handleAddAttachment = async () => {
    if (!attachmentUrl.trim()) return;
    try {
      new URL(attachmentUrl.trim());
    } catch {
      return;
    }
    await addAttachments.mutateAsync({
      id,
      payload: { attachments: [attachmentUrl.trim()] },
    });
    setAttachmentUrl("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-2 pt-6 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold">{formatInr(withdrawal.amount)}</p>
            <Badge variant={withdrawalStatusVariant(withdrawal.status)}>
              {withdrawal.status}
            </Badge>
          </div>
          <p>
            <span className="font-medium">Host:</span>{" "}
            {userDisplayName(withdrawal.requestedBy)}
          </p>
          <p>
            <span className="font-medium">Requested:</span>{" "}
            {format(new Date(withdrawal.createdAt), "MMM d, yyyy HH:mm")}
          </p>
          {withdrawal.rejectionReason ? (
            <p className="text-destructive">
              <span className="font-medium">Rejection reason:</span>{" "}
              {withdrawal.rejectionReason}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {allowedNext.length > 0 ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Label>Update status</Label>
            <div className="flex flex-wrap gap-2">
              {allowedNext.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
                    selectedStatus === status
                      ? "bg-indigo-600 text-white ring-indigo-600"
                      : "bg-white text-gray-700 ring-gray-200"
                  }`}
                >
                  {formatWithdrawalStatus(status)}
                </button>
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
                />
              </div>
            ) : null}
            <Button
              type="button"
              disabled={
                !selectedStatus ||
                updateStatus.isPending ||
                (selectedStatus === "rejected" && !rejectionReason.trim())
              }
              onClick={handleStatusUpdate}
            >
              {updateStatus.isPending ? "Updating…" : "Apply status change"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Label htmlFor="comment">Add comment</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!comment.trim() || addComment.isPending}
            onClick={handleAddComment}
          >
            {addComment.isPending ? "Adding…" : "Add comment"}
          </Button>
        </CardContent>
      </Card>

      {withdrawal.comments.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Comments</p>
          {withdrawal.comments.map((c, i) => (
            <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm">
              <p className="font-medium">{userDisplayName(c.addedBy)}</p>
              <p className="text-muted-foreground">
                {format(new Date(c.createdAt), "MMM d, yyyy HH:mm")}
              </p>
              <p className="mt-1">{c.message}</p>
            </div>
          ))}
        </div>
      ) : null}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Label htmlFor="attachmentUrl">Add attachment URL</Label>
          <Input
            id="attachmentUrl"
            type="url"
            placeholder="https://..."
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!attachmentUrl.trim() || addAttachments.isPending}
            onClick={handleAddAttachment}
          >
            {addAttachments.isPending ? "Adding…" : "Add attachment"}
          </Button>
        </CardContent>
      </Card>

      {withdrawal.attachments.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Attachments</p>
          {withdrawal.attachments.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm text-indigo-600 underline"
            >
              {url}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminWithdrawalsList() {
  const [activeStatus, setActiveStatus] = useState<WithdrawalStatus | undefined>();
  const [userId, setUserId] = useState("");
  const [userIdFilter, setUserIdFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, refetch } = useAdminWithdrawals({
    status: activeStatus,
    userId: userIdFilter,
    page,
    limit,
  });

  const withdrawals = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Withdrawal requests</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and process host withdrawal requests.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Filter by host user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="max-w-xs"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setUserIdFilter(userId.trim() || undefined);
            setPage(1);
          }}
        >
          Apply filter
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => {
              setActiveStatus(tab.status);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
              activeStatus === tab.status
                ? "bg-indigo-600 text-white ring-indigo-600"
                : "bg-white text-gray-700 ring-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : isError ? (
        <p className="text-center text-muted-foreground">
          Failed to load withdrawals.{" "}
          <button
            type="button"
            className="text-indigo-600 underline"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      ) : withdrawals.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No withdrawal requests found.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {withdrawals.map((w) => (
            <AdminWithdrawalRow key={w._id} withdrawal={w} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
