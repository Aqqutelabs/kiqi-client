import { BarChart3, Globe, MousePointerClick, ShieldCheck, TrendingUp } from "lucide-react";

interface MetricPageProps {
  publisher: any;
}

interface Metric {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
}



export default function MetricPage({ publisher }: MetricPageProps){
  const publisherMetrics = publisher.metrics;
const metrics: Metric[] = [
  {
    id: "avgTrafficMonthly",
    label: "Monthly Traffic",
    value: publisherMetrics?.avgTrafficMonthly
      ? publisherMetrics.avgTrafficMonthly.toLocaleString()
      : "—",
    description:
      "Average number of unique visitors per month across the publisher’s domain.",
    icon: TrendingUp,
  },
  {
    id: "domainAuthority",
    label: "Domain Authority",
    value: publisherMetrics?.domainAuthority
      ? `${publisherMetrics.domainAuthority}/100`
      : "—",
    description:
      "SEO authority score based on backlink quality, domain age, and search visibility.",
    icon: Globe,
  },
  {
    id: "trustScore",
    label: "Trust Score",
    value: publisherMetrics?.trustScore
      ? `${publisherMetrics.trustScore}/100`
      : "—",
    description:
      "Internal credibility score derived from editorial quality and audience trust.",
    icon: ShieldCheck,
  },

  {
    id: "socialSignals",
    label: "Social Signals",
    value: "6.8%",
    description:
      "Measures how actively readers interact with published content across social platforms.",
    icon: BarChart3,
  },
];
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
