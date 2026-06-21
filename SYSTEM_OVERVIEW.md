# NPRMS System Overview

## Project Introduction

NPRMS (Nigeria Police Records Management System) is a comprehensive role-based case management platform designed for police stations to efficiently manage criminal cases, investigations, and evidence handling. The system supports three distinct user roles with specialized workflows and permissions.

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 16 with React 19.2 (App Router)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: React Context API for Auth, Users, Cases, and Notifications
- **Authentication**: Session-based with localStorage persistence
- **Data**: Mock data for development (can be easily swapped for backend API)

### Core Application Structure

```
/app
  ├── login/                    # Public login page
  ├── admin/                    # Administrator role routes
  │   ├── layout.tsx           # Admin layout with sidebar
  │   ├── dashboard/           # Admin dashboard
  │   ├── cases/               # All cases management
  │   ├── users/               # User management
  │   ├── reports/             # Reports generation
  │   ├── search/              # Case search
  │   ├── notifications/       # Notifications center
  │   ├── profile/             # User profile
  │   ├── settings/            # User settings
  │   └── help/                # Help center
  ├── officer/                 # Investigating Officer role routes
  │   ├── layout.tsx           # Officer layout with sidebar
  │   ├── dashboard/           # Officer dashboard
  │   ├── cases/               # My cases
  │   ├── search/              # Case search
  │   ├── notifications/       # Notifications center
  │   ├── profile/             # User profile
  │   ├── settings/            # User settings
  │   └── help/                # Help center
  └── records/                 # Records Officer role routes
      ├── layout.tsx           # Records layout with sidebar
      ├── dashboard/           # Records dashboard
      ├── register/            # Register new case
      ├── cases/               # All cases view
      ├── archive/             # Archived cases
      ├── search/              # Case search
      ├── notifications/       # Notifications center
      ├── profile/             # User profile
      ├── settings/            # User settings
      └── help/                # Help center

/components/nprms
  ├── sidebar.tsx              # Main navigation sidebar
  ├── header.tsx               # Top header with notifications
  ├── auth-layout.tsx          # Protected route wrapper
  ├── admin/                   # Admin-specific components
  │   ├── users-table.tsx      # User management table
  │   ├── stats-cards.tsx      # Dashboard statistics
  │   └── overdue-cases.tsx    # Overdue cases widget
  ├── officer/                 # Officer-specific components
  │   ├── my-cases.tsx         # Officer's assigned cases
  │   ├── stats-cards.tsx      # Officer statistics
  │   └── case-timeline.tsx    # Case investigation timeline
  ├── records/                 # Records Officer components
  │   ├── case-registration-form.tsx  # New case registration
  │   ├── all-cases-list.tsx          # All cases display
  │   ├── stats-cards.tsx             # Records statistics
  │   └── archive-list.tsx            # Archived cases
  └── shared/                  # Shared components
      ├── case-detail-view.tsx   # Case details display
      ├── cases-table.tsx        # Case listing table
      ├── notifications-list.tsx # Notification management
      ├── search-results.tsx     # Search results
      ├── profile-card.tsx       # User profile display
      └── case-timeline.tsx      # Investigation timeline

/lib
  ├── mock-data.ts             # Mock database (cases, users, notifications, etc.)
  ├── auth-context.tsx         # Authentication state management
  ├── user-context.tsx         # User management state
  ├── case-context.tsx         # Case management state
  ├── notification-context.tsx # Notification state
  └── badge-colors.ts          # Centralized badge color mapping
```

## User Roles and Permissions

### 1. Administrator
**Purpose**: System oversight and user management

**Capabilities**:
- View all cases in the system
- Manage user accounts (create, edit, delete)
- Generate system reports
- Search across all cases and records
- View system notifications
- Access help documentation

**Dashboard Features**:
- Total cases count
- Active investigations
- Overdue cases (no updates in 7+ days)
- System-wide statistics
- Recent case activities
- User management interface

**Navigation**:
- Dashboard → All Cases → Users → Reports → Search

### 2. Investigating Officer
**Purpose**: Case investigation and evidence management

**Capabilities**:
- View assigned cases only
- Update case status
- Add investigation notes and evidence
- Search cases
- View personal notifications
- Update profile and settings

