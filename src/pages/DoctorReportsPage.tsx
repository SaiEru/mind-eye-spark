import Navbar from "@/components/Navbar";
import { FileText, Download, Search, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const riskBadgeVariant = (level: string) => {
  if (level === "High" || level === "Critical") return "destructive" as const;
  if (level === "Low") return "secondary" as const;
  return "outline" as const;
};

const DoctorReportsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("assessments")
        .select("*")
        .eq("doctor_id", user.id)
        .order("created_at", { ascending: false });
      setAssessments(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const filtered = assessments.filter(
    (a) =>
      (a.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground">My Assessment Reports</h1>
        <p className="mt-2 text-muted-foreground">View reports for your patients.</p>

        <div className="mt-8 relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by patient name..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No reports yet</h3>
            <p className="mt-2 text-muted-foreground">Complete patient assessments to see reports here.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{a.patient_name || "Unknown Patient"}</span>
                      <Badge variant={riskBadgeVariant(a.risk_level)}>{a.risk_level} Risk — {a.risk_score}%</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 inline" /> {new Date(a.created_at).toLocaleDateString()}</span>
                      {a.surgery_type && <> · Surgery: <strong>{a.surgery_type}</strong></>}
                      {" · "}{a.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReportsPage;
