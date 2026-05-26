## Profile Page – Implementation Guide

### 📋 Overview

The Profile Page allows users to:
1. **Update Profile** — Change name and email
2. **Change Password** — With current password verification
3. **Logout** — With confirmation dialog
4. **Delete Account** — Permanent account deletion with confirmation

---

## 📁 Files Delivered

### New Component
- **Dialog.tsx** — Reusable modal/dialog component for confirmations

### New Page
- **ProfilePage.tsx** — Complete profile management page

### Updated File
- **App.tsx** — Added `/profile` route with protection

---

## 🚀 How to Use

### Access Profile Page
```typescript
// Navigate to profile
navigate('/profile');

// Or link
<Link to="/profile">Profile</Link>
```

### Route is Protected
```typescript
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

Only authenticated users can access `/profile`.

---

## 🔌 Backend API Integration

The page has TODO placeholders for API calls. Replace these with your actual endpoints:

### 1. Update Profile
**Endpoint:** `PUT /users/profile`

```typescript
// Current placeholder (line ~270)
// TODO: Replace with actual API call

// Implementation should look like:
const res = await fetch('http://localhost:8000/users/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ 
    fullName: fullName,
    email: email 
  }),
});

if (!res.ok) {
  const error = await res.json();
  throw new Error(error.message || 'Failed to update profile');
}

const data = await res.json();
return data;
```

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user-123",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400 → Invalid input
- 409 → Email already exists
- 500 → Server error

---

### 2. Change Password
**Endpoint:** `PUT /users/password`

```typescript
// Current placeholder (line ~300)
// TODO: Replace with actual API call

// Implementation should look like:
const res = await fetch('http://localhost:8000/users/password', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    currentPassword: currentPassword,
    newPassword: newPassword
  }),
});

if (!res.ok) {
  const error = await res.json();
  // Error message will be shown to user
  throw new Error(error.message || 'Failed to change password');
}

return await res.json();
```

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- 400 → Current password incorrect
- 400 → New password too weak
- 500 → Server error

**Validation (Frontend):**
- Current password: Required
- New password: Min 8 characters
- Confirm password: Must match new password

---

### 3. Delete Account
**Endpoint:** `DELETE /users/account`

```typescript
// Current placeholder (line ~325)
// TODO: Replace with actual API call

// Implementation should look like:
const res = await fetch('http://localhost:8000/users/account', {
  method: 'DELETE',
  credentials: 'include',
});

if (!res.ok) {
  throw new Error('Failed to delete account');
}

// After successful deletion, logout
await logout();
navigate('/login');
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Important:**
- This should delete all user data
- Permanent and irreversible
- Should log out the user after deletion
- Redirect to login page

---

## 🎨 Component Usage

### Dialog Component

The Dialog component is reusable for any confirmation:

```typescript
<Dialog
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  description="Are you sure?"
  isDangerous={false}  // Red styling if true
  primaryAction={{
    label: "Confirm",
    onClick: handleConfirm,
    variant: "primary",  // or "danger"
    loading: isLoading
  }}
  secondaryAction={{
    label: "Cancel",
    onClick: handleClose
  }}
>
  {/* Optional children for custom content */}
</Dialog>
```

---

## 📊 Component Structure

```
ProfilePage
├── Header (with back button on mobile)
├── Success Messages (conditional)
├── Profile Section
│   ├── Avatar
│   ├── Full Name input
│   ├── Email input
│   └── Save button
├── Password Section
│   ├── Change Password link
│   └── Password form (conditional)
│       ├── Current password
│       ├── New password
│       ├── Confirm password
│       ├── Update button
│       └── Cancel button
└── Danger Zone
    ├── Logout button
    ├── Delete Account button
    └── Warning text
```

---

## 🎯 Features

### Profile Update
- ✅ Edit full name and email
- ✅ Real-time validation
- ✅ Error messaging
- ✅ Loading state
- ✅ Success notification
- ✅ Reuses Input component

### Password Change
- ✅ Toggleable form (collapsed by default)
- ✅ Current password verification (backend)
- ✅ New password confirmation
- ✅ Min 8 character requirement
- ✅ Mismatch detection
- ✅ Loading state
- ✅ Success notification
- ✅ Form clears on success

### Logout
- ✅ Confirmation dialog
- ✅ Uses existing logout() from useAuth
- ✅ Redirects to login
- ✅ Loading state

### Delete Account
- ✅ Confirmation dialog (marked as dangerous)
- ✅ Clear warning message
- ✅ API call with deletion
- ✅ Auto-logout after deletion
- ✅ Redirect to login

