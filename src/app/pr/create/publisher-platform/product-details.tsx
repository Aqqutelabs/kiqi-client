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
} from "lucide-react";
import { Products } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";

export default function ProductSidebar({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Products;
}) {
  const [activeTab, setActiveTab] = useState("overview");
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

  if (!product) return null;

   const [isAdded, setIsAdded] = useState(false);
   const handleAddToCart = () => {
    setIsAdded(true);
  };

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
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-900 text-white hover:bg-blue-800 w-full`}>
            <ShoppingCart className="w-4 h-4" />
            <span>{!isAdded ? "Add" : "Added"} to Cart</span>
          </button>
          <Button variant={"tertiary"}>
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant={"tertiary"}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "overview"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              <Eye className="w-4 h-4" />
              Overview
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "metrics"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              <Target className="w-4 h-4" />
              Metrics
              {activeTab === "metrics" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "reviews"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              <Star className="w-4 h-4" />
              Reviews
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key Features */}
          <div className="mb-8">
            <h2 className="font-bold text-gray-900 mb-4">Key Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Premium Quality
                </div>
                <div className="font-semibold text-sm text-gray-900">
                  Verified Publisher
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  High Engagement
                </div>
                <div className="font-semibold text-sm text-gray-900">
                  85% CTR
                </div>
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
                <div className="text-xs text-gray-600 mb-1">
                  Global Coverage
                </div>
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
      </div>
    </>
  );
}
