# Conversions Admin Page - Integration Guide

## Overview
This implementation provides a professional admin dashboard for managing user crypto conversions. It integrates with the following endpoints:

### Endpoints Integrated
1. **Fetch All Conversions**: `GET /api/v1/conversions/admin/all`
2. **Approve Conversion**: `POST /api/v1/conversions/admin/{id}/approve`
3. **Reject Conversion**: `POST /api/v1/conversions/admin/{id}/reject`

## Features

### Core Functionality
- **List View**: Display all conversions in a professional table format
- **Search & Filter**: Search by user name, email, or wallet address
- **Status Filtering**: Filter conversions by status (Pending, Approved, Rejected)
- **Pagination**: Navigate through conversions with limit of 10 per page
- **Detail Modal**: View comprehensive conversion details
- **Approval/Rejection**: Quick actions to approve or reject pending conversions
- **Real-time Updates**: Local state updates for instant UI feedback

### Edge Cases Handled
1. **Empty Data**: Graceful handling when no conversions exist
2. **Invalid Data**: Null/undefined checks for user data and wallet addresses
3. **Network Errors**: Comprehensive error handling with user-friendly messages
4. **Race Conditions**: Action loading states prevent duplicate requests
5. **Missing Fields**: Safe fallbacks for optional fields
6. **API Failures**: Proper error messages and recovery options

### UI/UX Enhancements
- **Loading States**: Animated spinners during data fetch and actions
- **Toast Notifications**: Real-time feedback for all user actions
- **Error Alerts**: Persistent error display with dismiss option
- **Clipboard Copy**: One-click copy functionality for wallet addresses
- **Status Badges**: Color-coded status indicators
- **Responsive Design**: Mobile-friendly layout
- **Accessibility**: Proper keyboard navigation and ARIA labels

## File Structure

```
src/
├── app/(app)/admin/conversions/
│   ├── page.tsx           # Main conversions page
│   └── layout.tsx         # Layout wrapper
├── components/admin/
│   └── ConversionDetailModal.tsx  # Detail modal component
├── lib/
│   └── conversions-api.ts # API service functions
└── types/
    └── conversions.ts     # TypeScript type definitions
```

## Components

### ConversionsPage (`page.tsx`)
The main admin page component with the following responsibilities:
- Fetches and displays conversions
- Handles filtering and searching
- Manages approval/rejection actions
- Displays pagination

**State Management:**
- `conversions`: Array of conversion records
- `loading`: Loading state for initial fetch
- `actionLoading`: Tracks which conversion is being processed
- `searchTerm`: Current search query
- `statusFilter`: Selected status filter
- `currentPage`: Current page number
- `selectedConversion`: Currently selected conversion for detail view
- `error`: Error message display

### ConversionDetailModal (`ConversionDetailModal.tsx`)
Modal component showing detailed conversion information:
- User information (name, email)
- Conversion amount and type
- Solana wallet address with copy button
- Timeline (requested, created, updated, resolved dates)
- Admin action buttons

### API Service (`conversions-api.ts`)
Centralized API functions:
- `fetchAllConversions(page, limit)`: Fetch conversions with pagination
- `approveConversion(conversionId)`: Approve a conversion
- `rejectConversion(conversionId)`: Reject a conversion

## Usage

### Access the Page
Navigate to: `/dashboard/admin/conversions`

### Search and Filter
1. Use the search box to find conversions by:
   - User first/last name
   - User email
   - Solana wallet address

2. Use the status dropdown to filter by:
   - All Status
   - Pending
   - Approved
   - Rejected

### Approve/Reject Conversions
**From the Table:**
1. Click "Approve" or "Reject" buttons on pending conversions
2. Confirmation will appear via toast notification

**From the Detail Modal:**
1. Click "View" button on any conversion
2. In the modal, click "Approve" or "Reject"
3. Modal will auto-close on successful action

### Copy Information
Click the copy icon next to:
- Email address
- Wallet address

## Error Handling

The implementation includes comprehensive error handling for:

### Network Errors
- Failed API requests show user-friendly error messages
- Errors are logged to console for debugging
- "Refresh" button available to retry loading data

### Validation Errors
- Missing or invalid data shows appropriate warnings
- Invalid conversions prevent actions

### User Feedback
All actions provide immediate feedback via:
- **Toast Notifications**: Success, error, and info messages
- **Error Alerts**: Persistent error display with dismiss option
- **Loading States**: Visual indicators during operations

## Toast Messages

The application uses react-hot-toast for notifications:

### Success Messages
- "Conversion approved successfully!"
- "Conversion rejected successfully!"
- "[Field] copied to clipboard"

### Error Messages
- "Error loading conversions"
- "Error approving/rejecting conversion"
- "Invalid conversion data"
- Custom API error messages

### Info Messages
- "Refreshing..." during data reload

## Performance Optimizations

1. **useCallback Hooks**: Prevent unnecessary re-renders of event handlers
2. **Memoized Filters**: Filter conversions only when data or filters change
3. **Efficient Pagination**: Load 10 items per page by default
4. **Local State Updates**: Optimistic UI updates for actions
5. **Debounced Search**: Immediate filtering with minimal processing

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## Future Enhancements

Possible improvements for future versions:
1. **Bulk Actions**: Select multiple conversions for batch approval/rejection
2. **Export**: Download conversion data as CSV/PDF
3. **Advanced Filters**: Filter by amount range, date range
4. **Admin Notes**: Add notes when approving/rejecting
5. **Audit Log**: Track all admin actions with timestamps
6. **Analytics**: Dashboard with conversion statistics
7. **Sorting**: Sort by amount, date, status
8. **Real-time Updates**: WebSocket for live data updates

## Dependencies

- `react`: UI framework
- `lucide-react`: Icon library
- `react-hot-toast`: Toast notifications
- `axios`: HTTP client (via `@/lib/api`)
- `typescript`: Type safety

## API Response Types

All API responses follow this structure:

```typescript
{
  statusCode: number;
  data: {
    items: Conversion[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  success: boolean;
}
```

## Configuration

### Pagination
Default limit: 10 conversions per page
Can be modified in `fetchAllConversions` call in `page.tsx`

### Status Filter Options
- "Pending": Awaiting admin decision
- "Approved": Approved by admin
- "Rejected": Rejected by admin
- "All": All conversions

## Troubleshooting

### Conversions Not Loading
1. Check API endpoint is accessible: `http://localhost:8000/api/v1/conversions/admin/all`
2. Verify authentication token is valid
3. Check browser console for error details
4. Click "Refresh" button to retry

### Approve/Reject Actions Not Working
1. Ensure conversion status is "Pending"
2. Check network tab for API response
3. Verify admin authorization
4. Check for validation errors in console

### Toasts Not Appearing
1. Ensure ToasterClient is mounted in root layout
2. Check CSS is properly loaded
3. Verify react-hot-toast is installed

## Support

For issues or questions about this implementation, refer to:
- Component code comments
- TypeScript type definitions
- API service documentation
