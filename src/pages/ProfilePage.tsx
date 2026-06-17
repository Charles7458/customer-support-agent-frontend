import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/Sidebar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Input } from '../components/FormInputs';
import { Button } from '../components/ui';
import { Dialog } from '../components/Dialog';
import { cn } from '../utils/cn';
import { Avatar } from '../components/ui';
// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowBackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 4l-8 6 8 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="5.5" r="3.5" />
    <path d="M2 18c0-3.3 3-6 7-6s7 2.7 7 6" />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="16" height="12" rx="1.5" />
    <path d="M1 3l8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="7" width="12" height="10" rx="1" />
    <path d="M4 7V5a4 4 0 1 1 8 0v2" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" />
    <path d="M12 8l3-3m0 0l-3-3m3 3H7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 4h14M7 2h4M7 8v6M11 8v6M4 4v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4" strokeLinecap="round" />
  </svg>
);

interface FormErrors {
  fullName?: string;
  email?: string;
  emailPassword?:string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface SuccessMessage {
  type: 'Profile' | 'Email' | 'Password' | null;
  visible: boolean;
}

export function get_role(role:string){
    if(role=="CUSTOMER"){
      return "Customer"
    }
    else if(role=="SUPPORT_AGENT"){
      return "Agent"
    }
    else if(role =="ADMIN"){
      return "Admin"
    }
    else if(role == "Nexus AI"){
      return "AI"
    }
    else{
      return "Unknown"
    }
  }

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const SERVER_URL = import.meta.env.VITE_API_URL

