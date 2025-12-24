# Conversions Admin - Testing Guide

## 🧪 Manual Testing Scenarios

### Prerequisites
- Backend API running on `http://localhost:8000`
- User authenticated with admin privileges
- Sample conversion data available in database

---

## Test Scenario 1: Load Conversions List

**Steps:**
1. Navigate to `/dashboard/admin/conversions`
2. Wait for data to load

**Expected Results:**
- ✅ Page loads without errors
- ✅ Conversions table displays with header row
- ✅ All conversion records are visible
- ✅ Loading spinner appears briefly
- ✅ Pagination shows total count

**Failure Cases to Check:**
- ❌ API returns 401 → Should redirect to login
- ❌ API returns 500 → Should show error alert
- ❌ Network timeout → Should show error message
- ❌ Invalid response format → Should show error

**Code to Test:**
```typescript
// In ConversionsPage
fetchConversions() // Called on mount and page change
```

---

## Test Scenario 2: Search Functionality

### Test 2a: Search by First Name
**Steps:**
1. Open conversions list
2. Type "Simeon" in search box
3. Wait for filter to apply

**Expected Results:**
- ✅ Table updates instantly
- ✅ Only shows conversions with "Simeon" as first name
- ✅ Result count updates
- ✅ Non-matching rows disappear

### Test 2b: Search by Email
**Steps:**
1. Type "mrayendi" in search box
2. Observe table

**Expected Results:**
- ✅ Filters by partial email match
- ✅ Case-insensitive search
- ✅ Instant results

### Test 2c: Search by Wallet
**Steps:**
1. Type wallet address partial value
2. Observe table

**Expected Results:**
- ✅ Finds conversions with matching wallet
- ✅ Partial matches work

### Test 2d: Empty Search
**Steps:**
1. Clear search box
2. Observe table

**Expected Results:**
- ✅ Shows all conversions again
- ✅ Result count updates to total

**Edge Cases to Test:**
- ❌ Search with special characters
- ❌ Very long search string
- ❌ Numbers in search
- ❌ Empty spaces only

---

## Test Scenario 3: Status Filtering

### Test 3a: Filter by Pending
**Steps:**
1. Open Status dropdown
2. Select "Pending"

**Expected Results:**
- ✅ Only shows Pending conversions
- ✅ Result count updates
- ✅ Approve/Reject buttons visible

### Test 3b: Filter by Approved
**Steps:**
1. Select "Approved" from dropdown

**Expected Results:**
- ✅ Only shows Approved conversions
- ✅ No action buttons for approved items
- ✅ Shows resolved timestamp

### Test 3c: Filter by Rejected
**Steps:**
1. Select "Rejected" from dropdown

**Expected Results:**
- ✅ Only shows Rejected conversions
- ✅ No action buttons for rejected items

### Test 3d: Combined Search + Filter
**Steps:**
1. Search for "Simeon"
2. Filter by "Pending"

**Expected Results:**
- ✅ Shows only pending conversions for Simeon
- ✅ Both filters apply together
- ✅ Reset pagination

**Edge Cases:**
- ❌ Filter + search with no results
- ❌ Switch filter multiple times
- ❌ Filter while on page 2 (should go to page 1)

---

## Test Scenario 4: Pagination

### Test 4a: Navigate Pages
**Steps:**
1. Load conversions list
2. Click page 2 button
3. Verify data changes

**Expected Results:**
- ✅ Table shows next 10 items
- ✅ Page number updates
- ✅ Back button becomes enabled
- ✅ Correct items displayed for page

### Test 4b: First/Last Page Limits
**Steps:**
1. Click prev on page 1
2. Click next on last page

**Expected Results:**
- ✅ Buttons are disabled
- ✅ No navigation occurs

### Test 4c: Filter Resets Pagination
**Steps:**
1. Go to page 2
2. Apply search filter

**Expected Results:**
- ✅ Returns to page 1
- ✅ Shows filtered results

**Edge Cases:**
- ❌ Click multiple times quickly
- ❌ Change filter mid-pagination
- ❌ Very large page numbers

---

## Test Scenario 5: View Conversion Details

**Steps:**
1. Click "View" button on any conversion
2. Modal opens
3. Verify all information displays

**Expected Results:**
- ✅ Modal displays correctly
- ✅ All user info shows
- ✅ Amount displays with formatting
- ✅ Wallet address fully visible
- ✅ All dates display correctly
- ✅ Status badge shows
- ✅ Close button works

