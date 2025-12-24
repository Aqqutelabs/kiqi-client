# System Architecture & Data Flow

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interface Layer                         │
│                    (Conversions Admin Page)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
         ┌──────────▼──┐  ┌──▼────┐  ┌─▼──────────┐
         │ Conversions │  │Search │  │  Filter &  │
         │   Table     │  │& Copy  │  │ Pagination│
         └──────────────┘  └───────┘  └────────────┘
                    │         │         │
                    └─────────┼─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Detail Modal     │
                    │  (View Details)   │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐          ┌─────────┐        ┌──────────┐
    │ Approve │          │ Reject  │        │ Close/   │
    │ Button  │          │ Button  │        │ Navigate │
    └────┬────┘          └────┬────┘        └──────────┘
         │                    │
         └────────────┬───────┘
                      │
     ┌────────────────▼────────────────┐
     │  API Service Layer              │
     │  (conversions-api.ts)           │
     │  • fetchAllConversions()        │
     │  • approveConversion()          │
     │  • rejectConversion()           │
     └────────────────┬────────────────┘
                      │
     ┌────────────────▼──────────────────────┐
     │  HTTP Requests (Axios)               │
     │  • Auth interceptor                  │
     │  • Error handling                    │
     │  • Token management                  │
     └────────────────┬──────────────────────┘
                      │
                      │ HTTP/HTTPS
                      │
     ┌────────────────▼──────────────────────┐
     │  Backend API (Node.js/Express)       │
     │  Base: http://localhost:8000         │
     │  Endpoints:                          │
     │  • GET /api/v1/conversions/admin/all │
     │  • POST /conversions/admin/{id}/...  │
     └────────────────┬──────────────────────┘
                      │
     ┌────────────────▼──────────────────────┐
     │  Database (MongoDB)                  │
     │  Collections:                        │
     │  • conversions                       │
     │  • users                             │
     └──────────────────────────────────────┘
```

---

## 📊 Component Hierarchy

```
ConversionsPage (page.tsx)
├── PageHeader
├── Card (Filter & Search)
│   ├── Input (Search)
│   ├── Select (Status Filter)
│   └── Button (Refresh)
├── Card (Conversions Table)
│   ├── Table Header
│   │   ├── User
│   │   ├── Amount
│   │   ├── Wallet
│   │   ├── Status
│   │   ├── Requested Date
│   │   └── Actions
│   ├── Table Body
│   │   └── TableRow (repeated)
│   │       ├── User Info
│   │       ├── Amount
│   │       ├── Wallet (truncated)
│   │       ├── StatusBadge
│   │       ├── Date
│   │       └── Actions
│   │           ├── View Button
│   │           ├── Approve Button (if Pending)
│   │           └── Reject Button (if Pending)
│   └── Pagination
│       ├── Prev Button
│       ├── Page Numbers
│       └── Next Button
└── ConversionDetailModal
    ├── Status Badge
    ├── User Info Block
    │   ├── Name
    │   ├── Email (with Copy)
    │   └── Sender Email
    ├── Conversion Details
    │   ├── Amount
    │   └── Type
    ├── Wallet Block
    │   └── Address (with Copy)
    ├── Timeline Block
    │   ├── Requested Date
    │   ├── Created Date
    │   ├── Updated Date
    │   └── Resolved Date (if applicable)
    ├── Admin Info
    └── Action Buttons
        ├── Approve (if Pending)
        └── Reject (if Pending)
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ User Loads Page                                         │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────▼───────────────┐
     │ useEffect triggers            │
     │ fetchConversions() called      │
     └───────────────┬───────────────┘
                     │
     ┌───────────────▼──────────────────────────┐
     │ API Call                                 │
     │ GET /api/v1/conversions/admin/all       │
     │ (with pagination params)                │
     └───────────────┬──────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │                         │
     Success                   Error
        │                         │
        ▼                         ▼
    ┌────────┐              ┌─────────────┐
    │ Update │              │ Show Error  │
    │ State  │              │ Toast       │
    └────┬───┘              └─────────────┘
         │
    ┌────▼──────────────────┐
    │ Re-render Table       │
    │ Display Conversions   │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │ User Interacts                    │
    │ (Search, Filter, Approve, etc)   │
    └────┬──────────────────────────────┘
         │
    ┌────▼─────────────────────────────┐
    │ Update Local State               │
    │ (Instant UI feedback)            │
    └────┬─────────────────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │ API Call for Action               │
    │ (if needed)                       │
    └────┬──────────────────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │ Receive Response                  │
    └────┬──────────────────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │ Toast Notification               │
    │ (Success or Error)               │
    └────┬──────────────────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │ Update State with Server Data    │
    └────┬──────────────────────────────┘
         │
    ┌────▼──────────────────────────────┐
    │ Re-render with Updated Data      │
    └──────────────────────────────────┘
