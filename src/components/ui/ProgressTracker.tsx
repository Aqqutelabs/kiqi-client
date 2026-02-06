import { useState } from "react";
import {
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader,
  Eye,
} from "lucide-react";

type StatusType =
  | "completed"
  | "pending"
  | "processing"
  | "review"
  | "rejected"
  | "initiated";

interface TrackerData {
  _id?: string;
  pr_id?: string;
  title?: string;
  current_status?: StatusType;
  status_history?: Array<{
    status: StatusType;
    timestamp: string;
    notes?: string;
  }>;
  progress_percentage?: number;
  estimated_completion?: string;
  reviewers_count?: number;
  distribution_outlets?: number;
  current_step?: number;
  total_steps?: number;
  // New fields from progress endpoint
  press_release?: {
    _id: string;
    title: string;
    status: string;
  };
  progress?: {
    current_step: string;
    initiated_at: string;
    payment_completed_at?: string;
    under_review_at?: string;
    completed_at?: string;
    rejected_at?: string;
    rejection_reason?: string;
  };
  timeline?: Array<{
    step: string;
    timestamp: string;
    notes: string;
    metadata?: any;
    _id?: string;
  }>;
  step_descriptions?: Record<string, string>;
  status_message?: string;
  next_action?: string;
}

interface StatusConfig {
  icon: string;
  color: string;
  textColor: string;
}

interface ProgressTrackerProps {
  isOpen?: boolean;
  onClose?: () => void;
  trackerData?: TrackerData;
  statusConfig?: Record<StatusType, StatusConfig>;
}

// Map icon names from API to Lucide components
const iconMap: Record<string, any> = {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader,
  Eye,
};