### Detail Modal Sections to Check:
- [ ] Status badge with color
- [ ] User name and email
- [ ] Amount with $ formatting
- [ ] Wallet address with copy button
- [ ] All 4 dates (requested, created, updated, resolved if applicable)
- [ ] Admin ID if available

**Edge Cases:**
- ❌ Missing user first name
- ❌ Missing user last name
- ❌ Missing email
- ❌ Missing wallet address
- ❌ Amount is 0
- ❌ No resolved_at for pending

---

## Test Scenario 6: Approve Conversion

### Test 6a: Approve from Table
**Steps:**
1. Find pending conversion
2. Click "Approve" button
3. Wait for API response
4. Check toast notification

**Expected Results:**
- ✅ Button shows loading spinner during request
- ✅ Toast shows "Conversion approved successfully!"
- ✅ Status in table changes to "Approved"
- ✅ Approve/Reject buttons disappear
- ✅ Local state updates instantly

### Test 6b: Approve from Modal
**Steps:**
1. Click "View" on pending conversion
2. Click "Approve" in modal
3. Check modal closes

**Expected Results:**
- ✅ Modal shows loading state
- ✅ Toast notification appears
- ✅ Modal auto-closes after 500ms
- ✅ Table updates

### Test 6c: Multiple Approvals
**Steps:**
1. Approve multiple conversions
2. Check all update properly

**Expected Results:**
- ✅ Each one updates independently
- ✅ No cross-contamination
- ✅ All show success messages

**Error Cases to Test:**
- ❌ Approve with network error
- ❌ Approve invalid conversion ID
- ❌ Approve non-pending conversion
- ❌ Rapid double-click approve

---

## Test Scenario 7: Reject Conversion

### Test 7a: Reject from Table
**Steps:**
1. Find pending conversion
2. Click "Reject" button
3. Wait for response

**Expected Results:**
- ✅ Status changes to "Rejected"
- ✅ Toast shows success message
- ✅ Buttons disappear
- ✅ Local state updates

### Test 7b: Reject from Modal
**Steps:**
1. View pending conversion
2. Click "Reject" in modal

**Expected Results:**
- ✅ Modal closes on success
- ✅ Table shows updated status
- ✅ Toast notification appears

### Test 7c: Approval/Rejection Flow
**Steps:**
1. View conversion
2. Click Reject
3. Close modal
4. Approve a different one

**Expected Results:**
- ✅ All operations complete successfully
- ✅ States don't interfere with each other

**Error Cases:**
- ❌ Same as approve tests above

---

## Test Scenario 8: Copy to Clipboard

### Test 8a: Copy Email
**Steps:**
1. View conversion details
2. Click copy icon next to email
3. Try to paste

**Expected Results:**
- ✅ Toast: "Email copied to clipboard"
- ✅ Email value copied to clipboard
- ✅ Can paste into another field

### Test 8b: Copy Wallet
**Steps:**
1. Click copy icon next to wallet
2. Verify in clipboard

**Expected Results:**
- ✅ Toast: "Wallet address copied to clipboard"
- ✅ Full wallet address copied
- ✅ Can paste elsewhere

### Test 8c: Copy Failures
**Steps:**
1. Test on unsecured connection (if applicable)

**Expected Results:**
- ✅ Error toast appears
- ✅ Clear error message

---

## Test Scenario 9: Error Handling

### Test 9a: Network Error
**Steps:**
1. Disconnect network
2. Try to load conversions

**Expected Results:**
- ✅ Error message displays
- ✅ Error alert appears
- ✅ Refresh button available

### Test 9b: Invalid API Response
**Steps:**
1. Mock invalid response
2. Load data

**Expected Results:**
- ✅ Error message shows
- ✅ No crash
- ✅ Can retry

### Test 9c: Timeout
**Steps:**
1. Slow network condition
2. Load data

**Expected Results:**
- ✅ Shows loading state
- ✅ Eventually resolves or errors
- ✅ No infinite loading

### Test 9d: Missing Fields
**Steps:**
1. Test with minimal data
2. Check UI handles gracefully

**Expected Results:**
- ✅ No crashes
- ✅ Safe fallbacks
- ✅ Warnings where appropriate

---

## Test Scenario 10: Empty States

### Test 10a: No Conversions
**Steps:**
1. Filter for status with no items

**Expected Results:**
- ✅ Shows "No conversions found"
- ✅ Helpful message
- ✅ No broken UI

### Test 10b: Search Returns Empty
**Steps:**
1. Search for non-existent term

**Expected Results:**
- ✅ Shows empty state
- ✅ Result count shows 0
- ✅ Clear message

---

## Test Scenario 11: Responsive Design

