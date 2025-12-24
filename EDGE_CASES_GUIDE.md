# Edge Cases & Error Handling Guide

## Components Overview

### 1. KikiAiChatbot Component (`src/components/ui/KikiAiChatbot.tsx`)
**Features:**
- Reusable AI chat assistant with session management
- Persistent chat history via localStorage
- Token sanitization & authentication
- Auto-scrolling and loading states

**Edge Cases Handled:**

#### Token Sanitization
```typescript
// Handles null/undefined tokens
if (!tok && tok !== 0) return null;

// Removes quotes and whitespace
// Cleans up newlines from environment variables
// Result: clean Bearer token for API requests
```

**Issue:** Tokens from environment might have quotes, newlines, or extra whitespace.
**Solution:** `sanitizeAuthToken()` function removes these before API calls.

#### localStorage Failures
```typescript
try {
  const stored = localStorage.getItem(chatHistoryKey);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      setChat(parsed);
    }
  }
} catch (e) {
  console.warn("Failed to load chat history:", e);
  // Chat starts empty, doesn't crash
}
```

**Issue:** localStorage might be disabled, quota exceeded, or corrupted JSON.
**Solution:** Wrapped in try-catch with fallback to empty chat state.

#### API Response Normalization
```typescript
const normalizeToPlainText = (d: any) => {
  // Handles multiple response formats:
  // - d.content: string
  // - d: direct object or string
  // - JSON with subject/body fields
  // - Array or nested objects
  
  // Filters out continuation markers (---Reply continued---)
  // Removes redundant greetings ("Hi there, ...")
  // Cleans up malformed JSON
};
```

**Issue:** AI API might return inconsistent formats (JSON, plain text, nested objects).
**Solution:** Comprehensive normalization handles all cases gracefully.

#### Chat Session Management
```typescript
const shouldContinueThread = chat.filter(msg => msg.role === "user").length > 0;
// Only sets continueThread=true if we have previous user messages
// Prevents empty first messages from breaking thread context
```

**Issue:** First message shouldn't try to continue a thread.
**Solution:** Check if we have prior user messages before setting continueThread flag.

#### Auto-Scroll Edge Cases
```typescript
React.useEffect(() => {
  try {
    const el = kikiPanelRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  } catch (e) {
    // Scroll might fail if element unmounts during animation
  }
}, [chat, loading]);
```

**Issue:** Scroll might fail if ref becomes null during animation.
**Solution:** Try-catch wrapper silently handles scroll failures.

#### Message Application
```typescript
const handleApplyMessage = (idx: number) => {
  const msg = chat[idx];
  if (!msg || msg.role !== 'ai') {
    toast.error("No AI message to apply");
    return;
  }
  if (onApplyMessage) {
    onApplyMessage(msg.message);
  }
};
```

**Issue:** User might try to apply non-existent or user messages.
**Solution:** Validate message existence and role before applying.

---

### 2. RichTextEditor Component (`src/components/ui/RichTextEditor.tsx`)
**Features:**
- Enhanced contentEditable editor with toolbar
- Comprehensive formatting (bold, italic, headings, lists, alignment)
- Undo/redo support
- Paste sanitization
- Clear formatting option

**Edge Cases Handled:**

#### Paste Sanitization
```typescript
const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
};
```

**Issue:** Pasting might include unwanted HTML/styles.
**Solution:** Extract plain text only, ignoring formatting.

#### Format State Tracking
```typescript
const updateActiveFormats = () => {
  const formats = new Set<string>();
  
  if (document.queryCommandState("bold")) formats.add("bold");
  if (document.queryCommandState("italic")) formats.add("italic");
  // ... etc
  
  setActiveFormats(formats);
  
  // Check undo/redo (browser-dependent)
  try {
    setCanUndo(document.queryCommandEnabled("undo"));
    setCanRedo(document.queryCommandEnabled("redo"));
  } catch (e) {
    // Some browsers don't support this
  }
};
```

**Issue:** Format state might desync, undo/redo detection is browser-dependent.
**Solution:** Update on input, focus, click, keyup, and mouseup events. Wrap undo/redo check in try-catch.

#### contentEditable Edge Cases
```typescript
<div
  ref={editorRef}
  contentEditable
  suppressContentEditableWarning  // Suppresses React warning
  onInput={handleEditorInput}
  onPaste={handlePaste}
  onFocus={handleFocus}
  onClick={handleFocus}
  onKeyUp={updateActiveFormats}
  onMouseUp={updateActiveFormats}
  data-placeholder={placeholder}
>
  {value}
</div>
```

**Issue:** contentEditable div renders children as text, not DOM.
**Solution:** Use innerHTML for state, innerText for display, controlled via `value` prop and `onChange` callback.

#### Clear Formatting Confirmation
```typescript
const handleClearFormatting = () => {
  if (confirm("Are you sure you want to clear all formatting?")) {
    if (editorRef.current) {
      const plainText = editorRef.current.innerText;
      editorRef.current.innerHTML = plainText;
      onChange(plainText);
    }
  }
};
```

**Issue:** User might accidentally click clear formatting.
**Solution:** Add confirmation dialog before destructive action.

#### Link Insertion
```typescript
const handleInsertLink = () => {
  const url = prompt("Enter URL:", "https://");
  if (url) {
    execCommand("createLink", url);
  }
};
```

**Issue:** Empty URL or user cancels.
**Solution:** Check if URL exists before executing command.

---

### 3. PR Create Page Integration (`src/app/(app)/pr/create/page.tsx`)
**Features:**
- Multi-step form with persistence
- RichTextEditor for content
- KikiAiChatbot for AI assistance
- File upload handling
- Data persistence to localStorage

