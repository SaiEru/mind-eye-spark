import Navbar from "@/components/Navbar";
import { Activity, AlertTriangle, TrendingUp, Camera, Users, Stethoscope } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAssessments: 0, highRiskCount: 0 });
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [doctorsRes, patientsRes, assessmentsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "doctor"),
        supabase.from("patients").select("id", { count: "exact" }),
        supabase.from("assessments").select("*"),
      ]);

      const allAssessments = assessmentsRes.data || [];
      const highRisk = allAssessments.filter((a: any) => a.risk_level === "High" || a.risk_level === "Critical").length;

      setStats({
        totalDoctors: doctorsRes.count || 0,
        totalPatients: patientsRes.count || 0,
        totalAssessments: allAssessments.length,
        highRiskCount: highRisk,
      });
      setAssessments(allAssessments);
    };
    load();
  }, []);

  const surgeryBreakdown = assessments.reduce((acc: Record<string, number>, a: any) => {
    const type = a.surgery_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(surgeryBreakdown).map(([name, value], i) => ({
    name, value,
    color: ["hsl(221, 83%, 53%)", "hsl(130, 60%, 45%)", "hsl(40, 90%, 55%)", "hsl(0, 70%, 55%)"][i % 4],
  }));

  const riskBreakdown = assessments.reduce((acc: Record<string, number>, a: any) => {
    acc[a.risk_level || "Low"] = (acc[a.risk_level || "Low"] || 0) + 1;
    return acc;
  }, {});

  const riskData = Object.entries(riskBreakdown).map(([name, count]) => ({ name, count }));

  const statCards = [
    { label: "Total Doctors", value: stats.totalDoctors.toString(), icon: Stethoscope, iconColor: "text-primary" },
    { label: "Total Patients", value: stats.totalPatients.toString(), icon: Users, iconColor: "text-primary" },
    { label: "Total Assessments", value: stats.totalAssessments.toString(), icon: Activity, iconColor: "text-primary" },
    { label: "High-Risk Cases", value: stats.highRiskCount.toString(), icon: AlertTriangle, iconColor: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground">Hospital Analytics Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Overview of all doctors, patients, and assessments.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="flex items-start justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{s.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {pieData.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">Surgery Type Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                {pieData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </div>
          )}

          {riskData.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">Risk Level Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {assessments.length === 0 && (
          <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No assessments yet</h3>
            <p className="mt-2 text-muted-foreground">Assessments will appear here once doctors start adding patients.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
