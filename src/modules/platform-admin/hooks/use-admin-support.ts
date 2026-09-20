"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getNextPageParamFromPaginated } from "@/lib/query/paginated-infinite";
import { adminSupportApi } from "../api/support";
import { PLATFORM_ADMIN_QUERY_KEYS } from "../constants/query-keys";
import type {
  AddSupportInternalNotePayload,
  AddSupportReplyPayload,
  SupportQueriesFilter,
  UpdateSupportQueryStatusPayload,
} from "@/types/support";

const DEFAULT_SUPPORT_LIMIT = 20;

export function useInfiniteAdminSupportQueries(
  params: Omit<SupportQueriesFilter, "page"> = {},
) {
  const limit = params.limit ?? DEFAULT_SUPPORT_LIMIT;
  const filters = { ...params, limit };

  return useInfiniteQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminSupportQueries(filters),
    queryFn: ({ pageParam }) =>
      adminSupportApi.listAdminQueries({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPageParamFromPaginated,
  });
}

export function useAdminSupportQuery(id: string) {
  return useQuery({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminSupportQuery(id),
    queryFn: () => adminSupportApi.getById(id),
    enabled: Boolean(id),
  });
}

function invalidateSupportQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) {
  queryClient.invalidateQueries({
    queryKey: ["platform-admin", "support-queries"],
  });
  queryClient.invalidateQueries({
    queryKey: PLATFORM_ADMIN_QUERY_KEYS.adminSupportQuery(id),
  });
}

export function useAddSupportReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddSupportReplyPayload;
    }) => adminSupportApi.addReply(id, payload),
    onSuccess: (_, { id }) => invalidateSupportQueries(queryClient, id),
  });
}

export function useAddSupportInternalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddSupportInternalNotePayload;
    }) => adminSupportApi.addInternalNote(id, payload),
    onSuccess: (_, { id }) => invalidateSupportQueries(queryClient, id),
  });
}

export function useUpdateSupportQueryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSupportQueryStatusPayload;
    }) => adminSupportApi.updateStatus(id, payload),
    onSuccess: (_, { id }) => invalidateSupportQueries(queryClient, id),
  });
}