**Dashboard Features**:
- Assigned cases count
- In-progress investigations
- Overdue cases (scoped to officer)
- Completed cases
- Recent investigation timeline

**Navigation**:
- Dashboard → My Cases → Search → Notifications

### 3. Records Officer
**Purpose**: Case registration and records management

**Capabilities**:
- Register new cases
- View all cases (read-only)
- Search cases by various criteria
- Manage case archival
- View notifications
- Update profile and settings

**Dashboard Features**:
- Total cases registered
- Pending registration count
- Archived cases count
- Monthly statistics

**Navigation**:
- Dashboard → Register Case → All Cases → Archive → Search

## State Management

### Authentication Context (`auth-context.tsx`)
Manages user login/logout and session persistence.

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}
```

**Features**:
- Local storage persistence of user session
- Automatic login on app refresh
- Protected route enforcement

### User Management Context (`user-context.tsx`)
Handles in-memory user data management for the admin interface.

```typescript
interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}
```

**Features**:
- Session-level persistence
- Add/edit/delete user operations
- Real-time user list updates

### Case Management Context (`case-context.tsx`)
Manages case data and operations throughout the application.

```typescript
interface CaseContextType {
  cases: Case[];
  addCase: (caseData: Case) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
}
```

**Features**:
- Register new cases
- Update case status and details
- Track investigation progress
- Session-level persistence

### Notification Context (`notification-context.tsx`)
Manages user notifications with read/delete capabilities.

```typescript
interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
}
```

**Features**:
- Individual notification deletion
- Mark single/all notifications as read
- Clear all notifications
- Unread notification count

## Data Model

### User
```typescript
interface User {
  user_id: string;
  full_name: string;
  email: string;
  badge_number: string;
  role: 'administrator' | 'officer' | 'records';
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}
```

### Case
```typescript
interface Case {
  case_id: string;
  case_number: string;
  title: string;
  description: string;
  category: CaseCategory;
  priority: Priority;
  status: CaseStatus;
  date_reported: string;
  location: string;
  complainant_name: string;
  complainant_contact: string;
  complainant_address: string;
  registered_by: User;
  assigned_officer: User | null;
  assigned_by: User | null;
  created_at: string;
  updated_at: string;
}
```

### Notification
```typescript
interface Notification {
  notification_id: string;
  message: string;
  type: NotificationType;
  related_case_number: string;
  is_read: boolean;
  created_at: string;
}
```

## Key Features

### 1. Authentication System
- Email/password login
- Session persistence via localStorage
- Protected routes with role-based access
- Automatic logout functionality

### 2. Case Management
- Register new cases with full details
- Update case status as investigations progress
- Track investigation updates and timelines
- Search cases by multiple criteria
- Archive completed/closed cases

### 3. Notification System
- Real-time notifications for case updates
- Individual notification deletion
- Mark notifications as read (single or all)
- Clear all notifications
- Unread notification badge on header

### 4. User Management (Admin Only)
- View all system users
- Add new user accounts
- Edit existing user information
- Delete user accounts
- User status management

### 5. Dashboard Analytics
- Role-specific statistics
- Real-time data calculations
- Overdue case detection
- Progress tracking

### 6. Search Functionality
- Search cases by case number, title, or location
- Search users by name, email, or badge number
- Multi-field search across all relevant data
- Instant result filtering

## Workflow Examples

### Registering a New Case (Records Officer)
1. Login with Records Officer credentials
2. Navigate to "Register Case" from sidebar
3. Fill in case details (complainant info, case description, etc.)
4. Submit form
5. Case appears in "All Cases" view with status "Registered"
6. Case becomes available for admin assignment

### Assigning and Investigating a Case (Admin + Officer)
1. Admin views "All Cases"
2. Admin selects case to assign to officer
3. Case status changes to "Assigned"
4. Officer sees case in "My Cases" with status "Assigned"
5. Officer updates case status to "Under Investigation"
6. Officer adds investigation notes and evidence
7. Updates visible in case timeline and notifications

### Managing Overdue Cases
- System identifies cases "Under Investigation" with no updates in 7+ days
- Overdue count visible on admin dashboard
- Officer can see overdue cases in their stats
- Investigation notes can be added to resolve

## Navigation Flow

### From Login
```
Login (Public) 
  ↓
