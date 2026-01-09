# Quick Reference Guide

## What Was Changed?

### New Components Created ✨

1. **`src/components/ui/KikiAiChatbot.tsx`** - Reusable AI Chatbot

   - Extracted from email campaigns page
   - Fully configurable via props
   - Persistent chat history
   - Session management
   - Error recovery

2. **`src/components/ui/RichTextEditor.tsx`** - Enhanced Text Editor
   - Replaces basic Textarea
   - Full WYSIWYG formatting toolbar
   - Format state tracking
   - Paste sanitization
   - Undo/Redo support

### Updated Files

1. **`src/app/(app)/pr/create/page.tsx`** - PR Creation Page
   - Integrated KikiAiChatbot component
   - Replaced Textarea with RichTextEditor
   - Added side-by-side layout (content + AI)
   - Improved form validation
   - Better error handling

### New Documentation

1. **`EDGE_CASES_GUIDE.md`** - Comprehensive edge case documentation
2. **`IMPLEMENTATION_SUMMARY.md`** - Complete implementation overview

---

## How to Use the New Components

### Using KikiAiChatbot in Your Page

```tsx
import { KikiAiChatbot } from "@/components/ui/KikiAiChatbot";

export default function MyPage() {
  const handleApplyMessage = (message: string) => {
    // Do something with the AI-generated message
    setContent(message);
  };

  return (
    <KikiAiChatbot
      onApplyMessage={handleApplyMessage}
      apiEndpoint="/api/your-endpoint"
      placeholder="Ask me anything..."
      tone="Professional"
      chatHistoryKey="my_feature_chat"
      maxHeight="max-h-[500px]"
      showCard={true}
    />
  );
}
```

### Using RichTextEditor in Your Page

```tsx
import { RichTextEditor } from "@/components/ui/RichTextEditor";

export default function MyPage() {
  const [content, setContent] = useState("");

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Type your content here..."
      minHeight="min-h-[200px]"
      maxHeight="max-h-[400px]"
    />
  );
}
```

---

## Key Features

### KikiAiChatbot

- ✅ Session-based conversations
- ✅ Persistent chat history via localStorage
- ✅ Token sanitization for secure API calls
- ✅ Multiple response format support
- ✅ Auto-scrolling chat window
- ✅ Loading states and error handling
- ✅ User & AI avatars
- ✅ Apply message to parent component
- ✅ Start new chat functionality
- ✅ Smooth animations

### RichTextEditor

- ✅ **Text Formatting**: Bold, Italic, Underline, Strikethrough
- ✅ **Headings**: H1, H2, H3
- ✅ **Lists**: Bullet and numbered
- ✅ **Alignment**: Left, Center, Right
- ✅ **Links**: Insert with URL prompt
- ✅ **Undo/Redo**: Full support
- ✅ **Clear Formatting**: With confirmation
- ✅ **Paste Sanitization**: Strips HTML
- ✅ **Format Highlighting**: Shows active formats
- ✅ **Character Counter**: Optional

### PR Create Page Improvements

- ✅ Side-by-side layout (content editor + AI assistant)
- ✅ Better validation with clear error messages
- ✅ localStorage quota handling
- ✅ Image upload error recovery
- ✅ Content preview toggle
- ✅ Clear content confirmation
- ✅ Character count display
- ✅ Toast notifications for all actions
- ✅ Responsive design (mobile-friendly)

---

## Common Edge Cases Handled

### localStorage Issues

```tsx
// Quota exceeded detection
try {
  localStorage.setItem("key", JSON.stringify(data));
} catch (e) {
  if (e.name === "QuotaExceededError") {
    toast.error("Storage full. Clear some data.");
  }
}
```

### API Token Sanitization

```tsx
// Before: `"abc123"`, `  abc123  `, `abc\n123`
const cleanToken = sanitizeAuthToken(rawToken);
// After: `abc123` (clean string)
```

### Response Normalization

```tsx
// Handles multiple formats:
const normalized = normalizeToPlainText({
  content: "...", // or
  body: "...", // or
  subject: "...", // or
  "...": "...", // nested
});
```

### Null Reference Safety

```tsx
// Safe ref access
if (!editorRef.current) return;
editorRef.current.scrollTo({ top: 0 });
```

---

## Troubleshooting

### Components Not Showing?

