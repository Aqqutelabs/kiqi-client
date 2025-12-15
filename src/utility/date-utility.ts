// import { Timestamp } from "firebase/firestore";

type DateInput =
  | string
  | { seconds: number; nanoseconds: number }
  | Date
  | null
  | undefined;

// Helper to convert any date input to Date object
function toDate(input: DateInput): Date | null {
  if (!input) return null;

  // Already a Date
  if (input instanceof Date) return input;

  // Firebase Timestamp
  // if (input instanceof Timestamp) return input.toDate();

  // Plain object with seconds/nanoseconds (Firebase Timestamp from JSON)
  if (typeof input === "object" && "seconds" in input) {
    return new Date(input.seconds * 1000);
  }

  // String
  if (typeof input === "string") return new Date(input);

  return null;
}

export function formatDateTime(dateInput: DateInput): string {
  const date = toDate(dateInput);
  if (!date) return "N/A";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// format time
export const formatTriggerTime = (timestamp: any) => {
  if (!timestamp) return "Unknown time";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDateTime(date) || "Unknown time";
  } catch (error) {
    return "Unknown time";
  }
};

export function timeAgo(dateInput: DateInput): string {
  const date = toDate(dateInput);
  if (!date) return "N/A";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export function formatDate(
  dateInput: DateInput,
  format: "short" | "long" | "full" = "long"
): string {
  const date = toDate(dateInput);
  if (!date) return "N/A";

  switch (format) {
    case "short":
      return date.toLocaleDateString("en-US");

    case "long":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    case "full":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    default:
      return date.toLocaleDateString();
  }
}

// Helper function to extract file type from URL
export const getFileTypeFromUrl = (url: string): string => {
  try {
    // Remove query parameters
    const urlWithoutParams = url.split("?")[0];

    // Get extension
    const parts = urlWithoutParams.split(".");
    const extension = parts.length > 1 ? parts.pop()?.toUpperCase() : null;

    return extension || "FILE";
  } catch (error) {
    return "FILE";
  }
};

// Helper function to get file size (you might want to fetch this from storage metadata)
export const getFileSize = (url: string): string => {
  // Since we don't have file size in the data, we'll use a placeholder
  // In a real app, you'd fetch this from Firebase Storage metadata
  return "1.2 MB"; // Placeholder
};

// Helper function to get upload date (using rider's creation date as fallback)
export const getUploadDate = (riderCreatedAt: any): string => {
  return formatDate(riderCreatedAt) || "N/A";
};

export const parseCsvEmails = (csvText: string): string[] => {
  const emails: string[] = [];
  const lines = csvText.split("\n");

  lines.forEach((line) => {
    // Extract emails from CSV line (simple parsing)
    const emailMatches = line.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    );
    if (emailMatches) {
      emails.push(...emailMatches.map((email) => email.trim()));
    }
  });

  return Array.from(new Set(emails)).filter((email) => isValidEmail(email));
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const parseCsvPhones = (csvText: string): string[] => {
  const phones = new Set<string>();

  const lines = csvText.split("\n");

  // Function to validate if a string looks like a phone number
  const isValidPhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters except plus
    const digitsOnly = phone.replace(/[^\d+]/g, "");

    // Check if it has a reasonable length for a phone number
    // Minimum 8 digits, maximum 15 (E.164 standard allows up to 15)
    const digitLength = digitsOnly.replace(/\D/g, "").length;
    return digitLength >= 8 && digitLength <= 15;
  };

  // Function to normalize phone number to international format
  const normalizePhone = (rawPhone: string): string | null => {
    // Clean the phone number
    let phone = rawPhone.trim();

    // Remove all whitespace, parentheses, dashes, dots
    phone = phone.replace(/[\s\(\)\-\.]/g, "");

    // If empty after cleaning, skip
    if (!phone) return null;

    // Check if it starts with a plus
    const hasPlus = phone.startsWith("+");

    // Extract only digits (and keep leading plus)
    const digits = phone.replace(/\D/g, "");

    // Handle Nigerian numbers specifically
    if (digits.startsWith("234") && digits.length === 13) {
      // 234XXXXXXXXXX -> +234XXXXXXXXXX
      return `+${digits}`;
    }

    if (digits.startsWith("0") && digits.length === 11) {
      // 0XXXXXXXXXX -> +234XXXXXXXXXX (remove leading 0, add +234)
      return `+234${digits.substring(1)}`;
    }

    // Handle other international numbers
    if (hasPlus && digits.length >= 8 && digits.length <= 15) {
      return `+${digits}`;
    }

    // If it's just digits and looks like a phone number
    if (!hasPlus && digits.length >= 8 && digits.length <= 15) {
      // Try to determine if it's a local or international number
      // If it starts with country code (1-3 digits), assume international
      if (digits.length >= 10) {
        // Check common country codes
        const commonCountryCodes = [
          "1", // USA/Canada
          "44", // UK
          "33", // France
          "49", // Germany
          "81", // Japan
          "86", // China
          "91", // India
          "234", // Nigeria
          "254", // Kenya
          "255", // Tanzania
          "256", // Uganda
          "233", // Ghana
          "27", // South Africa
        ];

        for (const code of commonCountryCodes) {
          if (digits.startsWith(code) && digits.length >= parseInt(code) + 7) {
            return `+${digits}`;
          }
        }
      }

      // If no country code detected but length is 10, assume it's a US number
      if (digits.length === 10) {
        return `+1${digits}`;
      }
    }

    return null;
  };

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by common CSV delimiters
    const columns = line.split(/[,;\t]/);

    for (const column of columns) {
      const cell = column.trim().replace(/['"]/g, ""); // Remove quotes

      // Try to extract phone numbers from the cell
      // Look for patterns that might be phone numbers

      // Pattern 1: Clear phone number format (with or without +)
      const phonePatterns = [
        // International format with +
        /\+\d[\d\s\-\(\)]{8,20}/,
        // Numbers with spaces/dashes/parentheses
        /[\d\s\-\(\)]{10,20}/,
        // Plain digits
        /\d{8,15}/,
      ];

      for (const pattern of phonePatterns) {
        const matches = cell.match(pattern);
        if (matches) {
          for (const match of matches) {
            if (isValidPhoneNumber(match)) {
              const normalized = normalizePhone(match);
              if (normalized) {
                phones.add(normalized);
              }
            }
          }
        }
      }

      // Also check if the entire cell looks like a phone number
      if (isValidPhoneNumber(cell)) {
        const normalized = normalizePhone(cell);
        if (normalized) {
          phones.add(normalized);
        }
      }
    }
  }

  return Array.from(phones).sort();
};
