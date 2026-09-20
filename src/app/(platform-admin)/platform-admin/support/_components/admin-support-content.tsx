"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InfiniteScrollSentinel } from "@/components/infinite-scroll/infinite-scroll-sentinel";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { flattenPaginatedPages } from "@/lib/query/paginated-infinite";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { userDisplayName } from "@/lib/utils/withdrawal-display";
import {
  useAddSupportInternalNote,
  useAddSupportReply,
  useAdminSupportQuery,
  useInfiniteAdminSupportQueries,
  useUpdateSupportQueryStatus,
} from "@/modules/platform-admin/hooks/use-admin-support";
import {
  formatSupportStatus,
  getNextSupportStatuses,
  queryContact,
  supportStatusVariant,
} from "@/modules/platform-admin/schemas/support-admin";
import type { SupportQuery, SupportQueryStatus } from "@/types/support";
import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Clock,
  Inbox,
  LifeBuoy,
  Loader2,
  Mail,
  MessageSquare,
  NotebookPen,
  Phone,
  Search,
  Send,
  User,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const STATUS_TABS: { label: string; status?: SupportQueryStatus }[] = [
  { label: "All" },
  { label: "Open", status: "open" },
  { label: "In progress", status: "in_progress" },
  { label: "Resolved", status: "resolved" },
];

function StatusPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-muted-foreground hover:bg-background hover:text-foreground",
      )}
    >
      {children}
    </button>
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

function AdminSupportRow({
  query,
  onSelect,
}: {
  query: SupportQuery;
  onSelect: (id: string) => void;
}) {
  const isOpen = query.status === "open";

  return (
    <button
      type="button"
      onClick={() => onSelect(query._id)}
      className="group flex w-full items-center gap-4 border-b border-border/60 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-indigo-50/40"
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          isOpen
            ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200/80"
            : "bg-indigo-50 text-indigo-600",
        )}
      >
        <LifeBuoy className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-base font-semibold text-foreground">
            {query.subject}
          </p>
          <Badge variant={supportStatusVariant(query.status)}>
            {formatSupportStatus(query.status)}
          </Badge>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {userDisplayName(query.userId)}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="inline-flex items-center gap-1">
            {query.email ? (
              <Mail className="h-3.5 w-3.5" />
            ) : (
              <Phone className="h-3.5 w-3.5" />
            )}
            {queryContact(query)}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {format(new Date(query.createdAt), "MMM d, yyyy · HH:mm")}
          </span>
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" />
    </button>
  );
}

