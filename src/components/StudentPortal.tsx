import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Student } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { 
  Download, 
  Share2, 
  Smartphone, 
  WifiOff, 
  RefreshCcw, 
  CheckCircle2,
  MapPin,
  Calendar,
  Building
} from 'lucide-react';
import { cn } from '../lib/utils';

export function StudentPortal() {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    // First try local storage for offline support
    const cached = localStorage.getItem(`id_card_${user.uid}`);
    if (cached) {
      setStudent(JSON.parse(cached));
      setLoading(false);
    }

    const q = query(
      collection(db, 'students'), 
      where('email', '==', user.email),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = {
          ...snapshot.docs[0].data(),
          docId: snapshot.docs[0].id
        } as Student;
        setStudent(data);
        localStorage.setItem(`id_card_${user.uid}`, JSON.stringify(data));
        setOfflineMode(false);
      } else {
        setStudent(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setOfflineMode(true);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (loading && !student) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-university-green border-t-university-yellow rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Synchronizing Identity record...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-6 shadow-xl">
        <div className="w-20 h-20 bg-university-green/5 text-university-green rounded-full flex items-center justify-center mx-auto ring-8 ring-university-green/5">
          <Smartphone className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Restricted</h2>
           <p className="text-slate-500 font-medium">
             Your account is verified, but we couldn't find a linked student registry record. 
           </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-400 font-medium border border-slate-100">
           Contact the University Digital Services or Registrar to enroll your biometric data and secure your Digital Student ID.
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 w-full py-4 bg-university-green hover:bg-university-green/90 text-white rounded-xl font-black transition-all shadow-lg shadow-emerald-100 uppercase tracking-widest text-xs"
        >
          <RefreshCcw className="w-4 h-4 text-university-yellow" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Identity Portal</h2>
          <p className="text-slate-500 flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest">
            {offlineMode ? <WifiOff className="w-3 h-3 text-amber-500" /> : <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            {offlineMode ? "Offline (Accessing Local Cache)" : "Secure Live Connection"}
          </p>
        </div>
        
        {student.status !== 'active' && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 border border-red-100 animate-pulse uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" />
            Registry Suspended
          </div>
        )}
      </div>

      {/* Digital ID Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-2 transition-all duration-500",
          student.status === 'active' ? "border-university-green/20 ring-1 ring-university-green/5" : "border-slate-200 opacity-75 grayscale"
        )}
      >
        {/* Header background design */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-university-green overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-university-yellow/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        </div>

        <div className="relative pt-12 px-8 pb-10 flex flex-col md:flex-row gap-10">
          {/* Portrait and Side Info */}
          <div className="flex flex-col items-center gap-6 md:w-56">
            <div className="relative">
              <div className="p-1 px-1 pb-1.5 bg-white rounded-3xl shadow-2xl ring-4 ring-white">
                <img 
                  src={student.passportURL} 
                  alt={student.name} 
                  className="w-48 h-56 object-cover rounded-[1.25rem]"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-university-yellow px-5 py-2 rounded-full shadow-lg border-2 border-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-university-green" />
                <span className="text-[10px] uppercase font-black text-university-green tracking-[0.15em]">Verified</span>
              </div>
            </div>

            <div className="bg-university-green/5 p-5 rounded-2xl w-full border border-university-green/10 text-center">
                <p className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-[0.2em] mb-1">Registration NO.</p>
                <p className="text-xl font-black text-university-green font-mono tracking-tight">{student.id}</p>
            </div>
          </div>

          {/* Details and QR */}
          <div className="flex-1 flex flex-col justify-between pt-4">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-university-yellow uppercase tracking-[0.3em] mb-2 bg-university-green/10 px-3 py-1 rounded-full inline-block">Official Student Name</p>
                <h3 className="text-4xl font-black text-slate-900 leading-[1.1] uppercase tracking-tighter">{student.name}</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-university-green/10 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-university-green" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Academic Faculty</p>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{student.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-university-green/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-university-green" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Academic Level</p>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{student.level}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 flex items-end justify-between gap-6">
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-[10px] font-black text-university-green/60 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5" />
                    COOU Main Campus
                 </div>
                 <div className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    This digital identity remains valid for the duration of studentship unless otherwise revoked by the Registrar.
                 </div>
              </div>

              <div className="bg-white p-3 border-2 border-university-green/10 rounded-3xl shadow-inner relative group">
                <div className="absolute inset-0 bg-university-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                <QRCodeSVG 
                  value={student.docId} 
                  size={110} 
                  level="H" 
                  aria-label="Student ID verification QR code"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Bar */}
        <div className="h-3 bg-linear-to-r from-university-green via-university-yellow to-university-green border-t border-white/20" />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-3 p-5 bg-white hover:bg-slate-50 transition-all border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 shadow-sm">
          <Download className="w-5 h-5 text-university-green" />
          Secure Download
        </button>
        <button className="flex items-center justify-center gap-3 p-5 bg-white hover:bg-slate-50 transition-all border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 shadow-sm">
          <Share2 className="w-5 h-5 text-university-green" />
          Share Identity
        </button>
      </div>
    </div>
  );
}
