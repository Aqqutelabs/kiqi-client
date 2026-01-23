import { BarChart3, MousePointerClick, ShieldCheck, TrendingUp } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

const metrics: Metric[] = [
  {
    id: "traffic",
    label: "Monthly Traffic",
    value: "500,000+",
    description: "Average monthly unique visitors to the publisher's platform.",
    icon: TrendingUp,
  },
  {
    id: "ctr",
    label: "Average CTR",
    value: "3.4%",
    description: "Click-through rate based on historical article performance.",
    icon: MousePointerClick,
  },
  {
    id: "trust",
    label: "Trust Score",
    value: "92/100",
    description: "Internal quality and credibility score derived from publisher signals.",
    icon: ShieldCheck,
  },
  {
    id: "social",
    label: "Social Signals",
    value: "6.8%",
    description: "Measures how actively readers interact with published content.",
    icon: BarChart3,
  },
];

export default function MetricsPage() {
  return (
    <div>
      <main className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </main>
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 relative group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#FF5314]/10">
            <Icon className="w-5 h-5 text-[#FF5314]" />
          </div>
          <p className="font-medium">{metric.label}</p>
        </div>

        <div className="relative">
          <span className="text-gray-400 cursor-help">ⓘ</span>
          <div className="absolute right-0 top-6 z-10 w-56 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
              {metric.description}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-2xl font-semibold">{metric.value}</p>
    </div>
  );
}
