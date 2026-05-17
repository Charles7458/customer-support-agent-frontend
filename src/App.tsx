import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import ConversationsPage from './pages/ConversationsPage';
import TicketsPage from './pages/TicketsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
