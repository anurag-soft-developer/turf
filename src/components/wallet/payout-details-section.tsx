"use client";

import { useState } from "react";
import PayoutDetailsForm from "./payout-details-form";
import PayoutDetailsView from "./payout-details-view";

export default function PayoutDetailsSection() {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <PayoutDetailsForm
        onSaved={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return <PayoutDetailsView onEdit={() => setIsEditing(true)} />;
}
