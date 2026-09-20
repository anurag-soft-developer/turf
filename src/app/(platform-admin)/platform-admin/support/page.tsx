"use client";

import { MyDrawer } from "@/components/my-drawer";
import { useState } from "react";
import {
  AdminSupportDetailPanel,
  default as AdminSupportList,
} from "./_components/admin-support-content";

export default function PlatformAdminSupportPage() {
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openQuery = (id: string) => {
    setSelectedQueryId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedQueryId(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <AdminSupportList onSelectQuery={openQuery} />

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Support query"
        onClose={handleDrawerClose}
      >
        {selectedQueryId ? (
          <AdminSupportDetailPanel id={selectedQueryId} />
        ) : null}
      </MyDrawer>
    </>
  );
}
