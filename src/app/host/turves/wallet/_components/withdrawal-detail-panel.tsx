"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils/currency";
import {
  userDisplayName,
  withdrawalStatusVariant,
} from "@/lib/utils/withdrawal-display";
import { useWithdrawal } from "@/modules/host/hooks/use-withdrawals";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface WithdrawalDetailPanelProps {
  id: string;
}

export default function WithdrawalDetailPanel({ id }: WithdrawalDetailPanelProps) {
  const { data: withdrawal, isLoading, isError } = useWithdrawal(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !withdrawal) {
    return <p className="text-muted-foreground">Withdrawal request not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{formatInr(withdrawal.amount)}</CardTitle>
            <Badge variant={withdrawalStatusVariant(withdrawal.status)}>
              {withdrawal.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Requested:</span>{" "}
            {format(new Date(withdrawal.createdAt), "MMM d, yyyy HH:mm")}
          </p>
          {withdrawal.reviewedAt ? (
            <p>
              <span className="font-medium">Reviewed:</span>{" "}
              {format(new Date(withdrawal.reviewedAt), "MMM d, yyyy HH:mm")}
              {withdrawal.reviewedBy
                ? ` by ${userDisplayName(withdrawal.reviewedBy)}`
                : ""}
            </p>
          ) : null}
          {withdrawal.processedAt ? (
            <p>
              <span className="font-medium">Processed:</span>{" "}
              {format(new Date(withdrawal.processedAt), "MMM d, yyyy HH:mm")}
            </p>
          ) : null}
          {withdrawal.rejectionReason ? (
            <p className="text-destructive">
              <span className="font-medium">Rejection reason:</span>{" "}
              {withdrawal.rejectionReason}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {withdrawal.comments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {withdrawal.comments.map((comment, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="font-medium">{userDisplayName(comment.addedBy)}</p>
                <p className="text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
                </p>
                <p className="mt-1">{comment.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {withdrawal.attachments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
