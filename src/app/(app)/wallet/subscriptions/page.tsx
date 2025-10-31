"use client";

import { PageHeader } from "@/components/ui/layout/PageHeader";

export default function SubscriptionsPage() {
    return (
        <section className="space-y-4">
            <PageHeader
            title="Choose Your Plan"
            subtitle="Select the perfect plan for your needs. Upgrade or downgrade anytime."
            backLink="/wallet"
            />
        </section>
    )
}