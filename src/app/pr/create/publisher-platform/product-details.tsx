import React, { useState } from "react";
import {
  X,
  ShoppingCart,
  Bookmark,
  Share2,
  Eye,
  Star,
  Award,
  Clock,
  Target,
  Globe,
  Users,
  ChevronDown,
  TrendingUp,
  Package,
  FileText,
  ChartColumn,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Products } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/context/ProductContext";

function Overview({ product }: { product: Products }) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (index: string) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: "What is the typical turnaround time?", id: "1" },
    { question: "Can I request specific topics?", id: "2" },
    { question: "What kind of analytics will I receive?", id: "3" },
    { question: "Is there a revision policy?", id: "4" },
  ];

  return (
    <div className="p-6">
      {/* Key Features */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Key Features</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Premium Quality</div>
            <div className="font-semibold text-sm text-gray-900">
              Verified Publisher
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-600 mb-1">High Engagement</div>
            <div className="font-semibold text-sm text-gray-900">85% CTR</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Fast Delivery</div>
            <div className="font-semibold text-sm text-gray-900">
              24-48 Hours
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-600 mb-1">Global Coverage</div>
            <div className="font-semibold text-sm text-gray-900">
              USA, Europe
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <TrendingUp size={15} color="#009966" />
            <span className="text-sm text-gray-600">Industry Focus</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {product.industry}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Globe size={15} color="#155DFC" />
            <span className="text-sm text-gray-600">Coverage</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {product.region}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Users size={15} color="#9810FA" />
            <span className="text-sm text-gray-600">Audience Reach</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {product.reach}
          </span>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <button
              key={faq.id}
              onClick={() => toggleFaq(faq.id)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openFaq === faq.id ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openFaq === faq.id && (
                <p className="mt-3 text-sm text-gray-600">
                  This is the answer to the question. It provides detailed
                  information about the topic.
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metrics({ product }: { product: Products }) {
  const bars = [
    { name: "Domain Authority", count: 92, color: "#155DFC" },
    { name: "Trust Score", count: 88, color: "#009966" },
    { name: "Average Traffic", count: 75, color: "#9810FA" },
    { name: "Social Signals", count: 95, color: "#F54900" },
  ];
  return (
    <div className="space-y-5 p-5">
      <div className="space-y-4">
        <h4 className="font-bold text-[#1B223C] text-base">
          Performance Metrics
        </h4>
        {bars.map((bar, idx) => (
          <div key={idx} className="">
            <p className="flex justify-between items-center text-xs space-y-2">
              <span className="text-[#1B223C]">{bar.name}</span>
              <span className="font-bold text-[#233E97]">{bar.count}/100</span>
            </p>
            <div className="h-2 w-full rounded-full bg-[#F1F5F9]">
              <span
                style={{
                  width: `${bar.count}%`,
                  backgroundColor: `${bar.color}`,
                  height: "80%",
                }}></span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-[#1B223C] text-base">Sample Results</h4>
        <div className="flex items-center gap-4">
          {/* publish time */}
          <div className="p-5 rounded-xl shadow-sm flex-1 min-w-[150px] transition-shadow hover:shadow-md border border-[#A4F4CF]">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3`}>
              <Calendar className="w-5 h-5" color="#009966" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Avg. Publish Time
            </p>
            <h3 className="text-xl font-bold">24-48 Hours</h3>
          </div>

          {/* backlinks */}
          <div className="p-5 rounded-xl shadow-sm flex-1 min-w-[150px] transition-shadow hover:shadow-md border border-[#BEDBFF]">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3`}>
              <ExternalLink className="w-5 h-5" color="#155DFC" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Avg. Backlinks
            </p>
            <h3 className="text-xl font-bold">15-30</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reviews({ product }: { product: Products }) {
  return <div></div>;
}

export default function ProductSidebar({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Products;
}) {
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [
    { name: "Overview", icon: FileText, id: 1 },
    { name: "Metrics", icon: ChartColumn, id: 2 },
    { name: "Reviews", icon: Star, id: 3 },
  ];

  if (!product) return null;

  const { isAdded, handleAddToCart } = useProducts();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        {/* Header with Blue Background */}
        <div className="bg-gradient-to-r from-[#233E97] to-[#155DFC] p-6 relative h-[170px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="size-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-white font-bold text-xl mb-1">
                {product.productName}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-white/90 text-xs">4.8 (127 reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-white">
            <div className="text-3xl font-bold mb-1">₦{product.amount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-2.5" />
            <span>{!isAdded ? "Add" : "Added"} to Cart</span>
          </Button>
          <Button variant={"tertiary"}>
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant={"tertiary"}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 py-4">
          <div className="flex px-4 gap-2">
            {tabs.map((tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                key={tab.id}
                className={`flex items-center justify-center gap-2 rounded-[10px] h-[35px] w-[110px] cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#233E97] text-white"
                    : "bg-[#F1F5F9] text-[#45556C]"
                }`}>
                <tab.icon size={15} />
                <span className="font-medium text-xs">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 1 && <Overview product={product} />}
        {activeTab === 2 && <Metrics product={product} />}
        {activeTab === 3 && <Reviews product={product} />}
      </div>
    </>
  );
}