function Composer({
  placeholder,
  disabled,
  pending,
  onSubmit,
}: {
  placeholder: string;
  disabled?: boolean;
  pending: boolean;
  onSubmit: (body: string) => Promise<void>;
}) {
  const [body, setBody] = useState("");

  const submit = async () => {
    if (!body.trim() || disabled) return;
    await onSubmit(body.trim());
    setBody("");
  };

  return (
    <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-200">
      <Textarea
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        disabled={disabled}
        className="min-h-0 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
      />
      <Button
        type="button"
        size="icon"
        className="shrink-0 rounded-lg"
        disabled={!body.trim() || pending || disabled}
        onClick={() => void submit()}
        aria-label="Send"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

function AdminSupportThread({ query }: { query: SupportQuery }) {
  const addReply = useAddSupportReply();
  const resolved = query.status === "resolved";
  const replies = [...query.replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleReply = async (body: string) => {
    try {
      await addReply.mutateAsync({ id: query._id, payload: { body } });
      toastSuccess("Reply sent");
    } catch (error) {
      toastError(error, "Failed to send reply");
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          Thread
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {userDisplayName(query.userId)}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(query.createdAt), "MMM d, yyyy · HH:mm")}
            </p>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {query.message}
          </p>
        </div>

        {replies.map((reply, index) => {
          const isAdmin = reply.authorRole === "platform_admin";
          return (
            <div
              key={reply._id ?? `${reply.createdAt}-${index}`}
              className={cn(
                "rounded-xl border p-3",
                isAdmin
                  ? "border-indigo-100 bg-indigo-50/50"
                  : "border-border/60 bg-muted/30",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {userDisplayName(reply.authorId)}
                  {isAdmin ? (
                    <span className="ml-2 text-xs font-medium text-indigo-600">
                      Admin
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(reply.createdAt), "MMM d, yyyy · HH:mm")}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {reply.body}
              </p>
            </div>
          );
        })}

        {resolved ? (
          <p className="rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Reopen this query to send another reply.
          </p>
        ) : (
          <Composer
            placeholder="Reply to the user…"
            pending={addReply.isPending}
            onSubmit={handleReply}
          />
        )}
      </CardContent>
    </Card>
  );
}

function AdminSupportNotes({ query }: { query: SupportQuery }) {
  const addNote = useAddSupportInternalNote();
  const notes = [...(query.internalNotes ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleNote = async (body: string) => {
    try {
      await addNote.mutateAsync({ id: query._id, payload: { body } });
      toastSuccess("Internal note added");
    } catch (error) {
      toastError(error, "Failed to add note");
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <NotebookPen className="h-4 w-4 text-indigo-600" />
          Internal notes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visible only to platform admins.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <Composer
          placeholder="Add an internal note…"
          pending={addNote.isPending}
          onSubmit={handleNote}
        />
        {notes.length > 0 ? (
          <ul className="space-y-3">
            {notes.map((note, index) => (
              <li
                key={note._id ?? `${note.createdAt}-${index}`}
                className="rounded-xl border border-border/60 bg-muted/30 p-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {userDisplayName(note.authorId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(note.createdAt), "MMM d, yyyy · HH:mm")}
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No internal notes yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminSupportDetailPanel({ id }: { id: string }) {
  const { data: query, isLoading, isError } = useAdminSupportQuery(id);
  const updateStatus = useUpdateSupportQueryStatus();
  const [selectedStatus, setSelectedStatus] = useState<SupportQueryStatus | "">(
    "",
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm text-muted-foreground">Loading query…</p>
      </div>
    );
  }

  if (isError || !query) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
        <p className="text-muted-foreground">Support query not found.</p>
      </div>
    );
  }

  const allowedNext = getNextSupportStatuses(query.status);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    try {
      await updateStatus.mutateAsync({
        id,
        payload: { status: selectedStatus },
      });
      setSelectedStatus("");
      toastSuccess("Status updated");
    } catch (error) {
      toastError(error, "Failed to update status");
    }
  };

  return (
    <div className="space-y-5 pb-2">
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600/80">
              Subject
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
              {query.subject}
            </p>
          </div>
          <Badge
            variant={supportStatusVariant(query.status)}
            className="px-3 py-1 text-sm"
          >
            {formatSupportStatus(query.status)}
          </Badge>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <MetaItem
            icon={<User className="h-4 w-4" />}
            label="User"
            value={userDisplayName(query.userId)}
          />
          <MetaItem
            icon={
              query.email ? (
                <Mail className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )
            }
            label={query.email ? "Email" : "Phone"}
            value={queryContact(query)}
          />
          <MetaItem
            icon={<Calendar className="h-4 w-4" />}
            label="Created"
            value={format(new Date(query.createdAt), "MMM d, yyyy · HH:mm")}
          />
          {query.resolvedAt ? (
            <MetaItem
              icon={<Clock className="h-4 w-4" />}
              label="Resolved"
              value={
                <>
                  {format(new Date(query.resolvedAt), "MMM d, yyyy · HH:mm")}
                  {query.resolvedBy
                    ? ` · ${userDisplayName(query.resolvedBy)}`
                    : ""}
                </>
              }
            />
          ) : null}
        </div>
      </div>

      {allowedNext.length > 0 ? (
        <Card className="overflow-hidden border-indigo-100 shadow-sm ring-1 ring-indigo-50">
          <CardHeader className="border-b bg-indigo-50/40 pb-3">
            <CardTitle className="text-base">Update status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Mark progress or resolve this query.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="inline-flex flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
              {allowedNext.map((status) => (
                <StatusPill
                  key={status}
                  active={selectedStatus === status}
                  onClick={() => setSelectedStatus(status)}
                >
                  {formatSupportStatus(status)}
                </StatusPill>
              ))}
            </div>
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={!selectedStatus || updateStatus.isPending}
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

      <AdminSupportThread query={query} />
      <AdminSupportNotes query={query} />
    </div>
  );
}

export default function AdminSupportList({
  onSelectQuery,
}: {
  onSelectQuery: (id: string) => void;
}) {
  const [activeStatus, setActiveStatus] = useState<
    SupportQueryStatus | undefined
  >();
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState<string | undefined>();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteAdminSupportQueries({
    status: activeStatus,
    query: searchFilter,
  });

  const queries = flattenPaginatedPages(data?.pages);
  const totalDocuments = data?.pages[0]?.totalDocuments;

  const applySearch = () => setSearchFilter(search.trim() || undefined);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Support queries
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track, reply, and resolve user help requests.
            </p>
          </div>
          {totalDocuments !== undefined && !isLoading ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {totalDocuments}
              </span>{" "}
              total
              {searchFilter ? " (filtered)" : ""}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subject, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
              className="pl-9"
            />
          </div>
          <Button type="button" variant="secondary" onClick={applySearch}>
            Apply filter
          </Button>
          {searchFilter ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setSearchFilter(undefined);
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
            <p className="text-sm text-muted-foreground">Loading queries…</p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
            <p className="text-muted-foreground">Failed to load queries.</p>
            <Button
              type="button"
              variant="link"
              className="mt-2 text-indigo-600"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <Inbox className="h-7 w-7" />
            </div>
            <p className="mt-4 font-medium text-foreground">No support queries</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {activeStatus || searchFilter
                ? "Try a different filter or status tab."
                : "New help requests from the app will appear here."}
            </p>
          </div>
        ) : (
          <div className="pb-4">
            <Card className="overflow-hidden border-border/60 py-0 shadow-sm">
              <CardContent className="p-0">
                {queries.map((query) => (
                  <AdminSupportRow
                    key={query._id}
                    query={query}
                    onSelect={onSelectQuery}
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
