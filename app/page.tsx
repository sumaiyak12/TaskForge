"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Zap, Shield, ArrowRight, CheckCircle2, DollarSign, Code, Brain, 
  Search, Lock, Layers, BarChart3, Bot, ChevronRight, HelpCircle, Star, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  // Interactive AI Task Generator Widget State
  const [promptInput, setPromptInput] = useState("Build a food delivery website");
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoTasks, setDemoTasks] = useState([
    { title: "Design Food Delivery Landing Page", budget: "₹2,000", days: "3 Days", skills: ["Next.js", "Tailwind CSS", "Framer Motion"] },
    { title: "Create Auth System & User Roles", budget: "₹3,000", days: "5 Days", skills: ["Clerk", "TypeScript", "React"] },
    { title: "Build Admin Dashboard & Menu Management", budget: "₹5,000", days: "6 Days", skills: ["Prisma", "PostgreSQL", "Recharts"] }
  ]);

  const handleDemoGenerate = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      if (promptInput.toLowerCase().includes("mobile") || promptInput.toLowerCase().includes("app")) {
        setDemoTasks([
          { title: "Design iOS & Android UI Screens in Figma", budget: "₹4,000", days: "4 Days", skills: ["Figma", "UI/UX", "Mobile Design"] },
          { title: "Build React Native Navigation & Auth", budget: "₹5,000", days: "6 Days", skills: ["React Native", "Expo", "TypeScript"] },
          { title: "Integrate Push Notifications & Stripe Mobile Checkout", budget: "₹6,000", days: "7 Days", skills: ["Stripe API", "Firebase", "Node.js"] }
        ]);
      } else {
        setDemoTasks([
          { title: `Design & UI System for ${promptInput}`, budget: "₹2,500", days: "3 Days", skills: ["React", "Tailwind CSS", "UI/UX"] },
          { title: `Build Database Schema & API Controllers`, budget: "₹4,000", days: "5 Days", skills: ["Node.js", "Prisma", "TypeScript"] },
          { title: `Frontend Component Integration & Testing`, budget: "₹3,500", days: "4 Days", skills: ["Next.js", "Jest", "Vercel"] }
        ]);
      }
      setIsGenerating(false);
    }, 900);
  };

  const faqItems = [
    {
      q: "How does the AI Project Breakdown work?",
      a: "When a company inputs a high-level project (e.g. 'Build an AI chatbot'), Gemini AI analyzes the scope, splits it into bite-sized, independent micro-tasks, and calculates optimal budget allocations and deadlines."
    },
    {
      q: "How are payments handled securely with Stripe?",
      a: "The company funds the project upfront via Stripe Checkout. Funds are held safely in TaskForge Escrow. When a freelancer completes a micro-task and passes AI verification, Stripe Transfers automatically route payouts to the freelancer's connected bank account."
    },
    {
      q: "What happens if a submission is flawed or suspicious?",
      a: "Our AI Submission Auditor verifies code quality, completeness, and documentation. If quality score is <80 or fraud is detected, the submission enters review mode. Admins can moderate disputes and issue full refunds or payouts."
    },
    {
      q: "What is the difference between Free and Pro plans?",
      a: "Free users can post or complete up to 5 tasks/month. Pro users (₹499/month) get unlimited AI task breakdowns, priority skill matching, zero platform fee on earnings, and direct Stripe Connect instant payouts."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Next-Gen Micro-Task Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Turn Big Projects into <span className="glow-text">AI Micro-Tasks</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              Companies post high-level goals. AI decomposes them into micro-tasks, matches top developers, verifies submission quality, and Stripe handles escrow payouts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/dashboard/company">
                <Button variant="gradient" size="lg" className="flex items-center gap-2 text-base px-8 py-4">
                  <Zap className="h-5 w-5 fill-white" /> Post a Project
                </Button>
              </Link>
              <Link href="/dashboard/freelancer">
                <Button variant="secondary" size="lg" className="flex items-center gap-2 text-base border-slate-700 px-8 py-4">
                  <DollarSign className="h-5 w-5 text-emerald-400" /> Start Earning
                </Button>
              </Link>
            </div>

            {/* Platform Stats Row */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-2xl font-bold text-white">₹10M+</span>
                <p className="text-xs text-slate-400 mt-0.5">Escrow Paid Out</p>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-2xl font-bold text-cyan-400">99.4%</span>
                <p className="text-xs text-slate-400 mt-0.5">AI Quality Score</p>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-2xl font-bold text-blue-400">15,000+</span>
                <p className="text-xs text-slate-400 mt-0.5">Tasks Completed</p>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <span className="text-2xl font-bold text-emerald-400">&lt; 3 mins</span>
                <p className="text-xs text-slate-400 mt-0.5">Payout Speed</p>
              </div>
            </div>

          </div>

          {/* INTERACTIVE LIVE AI TASK GENERATOR DEMO WIDGET */}
          <div className="mt-16 max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">TaskForge AI Generator Sandbox</span>
              </div>
              <Badge variant="cyan" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Gemini 2.5 Engine
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Type any project (e.g., 'Build an AI SaaS platform' or 'Mobile Fitness App')..."
                  className="h-12 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm pr-10"
                />
                <Brain className="absolute right-3.5 top-3.5 h-5 w-5 text-slate-500" />
              </div>
              <Button
                onClick={handleDemoGenerate}
                disabled={isGenerating}
                variant="gradient"
                className="h-12 px-6 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Breakdown Project</span>
                  </>
                )}
              </Button>
            </div>

            {/* Generated Tasks Output List */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>AI DECOMPOSED MICRO-TASKS ({demoTasks.length})</span>
                <span>TOTAL BUDGET: ₹10,000</span>
              </div>

              {demoTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {task.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400">{task.budget}</span>
                      <p className="text-[11px] text-slate-400">{task.days}</p>
                    </div>
                    <Badge variant="success">Stripe Escrow Ready</Badge>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-b border-slate-800/60 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How TaskForge AI Works
            </h2>
            <p className="text-sm text-slate-400">
              4 simple steps to automate project breakdown, talent matching, and secure payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <Card className="glass-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
                  <Layers className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">1. Post & Fund Escrow</CardTitle>
                <CardDescription>
                  Companies enter a high-level project goal and fund the budget upfront via Stripe Checkout.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                  <Brain className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">2. AI Micro-Tasking</CardTitle>
                <CardDescription>
                  Gemini AI breaks the project into standalone micro-tasks with budget allocations and target skills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">3. Freelancers Build</CardTitle>
                <CardDescription>
                  AI skill matching alerts top freelancers. Submissions are uploaded with code repos and live demos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <DollarSign className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">4. AI Audit & Payout</CardTitle>
                <CardDescription>
                  AI verifies code quality (Score &gt; 80). Upon company approval, Stripe transfers instant payout.
                </CardDescription>
              </CardHeader>
            </Card>

          </div>

        </div>
      </section>

      {/* AI FEATURES SHOWCASE */}
      <section id="ai-features" className="py-20 border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <Badge variant="cyan" className="mb-2">Automated Intelligence</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Powered by 4 Core AI Engines
            </h2>
            <p className="text-sm text-slate-400">
              From scope analysis to automated quality scores and fraud detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">AI Project Breakdown</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Transforms complex multi-week software requests into modular micro-tasks with realistic budget allocation, skill tags, and strict deadlines.
              </p>
              <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 font-mono text-xs text-slate-300">
                <span className="text-blue-400">Input:</span> "Build a food delivery website"<br />
                <span className="text-emerald-400">Output:</span> Design Landing Page (₹2,000) → Auth System (₹3,000) → Admin Panel (₹5,000)
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">AI Skill Matching</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Scans developer GitHub, portfolio, and resume text to calculate personalized task match scores (0-100%) and instant task recommendations.
              </p>
              <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 font-mono text-xs text-slate-300">
                <span className="text-cyan-400">Match Score:</span> 96% Match for Rahul Sharma<br />
                <span className="text-slate-400">Reason:</span> Matched 4/4 required skills (Next.js, Tailwind, React, Clerk).
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">AI Submission Verification</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Audits deliverables for completeness, code quality, missing files, and documentation. Produces a 0-100 Quality Score report before company approval.
              </p>
              <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 font-mono text-xs text-slate-300">
                <span className="text-emerald-400">Quality Score:</span> 94/100 (Completeness: 98%, Code: 92%)<br />
                <span className="text-slate-400">Status:</span> Ready for Instant Approval & Transfer
              </div>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-xl font-bold text-white">AI Fraud & Security Detection</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Detects duplicate code repositories, spam URLs, AI-generated fake deliverables, and suspicious submission velocity to keep escrow 100% safe.
              </p>
              <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 font-mono text-xs text-slate-300">
                <span className="text-purple-400">Fraud Score:</span> 2% (LOW RISK)<br />
                <span className="text-slate-400">Verdict:</span> Authentic deliverable verified against git commits.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MARKETPLACE EXPLORER */}
      <section id="marketplace" className="py-20 border-b border-slate-800/60 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Live Micro-Tasks Marketplace</h2>
              <p className="text-sm text-slate-400 mt-1">Browse funded micro-tasks waiting for talent.</p>
            </div>
            <Link href="/dashboard/freelancer">
              <Button variant="outline" className="flex items-center gap-2 text-xs">
                View All Tasks in Dashboard <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Task Card 1 */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Stripe Funded</Badge>
                  <span className="text-xs font-semibold text-cyan-400">96% AI Match</span>
                </div>
                <CardTitle className="text-base mt-2">Design Food Delivery Landing Page</CardTitle>
                <CardDescription>Acme Labs • Food Delivery SaaS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <p>Create a high-converting, responsive landing page using Next.js 15, Tailwind CSS, and Framer Motion.</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded bg-slate-800 px-2 py-0.5">Next.js</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">Tailwind CSS</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">Framer Motion</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <span className="text-lg font-bold text-white">₹2,000</span>
                  <p className="text-[11px] text-slate-400">Deadline: 3 Days</p>
                </div>
                <Link href="/dashboard/freelancer">
                  <Button variant="gradient" size="sm">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Task Card 2 */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Stripe Funded</Badge>
                  <span className="text-xs font-semibold text-cyan-400">91% AI Match</span>
                </div>
                <CardTitle className="text-base mt-2">Create Auth System & User Roles</CardTitle>
                <CardDescription>Acme Labs • Food Delivery SaaS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <p>Integrate Clerk authentication supporting Customer, Restaurant Owner, and Delivery Agent roles.</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded bg-slate-800 px-2 py-0.5">React</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">Clerk</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">TypeScript</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <span className="text-lg font-bold text-white">₹3,000</span>
                  <p className="text-[11px] text-slate-400">Deadline: 5 Days</p>
                </div>
                <Link href="/dashboard/freelancer">
                  <Button variant="gradient" size="sm">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Task Card 3 */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="purple">AI Feature</Badge>
                  <span className="text-xs font-semibold text-cyan-400">88% AI Match</span>
                </div>
                <CardTitle className="text-base mt-2">Gemini RAG Pipeline Integration</CardTitle>
                <CardDescription>Nexus Commerce • Support Bot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <p>Implement document parsing, vector indexing, and Gemini API prompt pipeline for automated customer answers.</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded bg-slate-800 px-2 py-0.5">Python</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">Gemini API</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">FastAPI</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <span className="text-lg font-bold text-white">₹7,500</span>
                  <p className="text-[11px] text-slate-400">Deadline: 7 Days</p>
                </div>
                <Link href="/dashboard/freelancer">
                  <Button variant="gradient" size="sm">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>

          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="text-sm text-slate-400">Choose the plan that fits your growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Plan */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border border-slate-800">
              <div>
                <Badge variant="secondary" className="mb-4">Free Plan</Badge>
                <h3 className="text-2xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">Perfect for individual developers and small projects.</p>
                
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-slate-400"> / forever</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Up to 5 tasks per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Basic AI Task Breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Standard Stripe Escrow protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Standard support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link href="/dashboard/company">
                  <Button variant="outline" className="w-full">Get Started Free</Button>
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border-2 border-blue-500/50 relative shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-cyan-400 px-3 py-1 rounded-full text-[10px] font-bold text-white">
                MOST POPULAR
              </div>

              <div>
                <Badge variant="cyan" className="mb-4">Pro Plan</Badge>
                <h3 className="text-2xl font-bold text-white">Pro Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">For scaling software teams, agencies & active freelancers.</p>
                
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">₹499</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span><strong>Unlimited</strong> AI Project Breakdowns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Priority AI Skill Matching Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Automated AI Fraud Detection & Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Direct Stripe Connect Instant Payouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>0% Platform Commission Fee</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link href="/dashboard/company">
                  <Button variant="gradient" className="w-full">Upgrade to Pro Plan</Button>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-slate-950/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Everything you need to know about TaskForge AI.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl border border-slate-800/80">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  {item.q}
                </h4>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