### Test 11a: Mobile (375px)
**Steps:**
1. Open browser dev tools
2. Set viewport to 375px width
3. Navigate conversions page

**Expected Results:**
- ✅ Table scrolls horizontally
- ✅ Buttons accessible on mobile
- ✅ Modal fits on screen
- ✅ Text readable

### Test 11b: Tablet (768px)
**Steps:**
1. Set viewport to 768px

**Expected Results:**
- ✅ Layout adapts
- ✅ All elements visible
- ✅ Touch-friendly sizes

### Test 11c: Desktop (1920px+)
**Steps:**
1. Set viewport to 1920px

**Expected Results:**
- ✅ Uses available space
- ✅ Clean layout
- ✅ All columns visible

---

## Test Scenario 12: Accessibility

### Test 12a: Keyboard Navigation
**Steps:**
1. Unplug mouse
2. Navigate using Tab key
3. Press Enter on buttons

**Expected Results:**
- ✅ Can navigate to all elements
- ✅ Buttons activate with Enter
- ✅ Focus visible

### Test 12b: Screen Reader
**Steps:**
1. Use screen reader
2. Navigate page

**Expected Results:**
- ✅ Headings announced
- ✅ Button purposes clear
- ✅ Data table readable

### Test 12c: Color Contrast
**Steps:**
1. Check text contrast
2. Verify readability

**Expected Results:**
- ✅ All text meets WCAG standards
- ✅ Status badges readable

---

## Test Scenario 13: Performance

### Test 13a: Large Dataset
**Steps:**
1. Load page with 1000+ conversions
2. Paginate through

**Expected Results:**
- ✅ Pagination works smoothly
- ✅ No lag
- ✅ Smooth scrolling

### Test 13b: Rapid Filtering
**Steps:**
1. Type fast in search box
2. Quickly change filters

**Expected Results:**
- ✅ UI remains responsive
- ✅ No freezing
- ✅ Correct results

### Test 13c: Modal Performance
**Steps:**
1. Open/close modal rapidly

**Expected Results:**
- ✅ Smooth animations
- ✅ No memory leaks
- ✅ Responsive

---

## Test Scenario 14: Toast Notifications

### All Toast Types:
- [ ] Success - Green, icon, message
- [ ] Error - Red, icon, message
- [ ] Info - Blue, icon, message

### Test Points:
- [ ] Appears in top-right corner
- [ ] Auto-dismisses after 3-4 seconds
- [ ] Can manually dismiss
- [ ] Multiple toasts stack
- [ ] No overlap with page content
- [ ] Readable text
- [ ] Proper icons

---

## 🔍 Checklist for Final Verification

- [ ] All endpoints working
- [ ] No console errors
- [ ] No console warnings
- [ ] All notifications display
- [ ] Error messages user-friendly
- [ ] Mobile responsive
- [ ] Accessibility standards met
- [ ] Performance acceptable
- [ ] No memory leaks
- [ ] Toast notifications working
- [ ] Pagination functional
- [ ] Search/filter working
- [ ] Approve/Reject working
- [ ] Modal displays correctly
- [ ] Copy to clipboard working
- [ ] Loading states visible
- [ ] Empty states handled
- [ ] Edge cases covered

---

## 📊 Test Data

Sample conversions from API response:
```
- 12 conversions in database
- Various statuses: Pending (10), Approved (1), Rejected (1)
- Amounts: 0, 200, 400, 1000, 2000, 3000, 5000
- Multiple users: Simeon Ayendi
- Different wallets
- Date range: Nov 27 - Dec 16, 2025
```

---

## 🐛 Known Issues & Workarounds

*None currently identified*

If you encounter issues, check:
1. Backend API is running
2. Authentication token is valid
3. User has admin permissions
4. Network connection is stable
5. Browser console for errors

---

## 📝 Test Result Template

```
Date: [DATE]
Tester: [NAME]
Browser: [BROWSER]
Device: [DEVICE]
OS: [OS]

✅ Tests Passed: [X]
❌ Tests Failed: [X]
⏭️ Tests Skipped: [X]

Issues Found:
[List any issues]

Notes:
[Additional observations]
```

---

## 🎯 Priority Tests

**Must Pass:**
1. Load conversions list
2. Search functionality
3. Filter by status
4. Approve conversion
5. Reject conversion
6. Error handling

**Should Pass:**
1. Pagination
2. View details
3. Copy to clipboard
4. Responsive design
5. Toast notifications

**Nice to Have:**
1. Performance optimization
2. Accessibility features
3. Additional edge cases

