"use client";

import { Card } from "@/components/ui/Card";
import DateInput from "@/components/ui/forms/DateInput";
import SearchInput from "@/components/ui/forms/Search";
import { Select } from "@/components/ui/forms/Select";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import SummaryCard from "@/components/ui/quick-action-summary-card";
import { ArrowDownLeft, ArrowUpRight, Coins, Gift } from "lucide-react";
import { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";

interface Transactions {
    id: string;
    transactionID: string;
    date: string;
    type: "Debit" | "Credit" | "Referral" | "Conversion" | "Purchase" | "Refund" ;
    description: string;
    amount: string;
    balance: string;
    status: "Completed" | "Failed" | "Pending";
};


export default function TransactionHistoryPage() {
    const transaction_cards = [
        {
      title: "₦187,500 GC",
      description: "Total Credits",
      icon: ArrowDownLeft,
      color: "#00A63E",
    },
    {
      title: "₦134,500 GC",
      description: "Total Debits",
      icon: ArrowUpRight,
      color: "#E7000B",
    },
    {
      title: "₦5,000 GC",
      description: "Referral Earnings",
      icon: Gift,
      color: "#155DFC",
    },
    {
      title: "12",
      description: "Transactions",
      icon: Coins,
      color: "#9810FA",
    },
  ];
  const [query, setQuery] = useState("");

  const headers: Column<Transactions>[] = [
    { header: "Transaction ID", accessor: "transactionID" },
    { header: "Date & Time", accessor: "date" },
    { header: "Type", accessor: "type" },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: "amount" },
    { header: "Balance", accessor: "balance" },
    { header: "Status", accessor: "status" },
  ];

  const data: Transactions[] = [
    {
        id: "1",
        transactionID: "TXN-001",
        date: "Oct 28, 2025, 02:30 PM",
        type: "Credit",
        description: "Subscription purchase - Pro Plan",
        amount: "+50,000 GC",
        balance: "150,000 GC",
        status: "Completed",
    },
      {
        id: "2",
        transactionID: "TXN-001",
        date: "Oct 28, 2025, 02:30 PM",
        type: "Debit",
        description: "Subscription purchase - Pro Plan",
        amount: "+50,000 GC",
        balance: "150,000 GC",
        status: "Failed",
    },
      {
        id: "3",
        transactionID: "TXN-001",
        date: "Oct 28, 2025, 02:30 PM",
        type: "Refund",
        description: "Subscription purchase - Pro Plan",
        amount: "+50,000 GC",
        balance: "150,000 GC",
        status: "Pending",
    },
  ];

  return (
    <section className="space-y-5">
      {/* page header */}
      <PageHeader
        title="Transaction History"
        subtitle="View and manage all your transactions"
        backLink="/wallet"
      />

      {/* grid card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          action={transaction_cards}
          hasIcon={false}
          swapped={true}
        />
      </div>

      {/* search and filters */}
      <div className="bg-white rounded-xl p-5 border border-[#0000001A] flex justify-between items-center gap-5">
        <SearchInput
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select placeholder="Enter Types">
          <option value="">All Types</option>
        </Select>
        <DateInput placeholder="From date" />
        <DateInput placeholder="To date" />
      </div>

      {/* table */}
      <DataTable
      columns={headers}
      data={data}
      />
    </section>
  );
}
