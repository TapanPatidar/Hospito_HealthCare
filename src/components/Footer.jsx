import React from 'react';
import { HeartPulse, ShieldCheck, Lock, PhoneCall, Globe, Sparkles, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">Hospito</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unified healthcare interoperability connecting patients, physicians, and dispensaries through secure digital prescriptions and EHR workflows.
            </p>
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>HIPAA-Ready & Encrypted</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Platform Features</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><span className="hover:text-teal-700 cursor-pointer">Patient Health Hub</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">Doctor E-Prescribing Suite</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">Pharmacy Dispensary Queue</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">Live Order Alerts</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">Bilingual AI Health Assistant</span></li>
            </ul>
          </div>

          {/* Col 3: Clinical Integrations */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Interoperability</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><span className="hover:text-teal-700 cursor-pointer">HL7 / FHIR Standard JSON</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">MongoDB Atlas Cloud Database</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">Drug Interaction Safety Checks</span></li>
              <li><span className="hover:text-teal-700 cursor-pointer">Clinical Audit Logs</span></li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Cloud Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Emergency Contact</h4>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
              <div className="text-[11px] font-extrabold text-rose-900 uppercase">Emergency Medical Hotline</div>
              <div className="text-sm font-black text-rose-700">1800-HOSPITO (24/7)</div>
              <p className="text-[10px] text-rose-600">For life-threatening emergencies, dial 911 / 112 immediately.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 Hospito Health Systems Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
