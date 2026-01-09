"use client";

import React, { useMemo } from "react";
import { Editor } from "@tiptap/react";
import { Clock, BookOpen, BarChart3 } from "lucide-react";

interface EditorStatsProps {
  editor: Editor | null;
}

export const EditorStats: React.FC<EditorStatsProps> = ({ editor }) => {
  const stats = useMemo(() => {
    if (!editor) return null;

    const text = editor.state.doc.textContent;
    const html = editor.getHTML();

    // Character count
    const characters = text.length;

    // Word count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    // Reading time (assuming 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);

    // Paragraph count
    const paragraphs = text
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0).length;

    // Average word length
    const avgWordLength = words > 0 ? (characters / words).toFixed(1) : 0;

    return {
      characters,
      words,
      readingTime: readingTimeMinutes,
      paragraphs,
      avgWordLength,
    };
  }, [editor?.state.doc]);

  if (!stats) return null;

  return (
    <div className="mt-3 px-3 py-2 bg-gradient-to-r from-orange-50 to-indigo-50 rounded-lg border border-orange-100">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
        {/* Characters */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="text-gray-500 font-medium mb-1">Characters</div>
          <div className="text-lg font-bold text-gray-900">
            {stats.characters}
          </div>
        </div>

        {/* Words */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="text-gray-500 font-medium mb-1">Words</div>
          <div className="text-lg font-bold text-gray-900">{stats.words}</div>
        </div>

        {/* Paragraphs */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="text-gray-500 font-medium mb-1">Paragraphs</div>
          <div className="text-lg font-bold text-gray-900">
            {stats.paragraphs}
          </div>
        </div>

        {/* Reading Time */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex items-center gap-1 text-gray-500 font-medium mb-1">
            <Clock size={14} />
            Read Time
          </div>
          <div className="text-lg font-bold text-gray-900">
            {stats.readingTime}m
          </div>
        </div>

        {/* Avg Word Length */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="text-gray-500 font-medium mb-1">Avg Word</div>
          <div className="text-lg font-bold text-gray-900">
            {stats.avgWordLength}
          </div>
        </div>
      </div>

      {/* Content Density */}
      {stats.words > 0 && (
        <div className="mt-3 pt-3 border-t border-orange-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-orange-600" />
              <span className="text-gray-600 font-medium">Content Density</span>
            </div>
            <div className="text-gray-700 font-semibold">
              {((stats.words / (stats.words + stats.paragraphs)) * 100).toFixed(
                0
              )}
              %
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (stats.words / (stats.words + stats.paragraphs)) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