  // Form states
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ type: null, visible: false });
  // Email states
  const [email, setEmail] = useState('');
  const emailPasswordRef = useRef<HTMLInputElement>(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailErrors, setEmailErrors] = useState<FormErrors>({});
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Password states
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [passwordErrors, setPasswordErrors] = useState<FormErrors>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Dialog states
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Validate profile form
  const validateProfile = (): boolean => {
    console.log("validateProfile fired")
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    console.log(newErrors)
    return Object.keys(newErrors).length === 0;
  };


  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    console.log("handle profile fired")
    if(e){
     e.preventDefault();
    }
    if (!validateProfile()) {
      console.log("validation failed (profile)")
      return
    };

    setIsSubmitting(true);
    try {
      const newName = fullName
      // API call to update profile
      const res = await fetch(`${SERVER_URL}users/update-name`, 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newName }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setSuccessMessage({
        type: 'Profile',
        visible: true
      })
    } catch (err) {
      setErrors({ fullName: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
      
    }
  };

  // Validate Email form
    const validateEmail = ():boolean => {
    const newErrors: FormErrors = {};
    const emailPassword = emailPasswordRef.current?.value || '';
    if(!email.trim()){
      newErrors.email = 'Email is required';
    }
    else if (!email.includes('@')){
      newErrors.email = 'Invalid email format';
    }
    if(!emailPassword) {
      newErrors.emailPassword = 'Password is required';
    }
    setEmailErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

    // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsChangingEmail(true);
    
    try {

      const newEmail = email;
      const password = emailPasswordRef.current?.value || '';

      // API call to update email
      const res = await fetch(`${SERVER_URL}users/update-email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, newEmail }),
      });

      if (!res.ok) throw new Error('Failed to update email');

      //Reset password input
      if (emailPasswordRef.current) emailPasswordRef.current.value = '';
      setShowEmailForm(false)
      setSuccessMessage({
        type: 'Email',
        visible: true
      })
    } catch (err) {
      setEmailErrors({ email: 'Failed to update email. Please try again.' });
    } finally {
      setIsChangingEmail(false);
    }
  };


  // Validate password form
  const validatePassword = (): boolean => {
    const newErrors: FormErrors = {};
    const currentPassword = currentPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsChangingPassword(true);
    try {
      const currentPassword = currentPasswordRef.current?.value || '';
      const newPassword = newPasswordRef.current?.value || '';

      // API call to update password
      const res = await fetch(`${SERVER_URL}users/update-pswd`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');


      // Reset form
      if (currentPasswordRef.current) currentPasswordRef.current.value = '';
      if (newPasswordRef.current) newPasswordRef.current.value = '';
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';

      setShowPasswordForm(false);
      setSuccessMessage({
        type: 'Password',
        visible: true
      })

    } catch (err: any) {
      setPasswordErrors({ currentPassword: err.message || 'Failed to change password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutDialog(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      // TODO: Replace with actual API call
      const res = await fetch(`${SERVER_URL}auth/del-acc`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete account');

      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear auth and redirect
      await logout();
      setDeleteDialog(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Account deletion failed:', err);
      setIsDeletingAccount(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c6c6cd] dark:border-[#2e3347] border-t-[#0058be] rounded-full animate-spin" />
          <p className="text-[#45464d] dark:text-[#9aa3bf]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f7f9fb] dark:bg-[#0d1117] transition-colors">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-[280px] flex flex-col min-h-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-[#c6c6cd] dark:border-[#1e2535] h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="md:hidden p-2 hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535] rounded-lg transition-colors text-[#45464d] dark:text-[#9aa3bf]"
            >
              <ArrowBackIcon />
            </button>
            <h1 className="text-lg font-semibold text-[#0d1117] dark:text-white hidden md:block">Profile Settings</h1>
            <h1 className="text-lg font-semibold text-[#0d1117] dark:text-white md:hidden">My Profile</h1>
          </div>
          <Avatar name={user?.fullName || 'U'}/>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pb-[69px] md:pb-0">
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
            {/* User Avatar Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <Avatar name={user?.fullName || 'U'} size='xl'/>
                
                <div>
                  <p className="text-xl font-semibold text-[#0d1117] dark:text-white">{user?.fullName}</p>
                  <p className="text-sm text-[#45464d] dark:text-[#9aa3bf]">{user?.email}</p>
                  <p className="text-xs text-[#45464d] dark:text-[#9aa3bf] mt-1">Account created • {get_role(user?.role || "")}</p>
                </div>
              </div>
            </div>

            {/* Success Messages */}
            {successMessage.visible && (
              <div className={cn(
                'mb-6 p-4 rounded-lg border transition-all bg-[#e8f5e9] dark:bg-[#1b5e20]/20 border-[#4caf50] dark:border-[#4caf50]/50'
              )}>
                <p className="text-sm font-medium text-[#2e7d32] dark:text-[#81c784]">
                  {`✓ ${successMessage.type} updated successfully`}
                </p>
              </div>
            )}

            {/* Profile Information Section */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#c6c6cd] dark:border-[#1e2535] p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#0d1117] dark:text-white mb-6 flex items-center gap-2">
                <UserIcon />
                Profile Information
              </h2>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {/* Full Name */}
                <Input
                  label="Full Name"
                  type="text"
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                  }}
                  error={errors.fullName}
                  icon={<UserIcon />}
                  disabled={isSubmitting}
                  placeholder="John Doe"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full"
                  onClick={handleProfileUpdate}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </div>

            {/* Email Form */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#c6c6cd] dark:border-[#1e2535] p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#0d1117] dark:text-white mb-4 flex items-center gap-2">
                <EmailIcon />
                Email
              </h2>

              {!showEmailForm ? (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="text-sm font-medium text-[#0058be] dark:text-[#4a9eff] hover:underline"
                >
                  Change Email
                </button>
              ) : (
                <form onSubmit={handleEmailUpdate} className="space-y-4">

                  {/* Email */}
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (emailErrors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  error={emailErrors.email}
                  icon={<EmailIcon />}
                  disabled={isChangingEmail}
                  placeholder="you@example.com"
                />

                  {/* Password */}
                  <Input
                    ref={emailPasswordRef}
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={emailErrors.emailPassword}
                    icon={<LockIcon />}
                    disabled={isChangingEmail}
                    autoComplete="current-password"
                  />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isChangingEmail}
                      className="flex-1"
                    >
                      {isChangingEmail ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        'Update Email'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setShowEmailForm(false);
                        setEmailErrors({});
                        if (emailPasswordRef.current) emailPasswordRef.current.value = '';
                      }}
                      disabled={isChangingEmail}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>


            {/* Password Section */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#c6c6cd] dark:border-[#1e2535] p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#0d1117] dark:text-white mb-4 flex items-center gap-2">
                <LockIcon />
                Password
              </h2>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-sm font-medium text-[#0058be] dark:text-[#4a9eff] hover:underline"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Current Password */}
                  <Input
                    ref={currentPasswordRef}
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    error={passwordErrors.currentPassword}
                    icon={<LockIcon />}
                    disabled={isChangingPassword}
                    autoComplete="current-password"
                  />

                  {/* New Password */}
                  <Input
                    ref={newPasswordRef}
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    error={passwordErrors.newPassword}
                    icon={<LockIcon />}
                    disabled={isChangingPassword}
                    hint="At least 8 characters"
                    autoComplete="new-password"
                  />

                  {/* Confirm Password */}
                  <Input
                    ref={confirmPasswordRef}
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    error={passwordErrors.confirmPassword}
                    icon={<LockIcon />}
                    disabled={isChangingPassword}
                    autoComplete="new-password"
                  />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isChangingPassword}
                      className="flex-1"
                    >
                      {isChangingPassword ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordErrors({});
                        if (currentPasswordRef.current) currentPasswordRef.current.value = '';
                        if (newPasswordRef.current) newPasswordRef.current.value = '';
                        if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
                        
                      }}
                      disabled={isChangingPassword}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#ba1a1a]/30 dark:border-[#ba1a1a]/50 p-6">
              <h2 className="text-lg font-semibold text-[#ba1a1a] dark:text-[#f9dedc] mb-4">Danger Zone</h2>

              <div className="space-y-3">
                {/* Logout Button */}
                <button
                  onClick={() => setLogoutDialog(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#c6c6cd] dark:border-[#2e3347] text-[#191c1e] dark:text-[#e2e4ef] hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535] transition-colors"
                >
                  <LogoutIcon />
                  <span className="text-sm font-medium">Logout</span>
                </button>

                {/* Delete Account Button */}
                <button
                  onClick={() => setDeleteDialog(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#ba1a1a] dark:border-[#ba1a1a] text-[#ba1a1a] dark:text-[#f9dedc] hover:bg-[#fce4ec] dark:hover:bg-[#ba1a1a]/10 transition-colors"
                >
                  <TrashIcon />
                  <span className="text-sm font-medium">Delete Account</span>
                </button>
              </div>

              <p className="text-xs text-[#45464d] dark:text-[#9aa3bf] mt-4">
                These actions are permanent and cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Logout Confirmation Dialog */}
      <Dialog
        isOpen={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        title="Logout?"
        description="You will be logged out of your account."
        primaryAction={{
          label: 'Logout',
          onClick: handleLogout,
          loading: isLoggingOut,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setLogoutDialog(false),
        }}
      />

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        title="Delete Account?"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        isDangerous
        primaryAction={{
          label: 'Delete Account',
          onClick: handleDeleteAccount,
          variant: 'danger',
          loading: isDeletingAccount,
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setDeleteDialog(false),
        }}
      />
    </div>
  );
}
