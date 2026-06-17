import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ConversationsPage from './pages/ConversationsPage';
import TicketsPage from './pages/TicketsPage';
import ProfilePage from './pages/ProfilePage';
import SupportConversationsPage from './pages/SupportConversationsPage';
import InsertPage from './pages/InsertPage';


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            {/* normal login */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage isSupport={false}/>
                </PublicRoute>
              }
            />
            {/* support login */}
            <Route
              path="/login/support"
              element={
                <PublicRoute>
                  <LoginPage isSupport={true}/>
                </PublicRoute>
              }
            />
            {/* normal signup */}
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage isSupport={false} />
                </PublicRoute>
              }
            />
            {/* support signup */}
            <Route
              path="/signup/support"
              element={
                <PublicRoute>
                  <SignupPage isSupport={true}/>
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/support-chat/:conversation_id"
              element={
                <ProtectedRoute>
                  <SupportConversationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/conversations"
              element={
                <ProtectedRoute>
                  <ConversationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <TicketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insert"
              element={
                <ProtectedRoute>
                  <InsertPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/conversations" replace />} />
            <Route path="*" element={<Navigate to="/conversations" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
