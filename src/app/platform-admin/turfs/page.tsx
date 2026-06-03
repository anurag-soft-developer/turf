"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useState } from "react";
import {
  AdminTurfApprovalDetailPanel,
  default as AdminTurfApprovalsList,
} from "./_components/admin-turf-approval-content";

export default function PlatformAdminTurfsPage() {
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openTurf = (id: string) => {
    setSelectedTurfId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedTurfId(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <AdminTurfApprovalsList onSelectTurf={openTurf} />

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Turf approval"
        onClose={handleDrawerClose}
      >
        {selectedTurfId ? (
          <AdminTurfApprovalDetailPanel
            id={selectedTurfId}
            onReviewSuccess={handleDrawerClose}
          />
        ) : null}
      </MyDrawer>
    </>
  );
}
