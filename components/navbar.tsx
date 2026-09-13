"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Zap, Shield, UserCheck, ChevronDown, Layers, LayoutDashboard, PlusCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"COMPANY" | "FREELANCER" | "ADMIN">("COMPANY");
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Zap className="h-5 w-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                TaskForge <span className="glow-text">AI</span>
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> v2.0
              </span>
            </div>
            <span className="text-[11px] text-slate-400 tracking-wider">AI Skill Marketplace</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#marketplace" className="text-sm text-slate-300 hover:text-white transition-colors">
            Marketplace
          </Link>
          <Link href="/#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#ai-features" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> AI Engine
          </Link>
          <Link href="/#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
            Pricing
          </Link>

          {/* Quick Role View Switcher for Instant Dev & Demo Testing */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-900 transition-all"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-blue-400" />
              <span>Role: <strong className="text-blue-400">{activeRole}</strong></span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50">
                <Link
                  href="/dashboard/company"
                  onClick={() => { setActiveRole("COMPANY"); setRoleMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                >
                  <PlusCircle className="h-4 w-4 text-blue-400" /> Company Dashboard
                </Link>
                <Link
                  href="/dashboard/freelancer"
                  onClick={() => { setActiveRole("FREELANCER"); setRoleMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                >
                  <Wallet className="h-4 w-4 text-emerald-400" /> Freelancer Dashboard
                </Link>
                <Link
                  href="/dashboard/admin"
                  onClick={() => { setActiveRole("ADMIN"); setRoleMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-purple-400 transition-colors"
                >
                  <Shield className="h-4 w-4 text-purple-400" /> Admin Moderation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : isLoaded ? (
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-slate-700 hover:border-slate-600">
                Sign In
              </Button>
            </SignInButton>
          ) : null}
          <Link href="/dashboard/freelancer">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex border-slate-700 hover:border-slate-600">
              Start Earning
            </Button>
          </Link>
          <Link href="/dashboard/company">
            <Button variant="gradient" size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Post a Project
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
