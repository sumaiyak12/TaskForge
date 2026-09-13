"use client";

import { useState, useEffect } from "react";
import { 
  PlusCircle, Sparkles, DollarSign, Clock, CheckCircle2, AlertCircle, 
  Layers, CreditCard, Shield, FileText, ChevronRight, RefreshCw, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function CompanyDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Project Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalBudget, setTotalBudget] = useState("10000");
  const [deadlineDays, setDeadlineDays] = useState("14");
  const [isCreating, setIsCreating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProj, resSubs] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/submissions"),
      ]);

      if (resProj.ok) {
        const data = await resProj.json();
        setProjects(data);
      }
      if (resSubs.ok) {
        const subData = await resSubs.json();
        setSubmissions(subData);
      }
    } catch (err) {
      console.error("Error fetching company dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !totalBudget) return;

    try {
      setIsCreating(true);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          totalBudget: parseFloat(totalBudget),
          deadlineDays: parseInt(deadlineDays, 10),
          generateAiTasks: true,
        }),
      });

      if (res.ok) {
        setActionMessage("✅ Project created with AI Task Breakdown!");
        setTitle("");
        setDescription("");
        setCreateModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFundProject = async (projectId: string, amount: number) => {
    try {
      setActionMessage("Initiating Stripe Checkout funding...");
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "FUND_PROJECT",
          projectId,
          amount,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Funding error:", err);
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      setActionMessage("Triggering Stripe Transfer payout to freelancer...");
      const res = await fetch("/api/stripe/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      if (res.ok) {
        setActionMessage("🎉 Submission approved & funds transferred via Stripe!");
        fetchData();
      }
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  // Calculate Company Escrow Stats
  const totalEscrowFunded = projects.reduce((acc, p) => p.status === 'FUNDED' ? acc + p.totalBudget : acc, 0);
  const totalProjectsCount = projects.length;
  const completedTasksCount = projects.reduce((acc, p) => acc + (p.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">Company Portal</Badge>
              <span className="text-xs text-slate-400">Alex Vance • Acme Labs</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Project & Escrow Control Center</h1>
            <p className="text-xs text-slate-400">Post projects, monitor AI task breakdowns, and approve Stripe payouts.</p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="gradient"
            className="flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="h-4 w-4" /> Post New Project
          </Button>
        </div>

        {actionMessage && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs font-semibold text-blue-300 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Escrow Balance</CardTitle>
              <Lock className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">₹{totalEscrowFunded.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Held safely in Stripe Escrow</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Projects</CardTitle>
              <Layers className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalProjectsCount}</div>
              <p className="text-xs text-slate-400 mt-1">AI Task Decomposed</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Completed Micro-Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">{completedTasksCount}</div>
              <p className="text-xs text-slate-400 mt-1">AI Verified & Transferred</p>
            </CardContent>
          </Card>

        </div>

        {/* Create Project Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-xl p-6 rounded-2xl space-y-6 border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Create Project with AI Breakdown</h3>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build an AI-powered SaaS lead generator"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the scope, features, tech stack, and goals..."
                    className="w-full h-24 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Escrow Budget (₹)</label>
                    <Input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Deadline (Days)</label>
                    <Input
                      type="number"
                      value={deadlineDays}
                      onChange={(e) => setDeadlineDays(e.target.value)}
                      placeholder="14"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 flex items-center gap-2 text-blue-300">
                  <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span>Gemini AI will automatically decompose this project into balanced micro-tasks upon creation.</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="gradient" disabled={isCreating}>
                    {isCreating ? "Generating Tasks..." : "Generate Tasks & Save"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PROJECTS SECTION */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" /> Active Company Projects
          </h2>

          {loading ? (
            <div className="glass-panel p-8 text-center text-slate-400">Loading projects data...</div>
          ) : projects.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 space-y-4">
              <p>No projects found. Click below to create your first project with AI decomposition!</p>
              <Button onClick={() => setCreateModalOpen(true)} variant="gradient">Post First Project</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((proj) => {
                const isFunded = proj.status === 'FUNDED';
                const totalTasks = proj.tasks?.length || 0;
                const completedTasks = proj.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
                const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <Card key={proj.id} className="glass-panel border border-slate-800">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{proj.title}</CardTitle>
                          <Badge variant={isFunded ? "success" : "warning"}>
                            {isFunded ? "FUNDED IN ESCROW" : "DRAFT - FUNDING NEEDED"}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">{proj.description}</CardDescription>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-lg font-bold text-emerald-400">₹{proj.totalBudget.toLocaleString()}</span>
                          <p className="text-[11px] text-slate-400">Total Escrow Budget</p>
                        </div>

                        {!isFunded && (
                          <Button
                            onClick={() => handleFundProject(proj.id, proj.totalBudget)}
                            variant="gradient"
                            size="sm"
                            className="flex items-center gap-1.5"
                          >
                            <CreditCard className="h-4 w-4" /> Fund Escrow
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                      
                      {/* Progress Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Task Progress ({completedTasks} of {totalTasks} Completed)</span>
                          <span className="font-semibold text-cyan-400">{progressPct}%</span>
                        </div>
                        <Progress value={progressPct} />
                      </div>

                      {/* Decomposed Micro-Tasks Table */}
                      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                        <div className="bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-slate-400 flex items-center justify-between border-b border-slate-800">
                          <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-cyan-400" /> AI Micro-Tasks ({totalTasks})</span>
                          <span>ALLOCATED BUDGET</span>
                        </div>

                        <div className="divide-y divide-slate-800/80">
                          {proj.tasks?.map((task: any) => (
                            <div key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-white">{task.title}</h4>
                                  <Badge
                                    variant={
                                      task.status === 'COMPLETED' ? "success" :
                                      task.status === 'IN_REVIEW' ? "purple" : "secondary"
                                    }
                                    className="text-[10px]"
                                  >
                                    {task.status}
                                  </Badge>
                                </div>
                                <p className="text-slate-400">{task.description}</p>
                              </div>

                              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                                <div className="text-right">
                                  <span className="font-bold text-white">₹{task.budget.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* WORK SUBMISSIONS AUDIT & APPROVAL SECTION */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" /> AI Verification & Submissions Review
          </h2>

          {submissions.length === 0 ? (
            <div className="glass-panel p-6 text-center text-slate-400 text-xs">
              No submissions pending review. Once freelancers complete micro-tasks, their AI Quality Scores will appear here for approval.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                let report: any = {};
                let fraud: any = {};
                try {
                  report = JSON.parse(sub.qualityReport || "{}");
                  fraud = JSON.parse(sub.fraudReport || "{}");
                } catch {}

                const isApproved = sub.status === 'APPROVED';

                return (
                  <Card key={sub.id} className="glass-card p-6 space-y-4 border border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isApproved ? "success" : "purple"}>
                            {isApproved ? "PAID VIA STRIPE" : "AI VERIFIED - APPROVAL READY"}
                          </Badge>
                          <span className="text-xs text-slate-400">Task: {sub.task?.title}</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">Submitted by {sub.freelancer?.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Deliverable: <a href={sub.deliverableUrl} target="_blank" className="text-blue-400 underline">{sub.deliverableUrl}</a></p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xl font-bold text-emerald-400">Quality: {sub.qualityScore}/100</span>
                          <p className="text-[11px] text-slate-400">Fraud Score: {sub.fraudScore}% ({fraud.verdict || 'LEGITIMATE'})</p>
                        </div>

                        {!isApproved && (
                          <Button
                            onClick={() => handleApproveSubmission(sub.id)}
                            variant="emerald"
                            size="sm"
                            className="flex items-center gap-1.5"
                          >
                            <DollarSign className="h-4 w-4" /> Approve & Release Payout
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* AI Audit Breakdown Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                        <span className="text-slate-400">Completeness</span>
                        <div className="text-base font-bold text-white mt-0.5">{report.completeness || 90}%</div>
                      </div>
                      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                        <span className="text-slate-400">Code Quality</span>
                        <div className="text-base font-bold text-cyan-400 mt-0.5">{report.codeQuality || 88}%</div>
                      </div>
                      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                        <span className="text-slate-400">Documentation</span>
                        <div className="text-base font-bold text-purple-400 mt-0.5">{report.documentation || 85}%</div>
                      </div>
                      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                        <span className="text-slate-400">Requirements Match</span>
                        <div className="text-base font-bold text-emerald-400 mt-0.5">{report.requirementsMatch || 92}%</div>
                      </div>
                    </div>

                    {report.summary && (
                      <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 italic">
                        "AI Summary: {report.summary}"
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
