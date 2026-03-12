import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Activity, Loader2, Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Patient = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  contact_number: string | null;
  diagnosis: string | null;
  notes: string | null;
  created_at: string;
};

const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ full_name: "", age: "", gender: "", contact_number: "", diagnosis: "", notes: "" });
  const { toast } = useToast();

  const loadPatients = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("doctor_id", user.id)
      .order("created_at", { ascending: false });
    setPatients((data as Patient[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadPatients(); }, [user]);

  const handleCreate = async () => {
    if (!form.full_name || !user) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("patients").insert({
      doctor_id: user.id,
      full_name: form.full_name,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      contact_number: form.contact_number || null,
      diagnosis: form.diagnosis || null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Patient added" });
      setForm({ full_name: "", age: "", gender: "", contact_number: "", diagnosis: "", notes: "" });
      setOpen(false);
      loadPatients();
    }
  };

  const filtered = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
            <p className="mt-2 text-muted-foreground">Manage your patient records.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><UserPlus className="h-4 w-4" />Add Patient</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Patient</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><Label>Full Name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Age</Label><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
                  <div><Label>Gender</Label><Input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Male/Female/Other" /></div>
                </div>
                <div><Label>Contact Number</Label><Input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} /></div>
                <div><Label>Diagnosis</Label><Input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} /></div>
                <div><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <Button onClick={handleCreate} disabled={submitting} className="w-full gap-2">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add Patient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
            <div><p className="text-sm text-muted-foreground">Total Patients</p><p className="mt-1 text-3xl font-bold text-foreground">{patients.length}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
          </div>
          <div className="flex items-start justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
            <div><p className="text-sm text-muted-foreground">Assessments Done</p><p className="mt-1 text-3xl font-bold text-foreground">—</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Activity className="h-5 w-5 text-primary" /></div>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">{search ? "No patients found" : "No patients yet"}</h3>
            <p className="mt-2 text-muted-foreground">Click "Add Patient" to add your first patient.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.full_name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.age && `Age: ${p.age}`} {p.gender && `· ${p.gender}`} {p.contact_number && `· ${p.contact_number}`}
                    </p>
                    {p.diagnosis && <Badge variant="outline" className="mt-2">{p.diagnosis}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
