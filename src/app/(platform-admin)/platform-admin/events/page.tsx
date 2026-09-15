"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useState } from "react";
import {
  AdminEventApprovalDetailPanel,
  default as AdminEventApprovalsList,
} from "./_components/admin-event-approval-content";

export default function PlatformAdminEventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openEvent = (id: string) => {
    setSelectedEventId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedEventId(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <AdminEventApprovalsList onSelectEvent={openEvent} />

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Event approval"
        onClose={handleDrawerClose}
      >
        {selectedEventId ? (
          <AdminEventApprovalDetailPanel
            id={selectedEventId}
            onReviewSuccess={handleDrawerClose}
          />
        ) : null}
      </MyDrawer>
    </>
  );
}