const ProgressTracker = ({
  isOpen = true,
  onClose = () => {},
  trackerData,
  statusConfig: apiStatusConfig,
}: ProgressTrackerProps) => {
  const [activeTab, setActiveTab] = useState("all");

  // Default status config (tailwind colors)
  const defaultStatusConfig: Record<
    StatusType,
    { icon: any; color: string; textColor: string }
  > = {
    completed: {
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    pending: {
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    processing: {
      icon: Loader,
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
    review: { icon: Eye, color: "bg-purple-500", textColor: "text-purple-600" },
    rejected: { icon: XCircle, color: "bg-red-500", textColor: "text-red-600" },
    initiated: {
      icon: Clock,
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
  };

  // Convert API status config to usable format
  const getStatusConfig = () => {
    if (!apiStatusConfig) return defaultStatusConfig;

    const converted: Record<
      StatusType,
      { icon: any; color: string; textColor: string }
    > = { ...defaultStatusConfig } as any;

    (Object.entries(apiStatusConfig) as [StatusType, StatusConfig][]).forEach(
      ([key, value]) => {
        if (value && typeof value === "object") {
          converted[key] = {
            icon:
              (value.icon && iconMap[value.icon]) ||
              defaultStatusConfig[key]?.icon ||
              CheckCircle,
            color: value.color?.startsWith("#")
              ? convertHexToBgClass(value.color)
              : value.color || "bg-gray-500",
            textColor: value.textColor?.startsWith("#")
              ? convertHexToTextClass(value.textColor)
              : value.textColor || "text-gray-600",
          };
        }
      }
    );

    return converted;
  };

  const statusConfigResolved = getStatusConfig();

  // Get all steps with their completion status
  const getAllSteps = () => {
    if (!trackerData || !trackerData.timeline) return [];

    // Extract unique steps from timeline, preserving order
    const completedSteps = new Map<string, any>();
    trackerData.timeline.forEach((event) => {
      if (!completedSteps.has(event.step)) {
        completedSteps.set(event.step, event);
      }
    });

    // Get all possible steps from step_descriptions if available
    let allPossibleSteps = trackerData.step_descriptions
      ? Object.keys(trackerData.step_descriptions)
      : Array.from(completedSteps.keys());

    const prStatus = trackerData.press_release?.status;
    const isPublished = prStatus === "Published";

    const steps = allPossibleSteps.map((stepName) => ({
      name: stepName,
      description: trackerData.step_descriptions?.[stepName] || "",
      // If published, mark all steps up to and including "approved" as completed
      isCompleted:
        completedSteps.has(stepName) ||
        (isPublished && (stepName === "approved" || stepName === "under_review")),
      timestamp: completedSteps.get(stepName)?.timestamp,
      notes: completedSteps.get(stepName)?.notes,
    }));

    // Add status step based on press release status
    // Only add published/rejected step if status is not "Draft"
    if (prStatus && prStatus !== "Draft") {
      const statusStep = {
        name: isPublished ? "published" : "rejected",
        description: isPublished
          ? "Press release published and live"
          : "Press release rejected",
        isCompleted: true,
        timestamp: isPublished
          ? trackerData.progress?.payment_completed_at
          : trackerData.progress?.rejected_at,
        notes: isPublished
          ? "Press release has been published"
          : trackerData.progress?.rejection_reason || "Press release was rejected",
      };
      steps.push(statusStep);
    }

    return steps;
  };

  const allSteps = getAllSteps();

  // Convert hex to tailwind class (simplified - uses closest color)
  const convertHexToBgClass = (hex: string): string => {
    const hexToClassMap: Record<string, string> = {
      "#10b981": "bg-emerald-500",
      "#f59e0b": "bg-amber-500",
      "#3b82f6": "bg-orange-500",
      "#8b5cf6": "bg-purple-500",
      "#ef4444": "bg-red-500",
    };
    return hexToClassMap[hex] || "bg-gray-500";
  };

  const convertHexToTextClass = (hex: string): string => {
    const hexToClassMap: Record<string, string> = {
      "#065f46": "text-emerald-900",
      "#92400e": "text-amber-900",
      "#1e40af": "text-orange-900",
      "#5b21b6": "text-purple-900",
      "#991b1b": "text-red-900",
    };
    return hexToClassMap[hex] || "text-gray-900";
  };

  // Convert tracker data to timeline format
  const getTimelineEvents = () => {
    if (!trackerData) return [];

    // Handle new progress endpoint format with timeline array
    if (trackerData.timeline && Array.isArray(trackerData.timeline)) {
      const eventsByDate: Record<string, any[]> = {};

      trackerData.timeline.forEach((item) => {
        const date = new Date(item.timestamp);
        const dateKey = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }

        eventsByDate[dateKey].push({
          status: item.step as StatusType,
          title: item.notes,
          time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      });

      return Object.entries(eventsByDate).map(([date, items], idx) => ({
        id: idx + 1,
        date,
        items,
      }));
    }

    // Handle old tracker format with status_history
    if (
      !trackerData.status_history ||
      trackerData.status_history.length === 0
    ) {
      return [];
    }

    const eventsByDate: Record<string, any[]> = {};

    trackerData.status_history.forEach((history) => {
      const date = new Date(history.timestamp);
      const dateKey = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }

      eventsByDate[dateKey].push({
        status: history.status,
        title: history.notes || `Status changed to ${history.status}`,
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    return Object.entries(eventsByDate).map(([date, items], idx) => ({
      id: idx + 1,
      date,
      items,
    }));
  };

  const events = getTimelineEvents();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Progress Tracker
            </h2>
            {trackerData && (
              <>
                <p className="text-sm text-gray-600 mt-1">
                  {trackerData.press_release?.title || trackerData.title}
                </p>
                {trackerData.status_message && (
                  <p className="text-xs text-orange-600 font-medium mt-2 bg-orange-50 px-2 py-1 rounded inline-block">
                    {trackerData.status_message}
                  </p>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar and Info */}
        {trackerData && (
          <div className="p-6 border-b border-gray-200">
            {trackerData.progress_percentage !== undefined && (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-semibold text-orange-600">
                    {trackerData.progress_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${trackerData.progress_percentage}%` }}
                  />
                </div>
              </>
            )}
            {trackerData.current_step && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Step
                </p>
                <p className="text-base font-semibold text-gray-900 capitalize">
                  {String(trackerData.current_step).replace(/_/g, " ")}
                </p>
              </div>
            )}
            {(trackerData.current_step || trackerData.reviewers_count) && (
              <div className="grid grid-cols-3 gap-4 mt-4 text-center text-xs">
                {trackerData.current_step && (
                  <div>
                    <p className="text-gray-600">Step</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {
                        String(trackerData.current_step)
                          .replace(/_/g, " ")
                          .split(" ")[0]
                      }
                    </p>
                  </div>
                )}
                {trackerData.reviewers_count !== undefined && (
                  <div>
                    <p className="text-gray-600">Reviewers</p>
                    <p className="font-semibold text-gray-900">
                      {trackerData.reviewers_count}
                    </p>
                  </div>
                )}
                {trackerData.distribution_outlets !== undefined && (
                  <div>
                    <p className="text-gray-600">Outlets</p>
                    <p className="font-semibold text-gray-900">
                      {trackerData.distribution_outlets}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* All Steps Visual Indicator */}
            {allSteps.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  All Steps
                </p>
                <div className="space-y-3">
                  {allSteps.map((step, idx) => {
                    // Determine if this step is a status step (published/rejected)
                    const isStatusStep = step.name === "published" || step.name === "rejected";
                    const isRejected = step.name === "rejected";
                    
                    return (
                      <div key={step.name} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {step.isCompleted ? (
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                isRejected ? "bg-red-100" : "bg-green-100"
                              }`}>
                              {isRejected ? (
                                <XCircle size={16} className="text-red-600" />
                              ) : (
                                <CheckCircle size={16} className="text-green-600" />
                              )}
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium capitalize ${
                              step.isCompleted
                                ? isRejected
                                  ? "text-red-700"
                                  : "text-green-700"
                                : "text-gray-600"
                            }`}>
                            {step.name.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {step.description}
                          </p>
                          {step.timestamp && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(step.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        {/* <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "unread"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            Unread
          </button>
        </div> */}

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-center">No timeline events yet</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="mb-8 last:mb-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  {event.date}
                </h3>

                <div className="relative pl-8">
                  {/* Vertical line */}
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />

                  {event.items.map((item, idx) => {
                    const status = item.status as StatusType;
                    const statusConfig = statusConfigResolved[status];

                    // Safety check: if status doesn't exist in config, skip rendering
                    if (!statusConfig || !statusConfig.icon) {
                      return null;
                    }

                    const StatusIcon = statusConfig.icon;

                    return (
                      <div key={idx} className="relative mb-6 last:mb-0">
                        {/* Status icon */}
                        <div
                          className={`absolute -left-8 ${statusConfigResolved[status].color} rounded-full p-1`}>
                          <StatusIcon size={16} className="text-white" />
                        </div>

                        {/* Content card */}
                        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                          <p className="text-sm text-gray-800 mb-2 leading-relaxed">
                            {item.title}
                          </p>
                          <p
                            className={`text-xs font-medium ${statusConfigResolved[status].textColor}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)} •{" "}
                            {item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {/* <div className="p-6 border-t border-gray-200 flex gap-3">
          <button className="flex-1 px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
            Edit Release
          </button>
          <button className="flex-1 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            View Details
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProgressTracker;
