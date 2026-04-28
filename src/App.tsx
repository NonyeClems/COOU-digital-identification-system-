import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentPortal } from './components/StudentPortal';
import { Scanner } from './components/Scanner';
import { Navbar } from './components/Navbar';
import { VerificationPortal } from './components/VerificationPortal';
import { motion, AnimatePresence } from 'motion/react';
import { IdCard, QrCode, LogIn } from 'lucide-react';
import { UNIVERSITY_NAME, APP_NAME } from './constants';

function AppContent() {
  const { user, profile, loading, login } = useAuth();
  const [loginError, setLoginError] = useState<string>('');
  const [email, setEmail] = useState('');
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginError('');
      await login();
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during login.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-4 border-university-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Allow public verification routes even if not logged in
  if (!user && !location.pathname.startsWith('/verify')) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center space-y-6 border-t-4 border-university-green"
        >
          <div className="w-16 h-16 bg-university-green/10 rounded-full flex items-center justify-center mx-auto">
            <IdCard className="w-8 h-8 text-university-green" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-university-green uppercase tracking-wider">{UNIVERSITY_NAME}</h2>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Student Identification Number System</h1>
          </div>
          <p className="text-slate-600 text-sm">
            Access your secure digital ID card or manage university identification records.
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-university-green hover:bg-university-green/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-100"
            >
              <LogIn className="w-5 h-5" />
              Login / Register with COOU Account
            </button>
          </form>
          
          <div className="pt-6 border-t border-slate-100">
            <NavigateToScanner />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {user && <Navbar />}
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={
            profile?.role === 'admin' || profile?.role === 'staff' ? (
              <AdminDashboard />
            ) : (
              <StudentPortal />
            )
          } />
          <Route path="/scanner" element={<Scanner onClose={() => {}} />} />
          <Route path="/verify/:studentId" element={<VerificationPortal />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="py-12 text-center space-y-2">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} {UNIVERSITY_NAME}
        </p>
        <p className="text-slate-300 text-[10px]">Registry & Records Information System</p>
      </footer>
    </div>
  );
}

function NavigateToScanner() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/scanner')}
      className="text-sm font-bold text-university-green hover:text-university-green/80 flex items-center justify-center gap-2 mx-auto cursor-pointer"
    >
       <QrCode className="w-5 h-5 text-university-yellow" />
       Verify Student Identity
    </button>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