```

---

## 🔐 State Management Flow

```
ConversionsPage State:
├── conversions: Conversion[]
│   └── Updated from API, local modifications
├── loading: boolean
│   └── true during initial fetch
├── actionLoading: string | null
│   └── Tracks which conversion is being processed
├── searchTerm: string
│   └── Current search query
├── statusFilter: string
│   └── Current status filter (All, Pending, Approved, Rejected)
├── currentPage: number
│   └── Current pagination page
├── totalPages: number
│   └── Total pages available
├── selectedConversion: Conversion | null
│   └── Currently viewed conversion
├── showDetailModal: boolean
│   └── Detail modal visibility
└── error: string | null
    └── Current error message

State Transitions:
┌──────────────┐
│ Initial Load │
└──────┬───────┘
       │ fetchConversions()
       ▼
┌────────────────┐
│ Loading = true │
└──────┬─────────┘
       │ API Response
       ▼
┌──────────────────────┐
│ Update conversions   │
│ Loading = false      │
└──────────────────────┘

User Action (Approve/Reject):
┌────────────────┐
│ Show Modal     │
└──────┬─────────┘
       │ Click Approve/Reject
       ▼
┌────────────────────┐
│ actionLoading=id   │
└──────┬─────────────┘
       │ API Response
       ▼
┌────────────────────┐
│ Update local state │
│ Show Toast         │
│ actionLoading=null │
└────────────────────┘
```

---

## 🔌 API Integration Points

```
Frontend Layer
    │
    ├── fetchAllConversions()
    │   └─► GET /api/v1/conversions/admin/all
    │       ├─ Query params: page, limit
    │       └─ Response: { data: { items, total }, success }
    │
    ├── approveConversion(id)
    │   └─► POST /api/v1/conversions/admin/{id}/approve
    │       ├─ Body: (empty)
    │       └─ Response: { data: Conversion, success }
    │
    └── rejectConversion(id)
        └─► POST /api/v1/conversions/admin/{id}/reject
            ├─ Body: (empty)
            └─ Response: { data: Conversion, success }

Backend Layer
    │
    ├── GET /api/v1/conversions/admin/all
    │   ├─ Auth: JWT token required
    │   ├─ Query: page, limit
    │   └─ Database: Query conversions with pagination
    │
    ├── POST /api/v1/conversions/admin/{id}/approve
    │   ├─ Auth: JWT token required
    │   ├─ Params: id (conversion ID)
    │   └─ Database: Update status to "Approved"
    │
    └── POST /api/v1/conversions/admin/{id}/reject
        ├─ Auth: JWT token required
        ├─ Params: id (conversion ID)
        └─ Database: Update status to "Rejected"

Database Layer
    │
    ├── Conversions Collection
    │   ├─ _id: ObjectId
    │   ├─ user_id: ObjectId (ref: Users)
    │   ├─ amount: Number
    │   ├─ solana_wallet: String
    │   ├─ status: String (Pending, Approved, Rejected)
    │   ├─ requested_at: Date
    │   ├─ createdAt: Date
    │   ├─ updatedAt: Date
    │   ├─ admin_id: ObjectId (optional)
    │   └─ resolved_at: Date (optional)
    │
    └── Users Collection
        ├─ _id: ObjectId
        ├─ firstName: String
        ├─ lastName: String
        ├─ email: String
        ├─ senderEmail: String (optional)
        └─ password: String
```

---

## 🎯 User Interaction Flow

```
                  START
                    │
                    ▼
        ┌──────────────────────┐
        │  Load Admin Page     │
        │  /dashboard/admin/   │
        │  conversions         │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Fetch All            │
        │ Conversions          │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Display Table        │
        │ with all records     │
        └──────────┬───────────┘
                   │
         ┌─────────┼─────────┐
         │         │         │
         ▼         ▼         ▼
    ┌────────┐ ┌───────┐ ┌──────────┐
    │Search  │ │Filter │ │Paginate  │
    │by text │ │Status │ │Pages     │
    └────┬───┘ └───┬───┘ └──────┬───┘
         │         │           │
         └─────────┼───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update Table with    │
        │ Filtered Results     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Click View Button    │
        │ on a conversion      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Open Detail Modal    │
        │ Show Full Info       │
        └──────────┬───────────┘
                   │
         ┌─────────┼─────────┐
         │         │         │
         ▼         ▼         ▼
    ┌────────┐ ┌───────┐ ┌──────────┐
    │Approve │ │Reject │ │Close/    │
    │        │ │       │ │Navigate  │
    └────┬───┘ └───┬───┘ └──────┬───┘
         │         │           │
         └─────────┼───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Update State         │
        │ Show Toast           │
        │ Refresh Table        │
        └──────────┬───────────┘
                   │
                   ▼
                  END
