"use client";

import { useState, useEffect } from "react";
import { 
  Shield, DollarSign, Users, Layers, AlertTriangle, CheckCircle2, 
  RefreshCw, TrendingUp, BarChart3, Lock, ShieldCheck, UserCheck, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AdminDashboard() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/disputes");
      if (res.ok) {
        const data = await res.json();
        setDisputes(data);
      }
    } catch (err) {
      console.error("Error fetching disputes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolveDispute = async (disputeId: string, action: 'PAYOUT_FREELANCER' | 'REFUND_COMPANY') => {
    try {
      setActionMessage("Processing dispute resolution...");
      const res = await fetch("/api/disputes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId,
          action,
          adminNotes: `Resolved by Admin Moderator on ${new Date().toLocaleDateString()}`,
        }),
      });

      if (res.ok) {
        setActionMessage(`Dispute resolved successfully: ${action === 'PAYOUT_FREELANCER' ? 'Paid to Freelancer' : 'Refunded to Company'}`);
        fetchDisputes();
      }
    } catch (err) {
      console.error("Dispute resolution error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="text-xs">Super Admin Panel</Badge>
              <span className="text-xs text-slate-400">Platform Moderation & Analytics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">System Health & Dispute Center</h1>
            <p className="text-xs text-slate-400">Monitor financial volume, moderate user disputes, and review AI security audits.</p>
          </div>

          <Button onClick={fetchDisputes} variant="outline" size="sm" className="flex items-center gap-1 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Analytics
          </Button>
        </div>

        {actionMessage && (
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-xs font-semibold text-purple-300 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Platform Analytics Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Gross Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">₹25,000</div>
              <p className="text-xs text-slate-400 mt-1">+18.4% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Escrow Holdings</CardTitle>
              <Lock className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">₹15,000</div>
              <p className="text-xs text-slate-400 mt-1">Across 2 Active Projects</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Platform Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,248</div>
              <p className="text-xs text-slate-400 mt-1">Companies & Freelancers</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">AI Fraud Intercepts</CardTitle>
              <ShieldCheck className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">99.8%</div>
              <p className="text-xs text-slate-400 mt-1">Clean verification rate</p>
            </CardContent>
          </Card>

        </div>

        {/* REVENUE & METRICS VISUAL BAR CHART PREVIEW */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" /> Revenue & Task Volume Over Time
              </h3>
              <p className="text-xs text-slate-400">Monthly escrow deposits vs task payouts.</p>
            </div>
            <Badge variant="cyan">Realtime Analytics</Badge>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-4 pt-6 px-4 bg-slate-900/60 rounded-xl border border-slate-800">
            {[
              { month: "Jan", volume: 40 },
              { month: "Feb", volume: 55 },
              { month: "Mar", volume: 75 },
              { month: "Apr", volume: 60 },
              { month: "May", volume: 90 },
              { month: "Jun", volume: 110 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500"
                  style={{ height: `${item.volume}%` }}
                />
                <span className="text-[11px] font-mono text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* USER MANAGEMENT TABLE */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" /> Platform User Directory & Roles
          </h3>

          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Stripe Status</th>
                  <th className="px-4 py-3">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Alex Vance (alex@acmelabs.com)</td>
                  <td className="px-4 py-3"><Badge variant="default">COMPANY</Badge></td>
                  <td className="px-4 py-3 text-emerald-400">Escrow Account Active</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold">PRO</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Rahul Sharma (rahul.dev@gmail.com)</td>
                  <td className="px-4 py-3"><Badge variant="success">FREELANCER</Badge></td>
                  <td className="px-4 py-3 text-emerald-400">Stripe Connect Verified</td>
                  <td className="px-4 py-3">FREE</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">Priya Patel (priya.ai@gmail.com)</td>
                  <td className="px-4 py-3"><Badge variant="success">FREELANCER</Badge></td>
                  <td className="px-4 py-3 text-emerald-400">Stripe Connect Verified</td>
                  <td className="px-4 py-3">FREE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DISPUTE MODERATION CENTER */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-400" /> Active Dispute Moderation Center
          </h2>

          {loading ? (
            <div className="glass-panel p-8 text-center text-slate-400">Loading disputes data...</div>
          ) : disputes.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400 text-xs">
              Zero active disputes. All TaskForge AI transactions and code verifications are operating cleanly!
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => (
                <Card key={d.id} className="glass-card p-6 border border-slate-800 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">{d.status}</Badge>
                        <span className="text-xs text-slate-400">Task: {d.task?.title}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">Dispute raised by {d.raisedBy?.name} ({d.raisedBy?.role})</h3>
                      <p className="text-xs text-slate-300 mt-1">Reason: "{d.reason}"</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleResolveDispute(d.id, 'REFUND_COMPANY')}
                        variant="destructive"
                        size="sm"
                      >
                        Refund Company
                      </Button>
                      <Button
                        onClick={() => handleResolveDispute(d.id, 'PAYOUT_FREELANCER')}
                        variant="emerald"
                        size="sm"
                      >
                        Payout Freelancer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