Role-Based Dashboard
  ├→ Admin Dashboard
  │   ├→ All Cases
  │   ├→ Users
  │   ├→ Reports
  │   └→ Search
  ├→ Officer Dashboard
  │   ├→ My Cases
  │   ├→ Search
  │   └→ Notifications
  └→ Records Dashboard
      ├→ Register Case
      ├→ All Cases
      ├→ Archive
      └→ Search
```

### Header Navigation (Available from any page)
- **Notifications Bell**: Opens notifications center
- **Search Bar**: Access global search functionality
- **User Menu**: Profile, Settings, Logout

### Sidebar Navigation
**Menu Section**:
- Dashboard
- Primary role-specific options
- Search
- Notifications

**Account Section**:
- Profile
- Settings
- Help
- Logout

## Utility Functions

### Badge Colors (`lib/badge-colors.ts`)
Centralized mapping of case status/priority to visual variants:

```typescript
// Status variants
getStatusVariant(status: string) // Returns 'default' | 'secondary' | 'accent' | etc.

// Priority variants
getPriorityVariant(priority: string)

// Category variants
getCategoryVariant(category: string)

// Role variants
getRoleBadgeVariant(role: string)
```

### Mock Data (`lib/mock-data.ts`)
Pre-populated database with sample cases, users, and notifications for testing.

```typescript
getOverdueCases()  // Returns cases with no updates in 7+ days
mockCases          // All cases array
mockUsers          // All users array
mockNotifications  // All notifications array
```

## Styling System

### Color Tokens (in globals.css)
- `--background`: Main app background
- `--foreground`: Primary text color
- `--primary`: Primary brand color (blue)
- `--secondary`: Secondary color (gray)
- `--destructive`: Danger/delete color (red)
- `--muted-foreground`: Disabled text color

### Badge Variants
- `default`: Primary color badges
- `secondary`: Gray badges
- `destructive`: Red badges
- `outline`: Bordered badges
- `accent`: Purple badges (Resolved)
- `info`: Blue badges (Closed)
- `warning`: Amber badges (High priority)

### Layout
- Sidebar: 256px (w-64) fixed left panel
- Main content: Responsive with left margin for sidebar
- Mobile: Sidebar collapses/slides on small screens
- Padding: Consistent 24px (p-6) throughout

## Development Guidelines

### Adding a New Feature
1. Create/update relevant context (auth, user, case, or notification)
2. Add state management logic
3. Create component to display feature
4. Add navigation link in sidebar
5. Test with all three roles
6. Verify TypeScript compilation

### Modifying Data
1. Update mock-data.ts if adding new fields
2. Update context provider to handle new data
3. Update component to display/use new data
4. Verify type safety with tsc --noEmit

### Adding Navigation
1. Add menu item to appropriate getMenuItemsForRole() function
2. Ensure href follows /{role}/path pattern
3. Create corresponding route/page
4. Wrap with AuthLayout component
5. Test link navigation

## Testing Credentials

### Test Accounts (all password: password123)
- **Admin**: admin@nprms.gov.ng
- **Officer**: officer@nprms.gov.ng
- **Records**: records@nprms.gov.ng

## Performance Notes

- Dashboard statistics calculated in real-time based on case data
- Notification counts updated instantly
- Case searches performed client-side on mock data
- Context providers initialized once at root level
- Sidebar and header reusable across all role-based routes

## Future Enhancements

1. Backend API integration (replace mock data)
2. Image upload/storage for case evidence
3. Case attachment support
4. Advanced filtering and sorting
5. Batch case operations
6. Case templates
7. Audit logging
8. Export to PDF/Excel
9. Multi-language support
10. Dark mode theme

## Troubleshooting

### User sees "No notifications yet"
- Notifications are populated from mock data on load
- Clear browser cache if notifications don't appear
- Check notification-context initialization

### Case doesn't appear after registration
- Verify case is registered to correct role
- Check case-context is wrapping the component
- Ensure case_id is unique

### Navigation links not working
- Verify href matches /{role}/path pattern
- Check route exists in /app directory
- Confirm AuthLayout wraps the page

### Statistics not updating
- Verify mock data has cases with correct status
- Check case-context is initialized
- Confirm user.user_id matches assigned officer

## Support

For issues or questions, refer to the Help section available in the application sidebar for each role, or check the inline comments in component files for implementation details.
