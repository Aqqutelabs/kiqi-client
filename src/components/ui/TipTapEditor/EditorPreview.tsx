"use client";

import React from "react";
import DOMPurify from "isomorphic-dompurify";

interface EditorPreviewProps {
  content: string;
  className?: string;
}

export const EditorPreview: React.FC<EditorPreviewProps> = ({
  content,
  className = "",
}) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHTML = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "src", "alt"],
  });

  // Show empty state if no content
  if (!content || content === "<p></p>") {
    return (
      <div className={`flex items-center justify-center p-4 text-gray-400 ${className}`}>
        <p className="text-sm">Preview will appear here...</p>
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm max-w-none overflow-y-auto p-4 prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-em:text-gray-700 prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-300 prose-pre:rounded prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:text-gray-600 prose-blockquote:italic ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      role="region"
      aria-label="Rich text preview"
    />
  );
};
