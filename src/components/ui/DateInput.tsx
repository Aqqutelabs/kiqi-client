"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

interface DateInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (date: string) => void;
  className?: string;
  label?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  placeholder = "Date",
  value = "",
  onChange,
  className = "",
  label,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number): void => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    setSelectedDate(formattedDate);
    setIsCalendarOpen(false);

    // Call onChange callback if provided
    if (onChange) {
      onChange(formattedDate);
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const toggleCalendar = (): void => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.toDateString() ===
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      ).toDateString()
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative w-full ${className}`}>
     {label && <label className="text-sm capitalize font-medium text-gray-900 block mb-2">
        {label}
      </label>}
      <div
        ref={inputRef}
        className="relative flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 h-10 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={toggleCalendar}>
        <input
          type="text"
          value={selectedDate}
          placeholder={placeholder}
          readOnly
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm cursor-pointer bg-transparent"
        />
        <Calendar className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
      </div>

      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4 w-full">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
              type="button">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="font-medium text-gray-800">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
              type="button">
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-gray-500 text-center py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && handleDateSelect(day)}
                disabled={!day}
                type="button"
                className={`
                  h-8 w-8 text-sm rounded hover:bg-blue-50 transition-colors
                  ${day ? "text-gray-700 cursor-pointer" : "cursor-default"}
                  ${day && isToday(day) ? "bg-blue-100 text-[#155DFC]" : ""}
                  ${day ? "hover:bg-blue-100 hover:text-[#155DFC]" : ""}
                `}>
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;
