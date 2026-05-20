"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHostTurf } from "@/modules/host/hooks/use-my-turfs";
import { useDeleteTurf } from "@/modules/host/hooks/use-turf-mutations";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { turfDrawerUrl } from "@/app/host/_lib/drawer-urls";
import Link from "next/link";
import { useState } from "react";

interface TurfDetailPanelProps {
  id: string;
}

export default function TurfDetailPanel({ id }: TurfDetailPanelProps) {
  const { data: turf, isLoading, isError } = useHostTurf(id);
  const deleteMutation = useDeleteTurf();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !turf) {
    return <p className="text-muted-foreground">Turf not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{turf.name}</h2>
          <p className="text-muted-foreground">{turf.location?.address}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={turfDrawerUrl(id, "edit")}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          {!confirmDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(id)}
            >
              Confirm delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{turf.description}</p>
          <p>
            <span className="font-medium">Sports:</span>{" "}
            {turf.sportType?.join(", ")}
          </p>
          <p>
            <span className="font-medium">Price:</span> ₹
            {turf.pricing?.basePricePerHour}/hr
          </p>
          <p>
            <span className="font-medium">Hours:</span>{" "}
            {turf.operatingHours?.open} – {turf.operatingHours?.close}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {turf.isAvailable ? "Available" : "Unavailable"}
          </p>
        </CardContent>
      </Card>

      {turf.images && turf.images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {turf.images.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              className="h-32 w-32 rounded-lg object-cover ring-1 ring-gray-200"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
