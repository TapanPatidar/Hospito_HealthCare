import React from 'react';
import { LogOut, HeartPulse, ShieldCheck, User as UserIcon, Stethoscope, Pill, PhoneCall, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Header = ({ 
  user, 
  onSignOut, 
  onQuickSwitchRole,
  onOpenAuth
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Logo & Healthcare Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-md shadow-blue-900/15">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2.5xl font-black text-slate-900 tracking-tight">Hospito</span>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span>Health Network</span>
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-400 font-medium tracking-tight -mt-0.5">
              Digital Prescriptions • Clinical Records • Pharmacy Dispensing
            </p>
          </div>
        </div>

        {/* Role Portal Quick Switcher (when authenticated) */}
        {user && onQuickSwitchRole && (
          <div className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">Switch View:</span>
            
            <button
              onClick={() => onQuickSwitchRole('patient')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                user.role === 'patient'
                  ? 'bg-white text-teal-800 shadow-xs border border-teal-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient</span>
            </button>

            <button
              onClick={() => onQuickSwitchRole('doctor')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                user.role === 'doctor'
                  ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              <span>Doctor</span>
            </button>

            <button
              onClick={() => onQuickSwitchRole('pharmacist')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                user.role === 'pharmacist'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pharmacy</span>
            </button>
          </div>
        )}

        {/* Right Actions: Helpline + Profile / Login */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 24/7 Helpline Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-800 text-xs font-bold">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 Helpline</span>
          </div>

          {user ? (
            <>
              {/* User Name Badge */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{user.name}</span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 uppercase font-extrabold">
                  {user.role}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                id="btn-sign-out"
                onClick={onSignOut}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/15 transition-all cursor-pointer active:scale-95"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </motion.header>
  );
};
