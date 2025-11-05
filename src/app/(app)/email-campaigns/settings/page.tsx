"use client";

import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/layout/PageHeader";

export default function CampaignSettings() {
    return (
        <Card>
            <PageHeader title="Campaign settings" backLink="/email-campaigns/ai/generate-email" />
        </Card>
    )
}