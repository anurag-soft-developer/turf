import type { PaginatedResponse } from "@/types/common";

export function getNextPageParamFromPaginated<T>(
  lastPage: PaginatedResponse<T>,
): number | undefined {
  return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
}

export function flattenPaginatedPages<T>(
  pages: PaginatedResponse<T>[] | undefined,
): T[] {
  return pages?.flatMap((page) => page.data) ?? [];
}
