"use client";

import { MyDrawer } from "@/components/my-drawer";
import {
  TermsAndConditionsKind,
  type TermsAndConditionsKindType,
} from "@/types/terms-and-conditions";
import { useState } from "react";
import {
  AdminTermsDetailPanel,
  AdminTermsDraftForm,
  default as AdminTermsList,
} from "./_components/admin-terms-content";

export default function PlatformAdminTermsPage() {
  const [kind, setKind] = useState<TermsAndConditionsKindType>(
    TermsAndConditionsKind.TURF_OWNER,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openVersion = (id: string) => {
    setCreating(false);
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const openCreate = () => {
    setSelectedId(null);
    setCreating(true);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedId(null);
    setCreating(false);
    setDrawerOpen(false);
  };

  return (
    <>
      <AdminTermsList
        kind={kind}
        onKindChange={setKind}
        onSelect={openVersion}
        onCreate={openCreate}
      />

      <MyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={creating ? "New draft" : "Terms and conditions"}
        onClose={handleDrawerClose}
      >
        {creating ? (
          <AdminTermsDraftForm
            kind={kind}
            onKindChange={setKind}
            onCancel={handleDrawerClose}
            onSaved={handleDrawerClose}
          />
        ) : selectedId ? (
          <AdminTermsDetailPanel id={selectedId} kind={kind} />
        ) : null}
      </MyDrawer>
    </>
  );
}
