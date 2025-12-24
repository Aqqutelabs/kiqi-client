# ⚡ Quick Start Guide - Conversions Admin

## 🚀 Getting Started in 5 Minutes

### Step 1: Start Your Backend
```bash
# Make sure your Node.js backend is running
npm run dev
# Backend should be running on http://localhost:8000
```

### Step 2: Start Your Frontend
```bash
# In your Next.js project directory
npm run dev
# Frontend should be running on http://localhost:3000
```

### Step 3: Navigate to the Page
```
Open: http://localhost:3000/dashboard/admin/conversions
```

### Step 4: Start Using!
- **Search** for conversions by name, email, or wallet
- **Filter** by status (Pending, Approved, Rejected)
- **View** full details by clicking "View"
- **Approve** or **Reject** conversions
- **Copy** wallet addresses and emails

---

## 📋 What You Can Do

### View Conversions
✅ See all conversions in a professional table
✅ See user names, amounts, wallets, and status
✅ Shows when each conversion was requested

### Search & Filter
✅ Search by user first name or last name
✅ Search by user email
✅ Search by wallet address
✅ Filter by status (Pending, Approved, Rejected)
✅ Results update instantly

### View Details
✅ Click "View" to see full conversion details
✅ See complete user information
✅ See conversion amount and type
✅ See full Solana wallet address
✅ See timeline of all events

### Approve Conversions
✅ Click "Approve" on pending conversions
✅ See loading indicator during action
✅ Get success confirmation
✅ Status updates immediately
✅ See admin ID and timestamp

### Reject Conversions
✅ Click "Reject" on pending conversions
✅ See loading indicator during action
✅ Get success confirmation
✅ Status updates immediately
✅ See admin ID and timestamp

### Copy Information
✅ Click copy icon next to email
✅ Click copy icon next to wallet address
✅ Toast confirmation when copied

---

## 🎯 Common Tasks

### Task: Find a Specific Conversion
```
1. Type user's name in search box
   → OR type their email
   → OR paste their wallet address

2. Results filter instantly

3. Click "View" for more details
```

### Task: Approve a Pending Conversion
```
1. Find pending conversion in table

2. Click "Approve" button

3. Wait for confirmation toast

4. See status change to "Approved"
```

### Task: Reject a Conversion
```
1. Find pending conversion in table

2. Click "Reject" button

3. Wait for confirmation toast

4. See status change to "Rejected"
```

### Task: Check Conversion Details
```
1. Click "View" on any conversion

2. Modal opens with all details:
   - User information
   - Amount and type
   - Wallet address
   - Full timeline
   - Admin info (if applicable)

3. Can approve/reject from modal

4. Click close to dismiss modal
```

---

## 🔧 Troubleshooting

### Issue: Page Won't Load
**Solution:**
1. Check backend is running on http://localhost:8000
2. Click "Refresh" button on page
3. Check browser console for errors

### Issue: No Conversions Showing
**Solution:**
1. Clear all filters and search
2. Click "Refresh" button
3. Check database has conversions
4. Try filter by "All Status"

### Issue: Approve/Reject Not Working
**Solution:**
1. Check conversion status is "Pending"
2. Try again after waiting a moment
3. Click "Refresh" and retry
4. Check browser console for errors

### Issue: Search Not Working
**Solution:**
1. Type full or partial text (min 1 character)
2. Make sure data exists
3. Try different search terms
4. Clear search box to see all

### Issue: Copy to Clipboard Not Working
**Solution:**
1. Try again with clipboard access
2. Check browser allows clipboard access
3. Try pasting (Ctrl+V) to test
4. Use manual copy instead

### Issue: Toasts Not Appearing
**Solution:**
1. Check top-right corner of screen
2. Scroll up if hidden
3. Check if browser notifications are enabled
4. Check console for errors

---

## 📱 Mobile Usage

### On Mobile Phone (375px)
- ✅ Table scrolls horizontally
- ✅ Touch-friendly buttons
- ✅ Modal fits on screen
- ✅ All functionality works

