"use client";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Check, Gem } from "lucide-react";
import { useState } from "react";

type Subscriptions = {
  id: string;
  plan: "Starter" | "Enterprise" | "Professional";
  description: string;
  price: string;
  altGoC: string;
  perks: string[];
};

export default function SubscriptionsPage() {
  const subscriptions: Subscriptions[] = [
    {
      id: "1",
      plan: "Starter",
      description: "Perfect for individuals getting started",
      price: "15K",
      altGoC: "6,000",
      perks: [
        "5,000 Go Credits per month",
        "Access to 10+ publishers",
        "Basic analytics",
        "Email support",
        "Mobile app access",
      ],
    },
    {
      id: "2",
      plan: "Professional",
      description: "Best for growing teams and professionals",
      price: "35K",
      altGoC: "14,000",
      perks: [
        "15,000 Go Credits per month",
        "Access to 50+ publishers",
        "Advanced analytics & insights",
        "Priority email & chat support",
        "Team collaboration tools",
        "API access",
        "Custom integrations",
      ],
    },
    {
      id: "3",
      plan: "Enterprise",
      description: "For large organizations with custom needs",
      price: "85K",
      altGoC: "34,000",
      perks: [
        "50,000 Go Credits per month",
        "Unlimited publisher access",
        "Enterprise analytics suite",
        "24/7 dedicated support",
        "Advanced team management",
        "Custom API & integrations",
        "SSO & security features",
        "Dedicated account manager",
      ],
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<string | null>("3");

  return (
    <section className="space-y-4">
      <PageHeader
        title="Choose Your Plan"
        subtitle="Select the perfect plan for your needs. Upgrade or downgrade anytime."
        backLink="/wallet"
      />

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const activePlan = selectedPlan === sub.id;
          const isEnterprise = sub.plan === "Enterprise";
          return (
            <div
              onClick={() => setSelectedPlan(sub.id)}
              key={sub.id}
              className="border border-[#E7EBFF] shadow-md bg-white w-full h-full rounded-xl p-5.5 flex flex-col justify-between relative hover:shadow-lg transition-shadow overflow-hidden">
              {/* enterprise specific design - positioned behind everything */}
              {isEnterprise && (
                <img
                  src="/enterprise.svg"
                  alt="pattern"
                  className="absolute bottom-0 left-0 z-0 pointer-events-none"
                />
              )}

              {/* details */}
              <div className="space-y-4 mb-4 relative z-10">
                {/* top */}
                <div className="space-y-3">
                  <img
                    src="/plans-icon.svg"
                    alt="Choose Plan"
                    className="size-10"
                  />
                  <h4
                    className={`font-medium text-2xl ${
                      isEnterprise ? "text-[#0C31A1]" : "text-[#1B223C]"
                    }`}>
                    {sub.plan}
                  </h4>
                  <p
                    className={`text-sm ${
                      isEnterprise ? "text-[#3C3C3C]" : "text-[#797878]"
                    }`}>
                    {sub.description}
                  </p>
                  <p className="flex items-end gap-2">
                    <span className="text-4xl text-[#1B223C]">
                      ₦{sub.price}
                    </span>
                    <span className="text-sm text-[#797878]">per month</span>
                  </p>
                  <p className="flex gap-1">
                    <Gem size={15} color="#42526D" />
                    <span className="text-xs text-[#42526D]">
                      Or {sub.altGoC} GoCoins
                    </span>
                  </p>
                </div>
                {/* divider */}
                <hr className="text-gray-300" />
                {/* perks */}
                <ul className="space-y-1.5">
                  {sub.perks.map((p, idx) => (
                    <li
                      key={idx}
                      className={`text-sm flex items-center gap-2.5 ${
                        isEnterprise ? "text-[#0C31A1]" : "text-[#42526D]"
                      }`}>
                      <Check
                        size={15}
                        color={isEnterprise ? "#0C31A1" : "#42526D"}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* button */}
              <Button
                variant={activePlan ? "primary" : "outline"}
                className="w-full relative z-10"
                size={"lg"}>
                {activePlan ? "Selected" : "Select Plan"}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
