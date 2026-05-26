# Profile Page – Quick Integration Guide

## ✨ What's Delivered

**Two New Files:**
1. `src/components/Dialog.tsx` — Confirmation modal component
2. `src/pages/ProfilePage.tsx` — Complete profile management page

**Updated File:**
- `App.tsx` — Added `/profile` route

---

## 🚀 Quick Setup

### 1. Copy Files
```
Dialog.tsx → src/components/Dialog.tsx
ProfilePage.tsx → src/pages/ProfilePage.tsx
Update App.tsx with new import and route
```

### 2. Access Profile
```
http://localhost:5173/profile

Or link:
<Link to="/profile">My Profile</Link>
```

---

## 📋 Features

| Feature | Status |
|---------|:------:|
| Update name & email | ✅ |
| Change password | ✅ |
| Password verification (backend) | ⚠️ Backend |
| Logout with confirmation | ✅ |
| Delete account with confirmation | ✅ |
| Form validation | ✅ |
| Success notifications | ✅ |
| Error handling | ✅ |
| Loading states | ✅ |
| Dark/light theme | ✅ |
| Mobile responsive | ✅ |

---

## 🔌 Backend Endpoints Needed

Replace TODO placeholders in ProfilePage.tsx with API calls to:

### 1. Update Profile
```
PUT /users/profile
{ fullName, email }
→ Success message + user data
```

### 2. Change Password
```
PUT /users/password
{ currentPassword, newPassword }
→ Verify currentPassword on backend
→ Success message
```

### 3. Delete Account
```
DELETE /users/account
→ Delete all user data
→ Auto-logout after deletion
```

---

## 🔐 Component Structure

```
ProfilePage
├── Profile Info Section
│   ├── Full Name field
│   ├── Email field
│   └── Save button
├── Password Section
│   ├── Change Password toggle
│   └── Password form (when open)
│       ├── Current password
│       ├── New password
│       ├── Confirm password
│       └── Update/Cancel buttons
└── Danger Zone
    ├── Logout button → Dialog
    └── Delete Account button → Dialog
```

---

## 🎯 What to Implement

### In ProfilePage.tsx, find TODO comments:

**Line ~270:** Update Profile API
```typescript
// TODO: Replace with actual API call to PUT /users/profile
// Endpoint: http://localhost:8000/users/profile
```

**Line ~300:** Change Password API
```typescript
// TODO: Replace with actual API call to PUT /users/password
// Endpoint: http://localhost:8000/users/password
```

**Line ~325:** Delete Account API
```typescript
// TODO: Replace with actual API call to DELETE /users/account
// Endpoint: http://localhost:8000/users/account
```

---

## 📝 API Examples

### Update Profile
```javascript
const res = await fetch('http://localhost:8000/users/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ fullName, email }),
});
const data = await res.json();
```

### Change Password
```javascript
const res = await fetch('http://localhost:8000/users/password', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ currentPassword, newPassword }),
});
```

### Delete Account
```javascript
const res = await fetch('http://localhost:8000/users/account', {
  method: 'DELETE',
  credentials: 'include',
});
await logout(); // Auto-logout
navigate('/login');
```

---

## 🎨 Dialog Component Usage

The Dialog component is reusable:

```typescript
<Dialog
  isOpen={dialogOpen}
  onClose={() => setDialogOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
  isDangerous={true}  // Red styling
  primaryAction={{
    label: "Delete",
    onClick: handleDelete,
    variant: "danger",
    loading: isLoading,
  }}
  secondaryAction={{
    label: "Cancel",
    onClick: () => setDialogOpen(false),
  }}
/>
```

---

## ✅ Reused Components

- Input (with icon, label, error)
- Button (multiple variants)
- Sidebar navigation
- MobileBottomNav
- useAuth hook
- ProtectedRoute

---

## 🧪 Testing Checklist

- [ ] Navigate to /profile
- [ ] Edit name/email → Save → Success message
- [ ] Click "Change Password" → Form appears
- [ ] Enter invalid password → Error shows
- [ ] Enter correct details → Update → Success
- [ ] Click "Logout" → Dialog shows → Confirm → Redirects to login
- [ ] Click "Delete Account" → Dialog shows (red styling) → Warning clear
- [ ] Test on mobile → Responsive layout
- [ ] Test dark/light mode → Switches correctly

---

## 🔒 Security

**Frontend:** ✅
- Password inputs
- Form validation
- Confirmation dialogs
- Current password required

**Backend:** You Must Implement
- ⚠️ Verify current password before change
- ⚠️ Hash new password
- ⚠️ Check email doesn't exist
- ⚠️ Permanent account deletion
- ⚠️ Require authentication

---

## 🐛 Common Issues

**Issue:** Profile doesn't update
- Check Network tab for API response
- Verify backend endpoint exists
- Check error message in console

**Issue:** Dialog doesn't appear
- Dialog is in ProfilePage.tsx
- Check isOpen state

**Issue:** Can't change password
- Current password must be verified on backend
- New password needs at least 8 chars
- Confirmation must match

---

## 📚 Full Documentation

See `PROFILE_PAGE_GUIDE.md` for:
- Complete API specifications
- Detailed implementation guide
- Configuration options
- Debugging tips
- Testing scenarios

---

## 🚀 Next Steps

1. Copy the two new files to your project
2. Update App.tsx with profile route
3. Find TODO placeholders
4. Implement backend endpoints
5. Replace TODO with actual API calls
6. Test all features
7. Deploy

---

**Ready to integrate! Check PROFILE_PAGE_GUIDE.md for details.** 🎉