**Tips for Mobile:**
1. Swipe right on table to see more columns
2. Tap buttons precisely (they're touch-friendly)
3. Modal can be scrolled if content is long
4. Use portrait orientation for best view

### On Tablet (768px)
- ✅ Better spacing than mobile
- ✅ Most content visible
- ✅ All features accessible
- ✅ Landscape works well

---

## ⌨️ Keyboard Shortcuts

### Navigation
- `Tab` - Move between elements
- `Shift+Tab` - Move backward
- `Enter` - Activate button or link
- `Space` - Toggle buttons/checkboxes
- `Escape` - Close modal

### Table
- `Tab` - Move to next row/button
- `Enter` - Click button
- `Arrow Keys` - Navigate (if enabled)

### Search
- `Ctrl+F` - Browser find (not custom search)
- `Type` - Search while input focused
- `Backspace` - Delete search character

---

## 🎨 Interface Elements

### Color Meanings

**Status Badges:**
- 🟢 **Green** = Approved ✅
- 🟡 **Orange** = Rejected ❌
- 🟦 **Blue** = Pending ⏳

**Button Colors:**
- 🔵 **Blue** = Primary action
- 🟠 **Orange** = Secondary action
- 🟢 **Green** = Approve/Accept
- 🔴 **Red** = Reject/Delete
- 🟦 **Light Blue** = Link/Info

### Icons Used
- 🔍 Search icon
- 🔄 Refresh icon
- 📋 View/Details icon
- ✅ Approve icon
- ❌ Reject icon
- 📋 Copy icon
- ⬅️ Back icon

---

## 📊 Data Shown

### In Table
| Field | Shows |
|-------|-------|
| User | First name, last name, email |
| Amount | Formatted as $X,XXX.XX |
| Wallet | First 8 + last 8 chars (truncated) |
| Status | Color-coded badge |
| Requested | MM/DD/YYYY date format |
| Actions | View, Approve, Reject buttons |

### In Modal
- Full user information
- Full wallet address (copyable)
- Exact conversion amount
- All 4 timestamps
- Admin ID (if resolved)
- Current status

---

## 🔐 Permissions

### What You Need
- ✅ Admin user role
- ✅ Valid authentication token
- ✅ Access to conversions admin endpoint

### What You Can Do
- ✅ View all conversions
- ✅ Approve conversions
- ✅ Reject conversions
- ✅ See user details

### What You Cannot Do
- ❌ Edit conversions
- ❌ Delete conversions
- ❌ Modify user data
- ❌ Change amounts

---

## 💡 Tips & Tricks

### Tip 1: Use Multiple Filters
Combine search + status filter for better results:
```
Search: "Simeon"
Filter: "Pending"
→ Shows only pending conversions for Simeon
```

### Tip 2: Copy for External Use
Use copy buttons to share wallet addresses:
1. Click copy icon
2. Paste into spreadsheet or email
3. Toast confirms copy

### Tip 3: Batch Processing
Process multiple conversions:
1. Find a pending conversion
2. Click Approve
3. View next conversion
4. Repeat

### Tip 4: Check Timeline
View all dates in the detail modal:
- Requested: When user requested
- Created: When record created
- Updated: Last update time
- Resolved: When approved/rejected

### Tip 5: Pagination Navigation
Navigate efficiently:
1. Use page numbers to jump
2. Use arrows for next/prev
3. Results show page info
4. Filter resets to page 1

---

## ⚠️ Important Notes

### Authentication
- Must be logged in as admin
- If logged out, page redirects to login
- Token required for all API calls

### Data Accuracy
- Data fetched from backend in real-time
- Local updates reflect server state
- Refresh to see external changes

### Notifications
- All actions show toast messages
- Success = green, error = red
- Toasts auto-dismiss after 3 seconds
- Can manually dismiss

### Performance
- Page loads 10 conversions at a time
- Search/filter happens instantly
- Approve/Reject takes 1-2 seconds
- Copy to clipboard is instant

---

## 🚀 Best Practices

### ✅ Do This
- ✅ Review conversion details before approving
- ✅ Use search to find specific conversions
- ✅ Check wallet address carefully
- ✅ Note the timestamp of approval
- ✅ Refresh if data seems outdated
- ✅ Use keyboard navigation when possible

### ❌ Don't Do This
- ❌ Approve without checking details
- ❌ Forget to refresh before bulk operations
- ❌ Click multiple times on same button
- ❌ Close modal during action
- ❌ Navigate away while action loading

---

## 📞 Getting Help

### If Something Goes Wrong

1. **Check Error Message**
   - Read the error in the red alert
   - Look at toast notification

2. **Check Connection**
   - Is backend running?
   - Is network connected?
   - Check http://localhost:8000

3. **Refresh Page**
   - Click browser refresh (F5)
   - Or click page "Refresh" button
   - Try action again

4. **Check Browser Console**
   - Press F12
   - Look at Console tab
   - Find error messages

5. **Check Permissions**
   - Are you logged in?
   - Are you an admin?
   - Is token valid?

6. **Restart**
   - Close page
   - Clear browser cache (optional)
   - Reopen page
   - Try again

---

## 🎓 Learning Resources

### In the Project
- `CONVERSIONS_ADMIN_README.md` - Complete guide
- `TESTING_GUIDE.md` - Test scenarios
- `ARCHITECTURE_DIAGRAM.md` - How it works
- `PROJECT_SUMMARY.md` - Implementation details

### Code Structure
- `src/app/(app)/admin/conversions/page.tsx` - Main page
- `src/components/admin/ConversionDetailModal.tsx` - Detail modal
- `src/lib/conversions-api.ts` - API functions
- `src/types/conversions.ts` - Type definitions

---

## ✨ Summary

This admin page makes managing conversions easy:
1. **View** all conversions in one place
2. **Search** and **filter** quickly
3. **Review** full details with one click
4. **Approve** or **Reject** instantly
5. **Get** real-time feedback
6. **Works** on all devices

**Get started now:** http://localhost:3000/dashboard/admin/conversions

**Questions?** Check the documentation files in the project root.

Happy managing! 🎉
