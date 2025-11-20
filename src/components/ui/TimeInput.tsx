"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (time: string) => void;
  className?: string;
  label?: string;
  use24Hour?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
  placeholder = "Time",
  value = "",
  onChange,
  className = "",
  label,
  use24Hour = false,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(value);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedTime(value);
    if (value) {
      parseTimeValue(value);
    }
  }, [value]);

  const parseTimeValue = (timeStr: string) => {
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
    const match = timeStr.match(timeRegex);
    
    if (match) {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const periodMatch = match[3]?.toUpperCase() as "AM" | "PM" | undefined;

      if (!use24Hour && periodMatch) {
        setPeriod(periodMatch);
      } else if (use24Hour && hour > 12) {
        setPeriod("PM");
        hour = hour > 12 ? hour : hour;
      }

      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  };

  const formatTime = (hour: number, minute: number, per: "AM" | "PM"): string => {
    if (use24Hour) {
      let hour24 = hour;
      if (per === "PM" && hour !== 12) {
        hour24 = hour + 12;
      } else if (per === "AM" && hour === 12) {
        hour24 = 0;
      }
      return `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    } else {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${per}`;
    }
  };

  const handleTimeSelect = (): void => {
    const formattedTime = formatTime(selectedHour, selectedMinute, period);
    setSelectedTime(formattedTime);
    setIsPickerOpen(false);

    if (onChange) {
      onChange(formattedTime);
    }
  };

  const togglePicker = (): void => {
    setIsPickerOpen(!isPickerOpen);
  };

  const handleHourSelect = (hour: number): void => {
    setSelectedHour(hour);
  };

  const handleMinuteSelect = (minute: number): void => {
    setSelectedMinute(minute);
  };

  const handlePeriodToggle = (): void => {
    setPeriod(period === "AM" ? "PM" : "AM");
  };

  const scrollToSelected = () => {
    setTimeout(() => {
      if (hourScrollRef.current) {
        const selectedElement = hourScrollRef.current.querySelector('[data-selected="true"]');
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
      if (minuteScrollRef.current) {
        const selectedElement = minuteScrollRef.current.querySelector('[data-selected="true"]');
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 50);
  };

  useEffect(() => {
    if (isPickerOpen) {
      scrollToSelected();
    }
  }, [isPickerOpen]);

  const hours = use24Hour 
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);
  
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`relative max-w-[450px] ${className}`}>
      {label && (
        <label className="text-sm capitalize font-medium text-gray-900 block mb-2">
          {label}
        </label>
      )}
      <div
        ref={inputRef}
        className="relative flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 h-10 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={togglePicker}
      >
        <input
          type="text"
          value={selectedTime}
          placeholder={placeholder}
          readOnly
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm cursor-pointer bg-transparent"
        />
        <Clock className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
      </div>

      {isPickerOpen && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4 w-4/5 min-w-[280px]"
        >
          <div className="flex gap-2 mb-3">
            {/* Hours Column */}
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 text-center mb-2">
                Hour
              </div>
              <div
                ref={hourScrollRef}
                className="h-40 overflow-y-auto scrollbar-hide rounded border border-gray-200"
              >
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleHourSelect(hour)}
                    type="button"
                    data-selected={selectedHour === hour}
                    className={`
                      w-full px-3 py-2 text-sm text-center hover:bg-blue-50 transition-colors
                      ${selectedHour === hour ? "bg-blue-100 text-[#155DFC] font-medium" : "text-gray-700"}
                    `}
                  >
                    {use24Hour ? hour.toString().padStart(2, "0") : hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 text-center mb-2">
                Minute
              </div>
              <div
                ref={minuteScrollRef}
                className="h-40 overflow-y-auto scrollbar-hide rounded border border-gray-200"
              >
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    type="button"
                    data-selected={selectedMinute === minute}
                    className={`
                      w-full px-3 py-2 text-sm text-center hover:bg-blue-50 transition-colors
                      ${selectedMinute === minute ? "bg-blue-100 text-[#155DFC] font-medium" : "text-gray-700"}
                    `}
                  >
                    {minute.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM Column */}
            {!use24Hour && (
              <div className="w-16">
                <div className="text-xs font-medium text-gray-500 text-center mb-2">
                  Period
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPeriod("AM")}
                    type="button"
                    className={`
                      px-3 py-2 text-sm text-center rounded border transition-colors
                      ${period === "AM" ? "bg-blue-100 text-[#155DFC] border-blue-300 font-medium" : "text-gray-700 border-gray-200 hover:bg-blue-50"}
                    `}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setPeriod("PM")}
                    type="button"
                    className={`
                      px-3 py-2 text-sm text-center rounded border transition-colors
                      ${period === "PM" ? "bg-blue-100 text-[#155DFC] border-blue-300 font-medium" : "text-gray-700 border-gray-200 hover:bg-blue-50"}
                    `}
                  >
                    PM
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => setIsPickerOpen(false)}
              type="button"
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTimeSelect}
              type="button"
              className="flex-1 px-3 py-2 text-sm text-white bg-[#155DFC] rounded hover:bg-[#1348d4] transition-colors"
            >
              Set Time
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInput;