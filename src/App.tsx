import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentPortal } from './components/StudentPortal';
import { Scanner } from './components/Scanner';
import { Navbar } from './components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { IdCard, QrCode, LogIn } from 'lucide-react';
import { UNIVERSITY_NAME, APP_NAME } from './constants';

function AppContent() {
  const { user, profile, loading, login } = useAuth();
  const [view, setView] = useState<'dashboard' | 'scanner'>('dashboard');

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

  if (!user) {
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
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-2 bg-university-green hover:bg-university-green/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-100"
          >
            <LogIn className="w-5 h-5" />
            Login with COOU Portal Account
          </button>
          
          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={() => setView('scanner')}
              className="text-sm font-bold text-university-green hover:text-university-green/80 flex items-center justify-center gap-2 mx-auto"
            >
              <QrCode className="w-5 h-5 text-university-yellow" />
              Verify Student Identity
            </button>
          </div>
        </motion.div>

        {view === 'scanner' && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <Scanner onClose={() => setView('dashboard')} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar setView={setView} currentView={view} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {profile?.role === 'admin' || profile?.role === 'staff' ? (
                <AdminDashboard />
              ) : (
                <StudentPortal />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-xl mx-auto"
            >
              <Scanner onClose={() => setView('dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
