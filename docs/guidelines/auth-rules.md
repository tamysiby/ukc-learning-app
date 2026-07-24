# Authentication, Session Management & Access Control (RBAC) Rules

This document specifies the authentication rules, session management policies, role-based access control (RBAC), and security policies implemented in the UKC Learning Portal.

---

## 🔐 1. Authentication & Registration Model

- **No Public Sign-Up**: Public self-registration is strictly disabled. The application landing page is an authentication login gate (`LoginPage.jsx`).
- **Admin-Managed Onboarding**: Student accounts are created, assigned initial levels, and managed exclusively by Administrators.

---

## 🔄 2. Session Management & Security Rules

### 2.1 Dual Storage & Session Storage Key
- **Session Key**: `ukc_app_session_v1`.
- **Dual Population**: The active session token payload is written to **both `sessionStorage` and `localStorage`**.
  - Visible in DevTools under **Application $\rightarrow$ Session Storage** for explicit session inspection.
  - Mirrored in `localStorage` to ensure cross-tab and cross-window HTML5 `storage` events trigger instantly.

### 2.2 Active Session Warning Confirmation Dialog
- When a user attempts to sign in (via credentials or quick demo shortcuts), the portal checks if the account already has an active session (`isOnline: true` or active `sessionId`).
- If an active session is detected, login is intercepted and an **Active Session Confirmation Dialog** appears:
  - **Header**: *"Active Session Detected"*
  - **Warning**: *"Logging in now will terminate the active session on your other device/tab, and any unsaved progress in ongoing lessons or interactive decks will be reset."*
  - **Options**:
    - `Cancel Login`: Aborts sign-in and preserves the existing session.
    - `Log In & Disconnect Older Session`: Supersedes the older session with a new `sessionId`.

### 2.3 Single-Session Enforcement (No Duplicate Sessions)
- Every successful login generates a unique cryptographic `sessionId`.
- A user account can have **only one active session** at a time.
- When a new session is authorized, older active tabs detect the `sessionId` change via cross-tab storage listeners and periodic heartbeats (every 2s).
- The older session is immediately terminated with notice:  
  `"Your account was logged in from another session. You have been automatically signed out."`

### 2.4 15-Minute Throttled Inactivity Auto-Logout
- **Inactivity Timeout**: 15 minutes (900,000 ms).
- **Zero CPU / Quota Overhead**:
  - User interaction listeners (`mousemove`, `keydown`, `click`, `touchstart`, `scroll`) update `lastActiveTimestamp` at a **throttled interval of once every 10 seconds** (0 CPU lag).
  - The inactivity countdown runs **100% in-memory on the client side** without consuming database network calls.
- **Auto-Logout Action**: When 15 minutes pass with no user interactions, the portal automatically signs out the user and displays:  
  `"You were automatically logged out due to 15 minutes of inactivity."`

### 2.5 Real-Time Online Status Monitoring
- The Admin User Management portal tracks `isOnline` status in real-time.
- **🟢 Online** status badge with glowing indicator displays in user list tables, mobile cards, and student details headers when a student or admin is currently logged in.
- **Status Filter**: Includes an `Online Now` filter option to quickly view all currently active students.

---

## 👥 3. Roles & Permissions Matrix

| Feature / Action | Student Role | Admin Role |
| :--- | :---: | :---: |
| **Log In to Portal** | ✅ | ✅ |
| **Access Lesson Pathway & Flashcards** | ✅ | ❌ |
| **View Personal Student Profile** | ✅ | ✅ |
| **Access Admin User Management Portal** | ❌ | ✅ |
| **Monitor Real-Time Online Status** | ❌ | ✅ |
| **Create New Student Accounts** | ❌ | ✅ |
| **Edit Student Info** | ❌ | ✅ |
| **Toggle Student Status (Active / Inactive)** | ❌ | ✅ |
| **Delete Student Accounts** | ❌ | ✅ *(Excludes self-deletion)* |

---

## 🛡️ 4. Account Status Guarding

- **Active**: Account can authenticate and navigate assigned views.
- **Inactive**: Authentication is blocked at sign-in with an explicit security alert (*"Account is currently inactive. Please contact your system administrator."*).

---

## 🗄️ 5. Supabase Database Row-Level Security (RLS) Rules

Implemented in [`supabase/schema.sql`](file:///home/tamy/p/ukc-learning-app/supabase/schema.sql):

### 5.1 `public.profiles` Table
- `SELECT`: Allowed if `id = auth.uid()` OR user has `role = 'Admin'`.
- `INSERT`: Restricted to Admins (`role = 'Admin'`) or automatic system trigger (`on_auth_user_created`).
- `UPDATE`: Users can edit their own profile; Admins can edit any profile.
- `DELETE`: Restricted exclusively to Admins.

### 5.2 `public.units` & `public.lessons` Tables
- `SELECT`: Open to all authenticated users.
- `INSERT / UPDATE / DELETE`: Restricted to Admin role.

### 5.3 `public.student_progress` Table
- `ALL`: Restricted to record owner (`student_id = auth.uid()`) OR Admins.
