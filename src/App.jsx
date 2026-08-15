import React, { useState } from 'react';
import { Header } from './components/Header.jsx';
import { ModernHero } from './components/ModernHero.jsx';
import { AuthView } from './components/AuthView.jsx';
import { PatientDashboard } from './components/PatientDashboard.jsx';
import { DoctorDashboard } from './components/DoctorDashboard.jsx';
import { PharmacistDashboard } from './components/PharmacistDashboard.jsx';
import { HospitoChatbot } from './components/HospitoChatbot.jsx';
import { Footer } from './components/Footer.jsx';
import { api } from './api/client.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [viewState, setViewState] = useState('landing');

  const handleAuthSuccess = (user, authToken) => {
    setCurrentUser(user);
    setToken(authToken);
    setViewState('landing');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setToken(null);
    setViewState('landing');
  };

  // 1-Click Instant Demo Launcher
  const handleQuickDemoLogin = async (role) => {
    try {
      let email = 'patient@demo.com';
      let pass = 'Patient@2025!';
      if (role === 'doctor') {
        email = 'doctor@demo.com';
        pass = 'Doctor@2025!';
      } else if (role === 'pharmacist') {
        email = 'pharmacist@demo.com';
        pass = 'Pharma@2025!';
      }
      const res = await api.login(email, pass);
      handleAuthSuccess(res.user, res.token);
    } catch (err) {
      console.warn('Demo login error:', err);
      setViewState('auth');
    }
  };

  const handleQuickSwitchRole = async (targetRole) => {
    await handleQuickDemoLogin(targetRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Header */}
      <Header
        user={currentUser}
        onSignOut={handleSignOut}
        onQuickSwitchRole={currentUser ? handleQuickSwitchRole : undefined}
        onOpenAuth={() => setViewState('auth')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {!currentUser ? (
          viewState === 'landing' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
              <ModernHero
                onQuickDemoLogin={handleQuickDemoLogin}
                onOpenAuth={() => setViewState('auth')}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center py-6">
              <div className="max-w-5xl mx-auto px-4 w-full mb-3">
                <button
                  onClick={() => setViewState('landing')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                >
                  <span>← Back to Overview</span>
                </button>
              </div>
              <AuthView onAuthSuccess={handleAuthSuccess} />
            </div>
          )
        ) : (
          <div className="flex-1">
            {currentUser.role === 'patient' && <PatientDashboard user={currentUser} />}
            {currentUser.role === 'doctor' && <DoctorDashboard user={currentUser} />}
            {currentUser.role === 'pharmacist' && <PharmacistDashboard user={currentUser} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Hospito AI Health & Clinical Guidance Chatbot (Bilingual: English & Hindi) */}
      <HospitoChatbot user={currentUser} />
    </div>
  );
}