**Edge Cases Handled:**

#### localStorage Quota Management
```typescript
try {
  localStorage.setItem("pr_step_one", JSON.stringify(draft));
} catch (storageError) {
  if (storageError instanceof Error && storageError.name === "QuotaExceededError") {
    toast.error("Storage quota exceeded. Please clear some data.");
    return;
  }
  throw storageError;
}
```

**Issue:** localStorage might be full or disabled.
**Solution:** Catch QuotaExceededError specifically and inform user.

#### Image Base64 Conversion
```typescript
if (image) {
  try {
    const imageBase64 = await fileToBase64(image);
    localStorage.setItem("pr_step_one_image", imageBase64);
  } catch (imageError) {
    console.warn("Failed to save image:", imageError);
    toast.error("Image could not be saved, but PR content will be saved.");
  }
}
```

**Issue:** Image might be too large or conversion might fail.
**Solution:** Separate try-catch for image, allow form to proceed without image.

#### Validation Edge Cases
```typescript
// Check both title input ref and string value
if (!prContent.trim()) {
  toast.error("Press release content is required.");
  return;
}

if (title.current && !title.current.value.trim()) {
  toast.error("Press release title is required.");
  return;
}
```

**Issue:** Empty strings, whitespace-only strings, null refs.
**Solution:** Check ref existence and trim() before validation.

#### AI Message Application
```typescript
const handleApplyAiMessage = (message: string) => {
  setPrContent(message);
  toast.success("AI content applied to editor");
};
```

**Issue:** Applying AI message overwrites current content.
**Solution:** User sees success toast confirming action.

#### Data Cleanup on Mount
```typescript
useEffect(() => {
  const clearOldData = () => {
    try {
      localStorage.removeItem("pr_step_one");
      localStorage.removeItem("pr_step_one_image");
      localStorage.removeItem("cart");
      localStorage.removeItem("pr_id");
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  };
  
  // Only clear on initial mount (no dependency)
  clearOldData();
}, []);
```

**Issue:** Old data might interfere with new PR creation.
**Solution:** Clean old data only on component mount, wrapped in try-catch.

#### Chat History Persistence
```typescript
<KikiAiChatbot
  chatHistoryKey="pr_creation_chat_history"
  // ... other props
/>
```

**Issue:** Chat history might leak between different PR creations.
**Solution:** Use dedicated `chatHistoryKey` that's different from email campaigns.

#### Content Length Tracking
```typescript
<div className="mt-4 flex gap-2 text-xs text-gray-500">
  <span>Tip: {prContent.length} characters</span>
</div>
```

**Shows:** Real-time character count for user feedback.

---

## Best Practices Implemented

### 1. Error Boundaries
- All localStorage operations wrapped in try-catch
- API calls use try-catch with error messaging
- Form submission validates before proceeding

### 2. User Feedback
- Toast notifications for all actions (success, error, warning)
- Loading states disable form/buttons
- Error messages displayed inline and in toasts

### 3. State Management
- Session IDs track chat context
- localStorage keys are unique per feature
- State updates are atomic and validated

### 4. Performance
- Auto-scroll uses smooth behavior (can be disabled)
- Editor ref checks prevent null reference errors
- Debounced format state updates

### 5. Accessibility
- Buttons have title attributes (hover tooltips)
- Disabled states properly reflected
- Tab index management on editable elements

---

## Testing Recommendations

### Test Cases for KikiAiChatbot

1. **Token Sanitization**
   - Test with quoted tokens: `"abc123"`, `'abc123'`
   - Test with whitespace: `  abc123  `
   - Test with newlines: `abc\n123`
   - Test with null/undefined

2. **localStorage Failures**
   - Test with localStorage disabled
   - Test with storage quota exceeded
   - Test with corrupted JSON in stored history

3. **API Errors**
   - Test with failed API request
   - Test with malformed response
   - Test with network timeout

4. **Chat State**
   - Test first message (no continueThread)
   - Test multiple messages in sequence
   - Test apply message with invalid index

### Test Cases for RichTextEditor

1. **Paste Handling**
   - Paste HTML-formatted text
   - Paste plain text
   - Paste images (should fail gracefully)

2. **Format Persistence**
   - Apply format, verify active state
   - Remove format, verify state updates
   - Switch between formats

3. **Edge Cases**
   - Very large content (> 100KB)
   - Special characters and emoji
   - Mixed languages

### Test Cases for PR Create Page

1. **Form Validation**
   - Submit with empty title
   - Submit with empty content
   - Submit with only whitespace

2. **File Upload**
   - Upload large image (> 10MB)
   - Upload unsupported file type
   - Cancel file selection

3. **Navigation**
   - Navigate away without saving
   - Navigate back and verify data preserved
   - Complete full form submission

4. **localStorage**
   - Fill form, check localStorage
   - Verify data persists after reload
   - Check with storage disabled

---

## Future Improvements

1. **RichTextEditor Enhancements**
   - Add markdown support
   - Add table insertion
   - Add code block support
   - Character/word count with limits

2. **KikiAiChatbot Enhancements**
   - Add export chat to PDF
   - Add copy message to clipboard
   - Add regenerate last message
   - Add tone/style selector

3. **PR Create Improvements**
   - Add auto-save drafts
   - Add version history
   - Add template suggestions
   - Add plagiarism check

4. **General**
   - Add comprehensive error logging service
   - Add analytics tracking
   - Add offline support via Service Workers
   - Add real-time collaboration features
