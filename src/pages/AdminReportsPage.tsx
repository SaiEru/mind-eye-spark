import Navbar from "@/components/Navbar";
import { FileText, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const riskBadgeVariant = (level: string) => {
  if (level === "High" || level === "Critical") return "destructive" as const;
  if (level === "Low") return "secondary" as const;
  return "outline" as const;
};

const AdminReportsPage = () => {
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });
      setAssessments(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = assessments.filter(
    (a) =>
      (a.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground">All Assessment Reports</h1>
        <p className="mt-2 text-muted-foreground">Hospital-wide patient assessment reports.</p>

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
            <p className="mt-2 text-muted-foreground">Reports will appear here once doctors complete assessments.</p>
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
                      <span className="font-semibold text-foreground">{a.patient_name || "Unknown"}</span>
                      <Badge variant={riskBadgeVariant(a.risk_level)}>{a.risk_level} Risk — {a.risk_score}%</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline" /> {new Date(a.created_at).toLocaleDateString()}
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

export default AdminReportsPage;
