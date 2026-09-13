"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, Sparkles, CreditCard, CheckCircle2, Clock, 
  Code, Send, ShieldCheck, UserCheck, AlertCircle, ExternalLink, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function FreelancerDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [stripeStatus, setStripeStatus] = useState<any>({ stripeConnected: false, payouts: [] });
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  // Submit Work Modal State
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTasks, resStripe] = await Promise.all([
        fetch("/api/tasks?recommended=true"),
        fetch("/api/stripe/connect"),
      ]);

      if (resTasks.ok) {
        const tData = await resTasks.json();
        setTasks(tData);
      }
      if (resStripe.ok) {
        const sData = await resStripe.json();
        setStripeStatus(sData);
      }
    } catch (err) {
      console.error("Error loading freelancer dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConnectStripe = async () => {
    try {
      setActionMessage("Redirecting to Stripe Connect onboarding...");
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setActionMessage(data.error || "Unable to start Stripe onboarding.");
      }
    } catch (err) {
      console.error("Stripe connect error:", err);
      setActionMessage("Unable to start Stripe onboarding. Please try again.");
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !deliverableUrl) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selectedTask.id,
          deliverableUrl,
          repoUrl,
          notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setVerificationResult(data.verificationResult);
        setActionMessage(`🎉 Work submitted! AI Quality Score: ${data.verificationResult.qualityScore}/100.`);
        fetchData();
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Freelancer Stats
  const totalEarned = stripeStatus.payouts?.reduce((acc: number, p: any) => acc + p.amount, 0) || 2000;
  const pendingTasksCount = tasks.filter((t) => t.status === 'IN_REVIEW' || t.status === 'ASSIGNED').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length + 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">Freelancer Workspace</Badge>
              <span className="text-xs text-slate-400">Rahul Sharma • React & AI Specialist</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Recommended Tasks & Earnings</h1>
            <p className="text-xs text-slate-400">AI matches tasks with your tech stack. Submit work for automated quality audits and Stripe payouts.</p>
          </div>

          <div className="flex items-center gap-3">
            {!stripeStatus.stripeConnected ? (
              <Button onClick={handleConnectStripe} variant="gradient" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Connect Stripe Account
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Stripe Account Connected
              </div>
            )}
          </div>
        </div>

        {actionMessage && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs font-semibold text-blue-300 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Transferred Payouts</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">₹{totalEarned.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Direct via Stripe Connect</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active / In-Review Tasks</CardTitle>
              <Clock className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">{pendingTasksCount}</div>
              <p className="text-xs text-slate-400 mt-1">Awaiting approval or in progress</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Completed Micro-Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedTasksCount}</div>
              <p className="text-xs text-slate-400 mt-1">Quality Score &gt; 80% average</p>
            </CardContent>
          </Card>

        </div>

        {/* FREELANCER SKILL PROFILE */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Your AI Skill Profile</h3>
            </div>
            <Badge variant="cyan">AI Skill Matching Active</Badge>
          </div>
          <p className="text-xs text-slate-400">Your profile skills are used by the AI engine to rank open micro-tasks specifically for you.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Prisma"].map((skill, i) => (
              <span key={i} className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs text-blue-400 font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* RECOMMENDED TASKS MARKETPLACE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" /> AI Skill-Matched Micro-Tasks
            </h2>
            <Button onClick={fetchData} variant="ghost" size="sm" className="text-xs flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Matching
            </Button>
          </div>

          {loading ? (
            <div className="glass-panel p-8 text-center text-slate-400">Loading AI recommended tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400">No open tasks available right now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => {
                const matchScore = task.matchScore || 90;
                const isCompleted = task.status === 'COMPLETED';
                const isInReview = task.status === 'IN_REVIEW';

                return (
                  <Card key={task.id} className="glass-card p-6 flex flex-col justify-between space-y-4 border border-slate-800">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={isCompleted ? "success" : isInReview ? "purple" : "default"}>
                          {task.status}
                        </Badge>
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> {matchScore}% AI Match
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">{task.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{task.project?.company?.name || 'Acme Labs'} • {task.project?.title}</p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

                      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-[11px] text-slate-400">
                        <strong className="text-cyan-400">Why matched:</strong> {task.recommendationReason}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.parsedSkills?.map((sk: string, sIdx: number) => (
                          <span key={sIdx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div>
                        <span className="text-lg font-bold text-emerald-400">₹{task.budget?.toLocaleString()}</span>
                        <p className="text-[11px] text-slate-400">Escrow Funded</p>
                      </div>

                      {!isCompleted && (
                        <Button
                          onClick={() => {
                            setSelectedTask(task);
                            setVerificationResult(null);
                          }}
                          variant="gradient"
                          size="sm"
                          className="flex items-center gap-1.5"
                        >
                          <Send className="h-4 w-4" /> {isInReview ? "Update Submission" : "Submit Deliverable"}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* SUBMIT WORK MODAL */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-xl p-6 rounded-2xl space-y-6 border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Submit Work for "{selectedTask.title}"</h3>
                  <p className="text-xs text-slate-400">Allocated Budget: ₹{selectedTask.budget?.toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deliverable URL (Live Demo or Vercel URL)</label>
                  <Input
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://my-task-demo.vercel.app"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GitHub / Code Repository URL</label>
                  <Input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repo-name"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Implementation Notes & Documentation</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Explain key features, setup instructions, lighthouse scores, or technical choices..."
                    className="w-full h-20 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Submitting will run instant AI Verification (Score 0-100) & Fraud Audit.</span>
                </div>

                {verificationResult && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2 text-emerald-300">
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>AI Verification Quality Score:</span>
                      <span className="text-lg text-emerald-400">{verificationResult.qualityScore}/100</span>
                    </div>
                    <p className="text-xs text-slate-300">"{verificationResult.qualityReport?.summary}"</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setSelectedTask(null)}>Cancel</Button>
                  <Button type="submit" variant="gradient" disabled={isSubmitting}>
                    {isSubmitting ? "Running AI Audit..." : "Submit Deliverable"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
