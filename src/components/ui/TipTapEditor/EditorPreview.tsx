"use client";

import React, { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Eye, FileText, AlertCircle } from "lucide-react";

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
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "src", "alt", "style", "class"],
  });

  // Calculate content statistics
  const stats = useMemo(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;
    const text = tempDiv.textContent || "";
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const charCount = text.length;
    const paragraphs = sanitizedHTML.match(/<p[^>]*>/gi)?.length || 0;
    
    return { wordCount, charCount, paragraphs };
  }, [sanitizedHTML]);

  // Show empty state if no content
  if (!content || content === "<p></p>") {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-gray-400 ${className}`}>
        <Eye size={48} className="mb-3 opacity-30" />
        <p className="text-sm font-medium">No content yet</p>
        <p className="text-xs mt-1">Start typing in the editor to see a preview here</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <FileText size={14} />
            {stats.wordCount} words
          </span>
          <span className="w-px h-4 bg-gray-200" />
          <span>{stats.charCount} chars</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto">
        <div
          className={`prose prose-sm max-w-none p-6 
            prose-headings:mb-4 prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:font-bold prose-strong:text-gray-900
            prose-em:italic prose-em:text-gray-700
            prose-u:underline
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:hover:text-blue-800
            prose-code:text-red-600 prose-code:bg-red-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700
            prose-pre:code:text-gray-100 prose-pre:code:bg-transparent
            prose-ul:text-gray-700 prose-ul:space-y-1 prose-ul:mb-4
            prose-ol:text-gray-700 prose-ol:space-y-1 prose-ol:mb-4
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:text-gray-700 prose-blockquote:italic prose-blockquote:my-4 prose-blockquote:rounded-r-lg
            prose-table:w-full prose-table:my-4 prose-table:border-collapse
            prose-tr:border-b prose-tr:border-gray-200
            prose-th:bg-gray-100 prose-th:p-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 prose-th:border prose-th:border-gray-300
            prose-td:p-2 prose-td:border prose-td:border-gray-300 prose-td:text-gray-700
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-4 prose-img:max-w-full prose-img:h-auto
          `}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          role="region"
          aria-label="Rich text preview"
        />
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center gap-2 text-xs text-gray-600">
        <AlertCircle size={14} className="text-gray-400" />
        <span>This is a live preview of how your content will appear</span>
      </div>
    </div>
  );
};