1. Check imports are correct
2. Verify Tailwind CSS is configured
3. Check lucide-react icons are available
4. Verify parent component has correct height/width

### Chat History Not Persisting?

1. Check browser localStorage is enabled
2. Verify `chatHistoryKey` prop is unique
3. Check localStorage quota isn't exceeded
4. Look for console warnings about storage

### Editor Formatting Not Working?

1. Ensure content is in a `contentEditable` div
2. Try clicking in editor first
3. Check browser console for errors
4. Try paste-as-plain-text (Ctrl+Shift+V)

### API Calls Failing?

1. Verify `apiEndpoint` is correct
2. Check auth token is being sent
3. Look at network tab for response details
4. Check CORS headers on backend
5. Verify token hasn't expired

---

## Performance Tips

### For KikiAiChatbot

- Set `maxHeight` to reasonable value (prevents unbounded growth)
- Use unique `chatHistoryKey` per feature
- Consider clearing old sessions periodically
- Lazy load avatar images if many users

### For RichTextEditor

- Don't render multiple editors with large content
- Use `maxHeight` to keep editor scrollable
- Clear formatting occasionally for long documents
- Consider debouncing `onChange` if parent updates frequently

### For PR Create Page

- Image conversion uses FileReader async
- Validation is instant (no network calls)
- localStorage operations are non-blocking
- Navigation only happens after full validation

---

## Browser Support

### Fully Supported

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partially Supported

- Mobile browsers (responsive design works, but undo/redo limited)
- IE 11 (not supported - uses modern ES features)

### Known Limitations

- `document.queryCommandState()` not available in all contexts
- localStorage disabled in private browsing mode
- File upload size depends on browser
- contentEditable behavior varies slightly per browser

---

## API Expectations

### For KikiAiChatbot (Default Endpoint)

```typescript
POST /api/v1/ai-email/generate-email
Body: {
  context: string;
  tone?: string;
  continueThread?: boolean;
  sessionId?: string;
}

Response: {
  success: boolean;
  message?: string;
  data?: {
    content?: string;
    subject?: string;
    body?: string;
    [key: string]: any;
  }
}
```

You can override `apiEndpoint` prop for different APIs.

---

## localStorage Schema

### KikiAiChatbot History

```typescript
localStorage.setItem(
  "pr_creation_chat_history",
  JSON.stringify([
    {
      role: "user" | "ai",
      message: string,
      time: string,
      raw: any,
    },
    // ...
  ])
);
```

### PR Create Form Data

```typescript
localStorage.setItem(
  "pr_step_one",
  JSON.stringify({
    title: string,
    pr_content: string,
    status: "Draft",
  })
);

localStorage.setItem("pr_step_one_image", "data:image/png;base64,...");
```

---

## Styling & Theming

### Using Default Styles

Components use Tailwind CSS with predefined colors:

- Primary: `var(--primary)` (orange)
- Borders: `#E2E8F0` (light gray)
- Text: `#1B223C` (dark orange)
- Background: `#F3F6F8` (off-white)

### Custom Styling

Most components accept `className` prop:

```tsx
<RichTextEditor
  className="custom-class"
  // ...
/>
```

For deeper customization, fork components and modify Tailwind classes.

---

## Migration Guide (From Old Code)

### Email Campaign Page

Still uses original implementation - no changes needed.

### PR Create Page

Before:

```tsx
<Textarea
  showToolbar
  value={prContent}
  onChange={(e) => setPrContent(e.target.value)}
/>
```

After:

```tsx
<RichTextEditor value={prContent} onChange={setPrContent} />
```

### Adding Chatbot to New Page

Before: No chatbot available
After:

```tsx
<KikiAiChatbot
  onApplyMessage={(msg) => {
    /* handle */
  }}
/>
```

---

## Support & Questions

See `EDGE_CASES_GUIDE.md` for comprehensive edge case documentation.
See `IMPLEMENTATION_SUMMARY.md` for technical details.

For issues:

1. Check browser console for errors
2. Check network tab for API failures
3. Review localStorage in DevTools
4. Check component props are correct
5. Look for TypeScript errors in IDE

---

## Version Info

- **Created**: December 2024
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 3+
- **Icons**: lucide-react 0.553+
- **State**: Redux + React hooks
- **HTTP**: Axios
- **Notifications**: react-hot-toast
- **Animations**: Framer Motion
