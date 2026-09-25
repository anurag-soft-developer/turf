"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DrawerFooter } from "@/components/my-drawer";
import { ScrollableListPanel } from "@/components/infinite-scroll/scrollable-list-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastSuccess } from "@/lib/toast";
import { userDisplayName } from "@/lib/utils/withdrawal-display";
import {
  useAdminTerms,
  useCreateTermsDraft,
  usePublishTerms,
  useUpdateTermsDraft,
} from "@/modules/platform-admin/hooks/use-admin-terms";
import {
  TermsAndConditionsKind,
  type TermsAndConditions,
} from "@/types/terms-and-conditions";
import { format } from "date-fns";
import {
  ChevronRight,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";

const KIND = TermsAndConditionsKind.TURF_OWNER;

const emptyForm = {
  version: "",
  title: "",
  content: "",
};

function latestPublishedId(documents: TermsAndConditions[]) {
  const published = documents.filter((doc) => doc.status === "published");
  published.sort((a, b) => {
    const publishedAtCompare = (b.publishedAt ?? "").localeCompare(
      a.publishedAt ?? "",
    );
    if (publishedAtCompare !== 0) return publishedAtCompare;
    return b._id.localeCompare(a._id);
  });
  return published[0]?._id;
}

function actorLabel(actor: TermsAndConditions["createdBy"] | undefined) {
  if (!actor) return "—";
  return userDisplayName(actor);
}

function TermsDraftForm({
  editingId,
  initial = emptyForm,
  onCancel,
  onSaved,
}: {
  editingId?: string;
  initial?: { version: string; title: string; content: string };
  onCancel?: () => void;
  onSaved: () => void;
}) {
  const createDraft = useCreateTermsDraft(KIND);
  const updateDraft = useUpdateTermsDraft(KIND);
  const [form, setForm] = useState(initial);
  const saving = createDraft.isPending || updateDraft.isPending;
  const formReady =
    form.version.trim().length > 0 &&
    form.title.trim().length > 0 &&
    form.content.trim().length > 0;

  const saveDraft = () => {
    if (!formReady) return;
    const payload = {
      version: form.version.trim(),
      title: form.title.trim(),
      content: form.content.trim(),
    };

    if (editingId) {
      updateDraft.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            toastSuccess("Draft updated.");
            onSaved();
          },
        },
      );
      return;
    }

    createDraft.mutate(
      { kind: KIND, ...payload },
      {
        onSuccess: () => {
          toastSuccess("Draft saved.");
          onSaved();
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="terms-kind">Audience</Label>
            <select
              id="terms-kind"
              value={KIND}
              disabled
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              <option value={KIND}>Turf owner</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="terms-version">Version label</Label>
            <Input
              id="terms-version"
              value={form.version}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  version: event.target.value,
                }))
              }
              placeholder="2026-09"
              maxLength={100}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="terms-title">Title</Label>
          <Input
            id="terms-title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="Turf owner terms"
            maxLength={200}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="terms-content">Content</Label>
          <Textarea
            id="terms-content"
            value={form.content}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                content: event.target.value,
              }))
            }
            rows={10}
            placeholder="Write the terms owners must accept before submitting a turf."
            className="min-h-48"
          />
        </div>
      </div>
      <DrawerFooter>
        <div className="flex flex-wrap justify-end gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button
            type="button"
            onClick={saveDraft}
            disabled={!formReady || saving}
            className="gap-1.5"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {editingId ? "Save changes" : "Save draft"}
          </Button>
        </div>
      </DrawerFooter>
    </>
  );
}

export function AdminTermsDraftForm({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) {
  return <TermsDraftForm onCancel={onCancel} onSaved={onSaved} />;
}

export function AdminTermsDetailPanel({ id }: { id: string }) {
  const { data: documents = [], isLoading } = useAdminTerms(KIND);
  const publishTerms = usePublishTerms(KIND);
  const [editing, setEditing] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const doc = documents.find((item) => item._id === id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!doc) {
    return <p className="text-muted-foreground">Terms version not found.</p>;
  }

  if (editing && doc.status === "draft") {
    return (
      <TermsDraftForm
        editingId={doc._id}
        initial={{
          version: doc.version,
          title: doc.title,
          content: doc.content,
        }}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const isDraft = doc.status === "draft";

  return (
    <>
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{doc.title}</h2>
            <Badge variant="outline">{doc.version}</Badge>
            <Badge variant={isDraft ? "secondary" : "default"}>
              {isDraft ? "Draft" : "Published"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created by {actorLabel(doc.createdBy)}
            {doc.status === "published"
              ? ` · Published by ${actorLabel(doc.publishedBy)}`
              : ""}
            {doc.publishedAt
              ? ` · ${format(new Date(doc.publishedAt), "MMM d, yyyy · HH:mm")}`
              : ` · ${format(new Date(doc.createdAt), "MMM d, yyyy · HH:mm")}`}
          </p>
        </div>

        <div className="whitespace-pre-wrap rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
          {doc.content}
        </div>
      </div>

      {isDraft ? (
        <DrawerFooter>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              onClick={() => setPublishOpen(true)}
            >
              <Send className="h-3.5 w-3.5" />
              Publish
            </Button>
          </div>
        </DrawerFooter>
      ) : null}

      <ConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publish this version?"
        description={`${doc.title} (${doc.version}) will become the current turf owner terms. Published text cannot be edited.`}
        confirmLabel={publishTerms.isPending ? "Publishing…" : "Publish"}
        loading={publishTerms.isPending}
        onConfirm={() => {
          publishTerms.mutate(doc._id, {
            onSuccess: () => {
              toastSuccess("Terms published.");
              setPublishOpen(false);
            },
          });
        }}
      />
    </>
  );
}

function AdminTermsRow({
  doc,
  isCurrent,
  onSelect,
}: {
  doc: TermsAndConditions;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}) {
  const isDraft = doc.status === "draft";

  return (
    <button
      type="button"
      onClick={() => onSelect(doc._id)}
      className="block w-full text-left"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 pt-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold text-gray-900">{doc.title}</p>
              <Badge variant="outline">{doc.version}</Badge>
              <Badge variant={isDraft ? "secondary" : "default"}>
                {isDraft ? "Draft" : "Published"}
              </Badge>
              {isCurrent ? (
                <Badge className="bg-indigo-600 text-white">Current</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {isDraft
                ? `Created by ${actorLabel(doc.createdBy)}`
                : `Published by ${actorLabel(doc.publishedBy)}`}
              {" · "}
              {format(
                new Date(isDraft ? doc.createdAt : (doc.publishedAt ?? doc.createdAt)),
                "MMM d, yyyy · HH:mm",
              )}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </button>
  );
}

export default function AdminTermsList({
  onSelect,
  onCreate,
}: {
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  const { data: documents = [], isLoading, isError, refetch } = useAdminTerms(KIND);
  const currentId = useMemo(() => latestPublishedId(documents), [documents]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Terms and conditions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft and publish the terms turf owners accept.
          </p>
        </div>
        <Button type="button" onClick={onCreate} className="shrink-0 gap-1.5">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <ScrollableListPanel className="mt-6 min-h-0 flex-1">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Failed to load terms versions.{" "}
              <button
                type="button"
                className="text-indigo-600 underline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300" />
              <div>
                <p className="font-semibold text-gray-900">No terms yet</p>
                <p className="text-sm text-muted-foreground">
                  Save a draft, then publish it for turf owners.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {documents.map((doc) => (
              <AdminTermsRow
                key={doc._id}
                doc={doc}
                isCurrent={doc._id === currentId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </ScrollableListPanel>
    </div>
  );
}
