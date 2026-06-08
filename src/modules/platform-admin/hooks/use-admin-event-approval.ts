"use client";

import { toastError } from "@/lib/toast";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import {
  adminEventApprovalApi,
  type PendingEventsParams,
} from "../api/event-approval";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type { ReviewEventPayload } from "@/modules/host/types/event";

const DEFAULT_PENDING_EVENTS_LIMIT = 20;

export function useInfiniteAdminPendingEvents(
  params: Omit<PendingEventsParams, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_PENDING_EVENTS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminPendingEvents(filters),
    queryFn: ({ pageParam }) =>
      adminEventApprovalApi.listPending({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useAdminEvent(id: string) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminEvent(id),
    queryFn: () => adminEventApprovalApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useReviewEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewEventPayload;
    }) => adminEventApprovalApi.review(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["platform-admin", "pending-events"],
      });
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminEvent(id),
      });
    },
    onError: (error) =>
      toastError(error, "Failed to review event. Please try again."),
  });
}