---

## 🔐 Security Notes

### Frontend
- ✅ Password inputs use `type="password"`
- ✅ Form validation before submission
- ✅ Confirmation dialogs for destructive actions
- ✅ Current password required for password change
- ✅ New password confirmation required

### Backend (You Must Implement)
- ⚠️ Hash new password with bcrypt
- ⚠️ Verify current password matches before updating
- ⚠️ Don't allow duplicate emails
- ⚠️ Validate email format
- ⚠️ Enforce password length (8+ chars recommended)
- ⚠️ Require authentication for all endpoints
- ⚠️ Use credentials: 'include' for session validation
- ⚠️ Permanent deletion of account and all data
- ⚠️ Log important actions (password change, account deletion)

---

## 🎨 Styling & Responsiveness

### Desktop
- Sidebar navigation
- Profile section shows alongside form
- All fields visible
- Avatar on left side

### Mobile
- Back button to navigate
- Full-width layout
- Stacked form fields
- Bottom navigation bar
- Avatar centered

### Dark/Light Mode
- Automatically switches with theme
- Profile page respects theme setting
- Dialog colors adjust based on theme

---

## 📝 API Integration Steps

1. **Find TODO comments** in ProfilePage.tsx
2. **Replace with actual API calls** to your backend
3. **Handle success/error responses**
4. **Test each endpoint** with Postman/curl

### Example Implementation

```typescript
// Line ~270: handleProfileUpdate function

const handleProfileUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateProfile()) return;

  setIsSubmitting(true);
  try {
    const res = await fetch('http://localhost:8000/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fullName, email }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    setSuccessMessage({ type: 'profile', visible: true });
    setTimeout(() => setSuccessMessage({ type: null, visible: false }), 3000);
  } catch (err: any) {
    setErrors({ fullName: err.message });
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🧪 Testing

### Test Profile Update
1. Navigate to /profile
2. Change full name or email
3. Click "Save Changes"
4. Should show success message
5. Verify data persisted on refresh

### Test Password Change
1. Click "Change Password"
2. Enter current password
3. Enter new password (min 8 chars)
4. Confirm new password
5. Click "Update Password"
6. Form should clear
7. Try logging in with new password

### Test Logout
1. Click "Logout" button
2. Confirm in dialog
3. Should redirect to /login
4. Browser back button shouldn't work

### Test Account Deletion
1. Click "Delete Account"
2. Confirm in dangerous dialog
3. Account should be deleted on backend
4. Should redirect to /login
5. Cannot login with deleted account

---

## 🔧 Configuration

### API URL
The page uses `fetch` with relative URLs. Update to your API:

```typescript
// Change these URLs:
const res = await fetch('http://localhost:8000/users/profile', {
  // ...
});

// To your production API:
const res = await fetch('https://api.yourdomain.com/users/profile', {
  // ...
});
```

Or use environment variables:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const res = await fetch(`${API_URL}/users/profile`, { ... });
```

---

## 🐛 Debugging Tips

1. **Check Network Tab** → See API requests/responses
2. **Check Console** → Look for JavaScript errors
3. **Check Form Validation** → Error messages appear instantly
4. **Check Backend Logs** → Verify API is being called
5. **Use Postman** → Test API endpoints before frontend

---

## 📚 Reused Components

- **Input** — From FormInputs.tsx (with label, icon, error support)
- **Button** — Existing UI button component
- **Sidebar** — Navigation sidebar
- **MobileBottomNav** — Mobile navigation
- **useAuth** — Auth context for user data and logout
- **ProtectedRoute** — Route protection

---

## 🆕 New Components

- **Dialog.tsx** — Confirmation modal for logout and delete

---

## 🎯 Next Steps

1. ✅ Copy ProfilePage.tsx and Dialog.tsx to your project
2. ✅ Update App.tsx with profile route
3. 📋 Implement backend endpoints (PUT /users/profile, etc.)
4. 🔌 Replace TODO placeholders with API calls
5. 🧪 Test all features
6. 🚀 Deploy

---

## 💡 Pro Tips

- Password form starts collapsed to reduce clutter
- Success messages auto-dismiss after 3 seconds
- Dialogs prevent accidental destructive actions
- All forms disable inputs while loading
- Avatar shows first letter of name for quick identification
- "Danger Zone" clearly marks destructive actions

---

**That's it! The profile page is ready to integrate with your backend.**
