// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from './hooks/useTheme';
// import { AuthProvider } from './hooks/useAuth';
// import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import ConversationsPage from './pages/ConversationsPage';
// import TicketsPage from './pages/TicketsPage';
// import ProfilePage from './pages/ProfilePage';

// export default function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* Auth routes */}
//             <Route
//               path="/login"
//               element={
//                 <PublicRoute>
//                   <LoginPage />
//                 </PublicRoute>
//               }
//             />
//             <Route
//               path="/signup"
//               element={
//                 <PublicRoute>
//                   <SignupPage />
//                 </PublicRoute>
//               }
//             />

//             {/* Protected routes */}
//             <Route
//               path="/conversations"
//               element={
//                 <ProtectedRoute>
//                   <ConversationsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/tickets"
//               element={
//                 <ProtectedRoute>
//                   <TicketsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <ProfilePage />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Fallback */}
//             <Route path="/" element={<Navigate to="/conversations" replace />} />
//             <Route path="*" element={<Navigate to="/conversations" replace />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
