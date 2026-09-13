import Link from "next/link";
import { Zap, ShieldCheck, Sparkles, CreditCard, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white">TaskForge AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Skill Marketplace for Micro-Tasks. Automated project decomposition, intelligent verification, and escrow payouts powered by Stripe Connect.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/#marketplace" className="hover:text-white transition-colors">Browse Micro-Tasks</Link></li>
              <li><Link href="/dashboard/company" className="hover:text-white transition-colors">Post a Project</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-white transition-colors">Freelancer Dashboard</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">Admin Moderation</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Column 3: AI Engine */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">AI Features</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="flex items-center gap-1.5 text-slate-400"><Sparkles className="h-3 w-3 text-cyan-400" /> AI Project Breakdown</span></li>
              <li><span className="flex items-center gap-1.5 text-slate-400"><Sparkles className="h-3 w-3 text-blue-400" /> Skill Matching Engine</span></li>
              <li><span className="flex items-center gap-1.5 text-slate-400"><Sparkles className="h-3 w-3 text-emerald-400" /> Submission Verification</span></li>
              <li><span className="flex items-center gap-1.5 text-slate-400"><ShieldCheck className="h-3 w-3 text-purple-400" /> Fraud Detection System</span></li>
            </ul>
          </div>

          {/* Column 4: Trust & Payments */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Secured By</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs">
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span>Stripe Escrow & Connect Payouts</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>AI Automated Quality Audits</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TaskForge AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-400">Security Audit</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
