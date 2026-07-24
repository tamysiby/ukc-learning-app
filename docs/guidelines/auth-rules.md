# Authentication & Access Control (RBAC) Rules

This document specifies the authentication rules, role-based access control (RBAC), and security policies implemented in the UKC Learning Portal.

---

## 🔐 1. Authentication & Registration Model

- **No Public Sign-Up**: Public self-registration is strictly disabled. The application landing page is an authentication login gate (`LoginPage.jsx`).
- **Admin-Managed Onboarding**: Student accounts are created, assigned initial levels, and managed exclusively by Administrators.

---

## 👥 2. Roles & Permissions Matrix

| Feature / Action | Student Role | Admin Role |
| :--- | :---: | :---: |
| **Log In to Portal** | ✅ | ✅ |
| **Access Lesson Pathway & Flashcards** | ✅ | ❌ |
| **View Personal Student Profile** | ✅ | ✅ |
| **Access Admin User Management Portal** | ❌ | ✅ |
| **Create New Student Accounts** | ❌ | ✅ |
| **Edit Student Info & Level Assignment** | ❌ | ✅ |
| **Toggle Student Status (Active / Inactive)** | ❌ | ✅ |
| **Delete Student Accounts** | ❌ | ✅ *(Excludes self-deletion)* |

---

## 🛡️ 3. Account Status Guarding

- **Active**: Account can authenticate and navigate assigned views.
- **Inactive**: Authentication is blocked at sign-in with an explicit security alert (*"Account is currently inactive. Please contact your system administrator."*).

---

## 🗄️ 4. Supabase Database Row-Level Security (RLS) Rules

Implemented in [`supabase/schema.sql`](file:///home/tamy/p/ukc-learning-app/supabase/schema.sql):

### 4.1 `public.profiles` Table
- `SELECT`: Allowed if `id = auth.uid()` OR user has `role = 'Admin'`.
- `INSERT`: Restricted to Admins (`role = 'Admin'`) or automatic system trigger (`on_auth_user_created`).
- `UPDATE`: Users can edit their own profile; Admins can edit any profile.
- `DELETE`: Restricted exclusively to Admins.

### 4.2 `public.units` & `public.lessons` Tables
- `SELECT`: Open to all authenticated users.
- `INSERT / UPDATE / DELETE`: Restricted to Admin role.

### 4.3 `public.student_progress` Table
- `ALL`: Restricted to record owner (`student_id = auth.uid()`) OR Admins.
