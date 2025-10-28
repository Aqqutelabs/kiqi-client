"use client";

import { useState } from "react";
import FormOne from "./form-one";
import FormTwo from "./form-two";

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [1, 2];
  return (
    <>
      {activeTab === 1 && (
        <FormOne activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      )}
      {activeTab === 2 && (
        <FormTwo activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      )}
    </>
  );
}
