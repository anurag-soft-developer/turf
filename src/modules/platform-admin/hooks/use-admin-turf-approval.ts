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
  adminTurfApprovalApi,
  type PendingTurfsParams,
} from "../api/turf-approval";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type { ReviewTurfPayload } from "@/types/turf";

const DEFAULT_PENDING_TURFS_LIMIT = 20;

export function useInfiniteAdminPendingTurfs(
  params: Omit<PendingTurfsParams, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_PENDING_TURFS_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminPendingTurfs(filters),
    queryFn: ({ pageParam }) =>
      adminTurfApprovalApi.listPending({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useAdminTurf(id: string) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTurf(id),
    queryFn: () => adminTurfApprovalApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useReviewTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewTurfPayload;
    }) => adminTurfApprovalApi.review(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["platform-admin", "pending-turfs"],
      });
      queryClient.invalidateQueries({
        queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminTurf(id),
      });
    },
    onError: (error) =>
      toastError(error, "Failed to review turf. Please try again."),
  });
}