```

---

## 🔄 Error Handling Flow

```
User Action
    │
    ▼
API Call
    │
    ├─ SUCCESS ──► Update State ──► Show Success Toast ──► Update UI
    │
    └─ ERROR
        │
        ├─ Network Error
        │  ├─ Show Error Alert
        │  ├─ Log to Console
        │  └─ Show Retry Button
        │
        ├─ 401 Unauthorized
        │  ├─ Clear Token
        │  ├─ Redirect to Login
        │  └─ Clear Persisted State
        │
        ├─ 500 Server Error
        │  ├─ Show Error Message
        │  ├─ Log Error Details
        │  └─ Offer Retry
        │
        ├─ Invalid Response
        │  ├─ Show Generic Error
        │  ├─ Log Response
        │  └─ Disable Action
        │
        └─ Validation Error
           ├─ Show Specific Message
           ├─ Highlight Field
           └─ Focus Input

Error Recovery:
    ├─ Click Refresh Button ──► Retry Fetch
    ├─ Click Retry Action ──► Retry API Call
    ├─ Fix Issue ──► Retry
    └─ Dismiss Error ──► Continue
```

---

## 📈 Performance Optimization

```
Component Rendering
    │
    ├─ useCallback for handlers
    │  └─ Prevents unnecessary re-renders
    │
    ├─ Memoized filter function
    │  └─ Only recalculates on dependency change
    │
    ├─ Conditional rendering
    │  └─ Only renders visible content
    │
    └─ Pagination
       └─ Only loads 10 items per page

API Calls
    │
    ├─ Single fetch on mount
    │  └─ Triggered by useEffect
    │
    ├─ Pagination-triggered fetch
    │  └─ Triggered by page change
    │
    ├─ Action-triggered fetch
    │  └─ After approve/reject
    │
    └─ User-triggered refresh
       └─ On refresh button click

State Updates
    │
    ├─ Local state update first
    │  └─ Instant UI feedback
    │
    ├─ API call in parallel
    │  └─ Server synchronization
    │
    └─ Reconcile if needed
       └─ Update based on response
```

---

## 🎨 UI Layout Structure

```
┌─────────────────────────────────────┐
│   Page Header                       │
│   "Conversions Management"          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Error Alert (if error exists)     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Filter Card                       │
│   ┌─────────────────────────────┐   │
│   │ Search Input                │   │
│   ├─────────────────────────────┤   │
│   │ Status Select               │   │
│   ├─────────────────────────────┤   │
│   │ Result Count                │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Table Card                        │
│   ┌─────────────────────────────┐   │
│   │ Table Header                │   │
│   ├─────────────────────────────┤   │
│   │ Table Rows (paginated)      │   │
│   ├─────────────────────────────┤   │
│   │ Pagination Controls         │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Modal (when row clicked)          │
│   ┌─────────────────────────────┐   │
│   │ Close Button                │   │
│   ├─────────────────────────────┤   │
│   │ Status Badge                │   │
│   ├─────────────────────────────┤   │
│   │ User Information            │   │
│   ├─────────────────────────────┤   │
│   │ Conversion Details          │   │
│   ├─────────────────────────────┤   │
│   │ Wallet Information          │   │
│   ├─────────────────────────────┤   │
│   │ Timeline                    │   │
│   ├─────────────────────────────┤   │
│   │ Action Buttons              │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🧩 Integration Touchpoints

```
Existing System ────────┬────────────── New Component
                        │
                        ▼
            ┌──────────────────────┐
            │  Redux Store (if any)│
            └──────────────────────┘
                        │
            ┌───────────▼───────────┐
            │   Auth Context        │
            │   (Token, User)       │
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │   Axios Instance      │
            │   (with interceptors) │
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │  ConversionsPage      │
            │  ConversionModal      │
            │  API Service          │
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │  Backend API          │
            │  http://localhost:8000│
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │  Database             │
            │  (MongoDB)            │
            └───────────────────────┘
```

This completes the comprehensive system architecture documentation for the Conversions Admin integration!
