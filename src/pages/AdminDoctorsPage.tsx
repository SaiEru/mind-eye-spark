import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Stethoscope, Mail, Phone, Loader2, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

type Doctor = {
  id: string;
  email: string;
  full_name: string;
  specialization: string;
  phone: string;
  license_number: string;
  created_at: string;
};

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", specialization: "", phone: "", license_number: "" });
  const { toast } = useToast();

  const loadDoctors = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("role", "doctor").order("created_at", { ascending: false });
    setDoctors((data as Doctor[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadDoctors(); }, []);

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.full_name) {
      toast({ title: "Missing fields", description: "Email, password, and name are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${url}/functions/v1/create-doctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create doctor");
      toast({ title: "Doctor created", description: `${form.full_name} can now sign in.` });
      setForm({ email: "", password: "", full_name: "", specialization: "", phone: "", license_number: "" });
      setOpen(false);
      loadDoctors();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Doctors</h1>
            <p className="mt-2 text-muted-foreground">Add and manage doctor accounts.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><UserPlus className="h-4 w-4" />Add Doctor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Dr. John Doe" />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@hospital.com" />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Ophthalmology" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} placeholder="MCI-12345" />
                </div>
                <Button onClick={handleCreate} disabled={submitting} className="w-full gap-2">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Doctor Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : doctors.length === 0 ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No doctors yet</h3>
            <p className="mt-2 text-muted-foreground">Click "Add Doctor" to create the first doctor account.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doc.full_name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{doc.email}</span>
                      {doc.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{doc.phone}</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {doc.specialization && <>{doc.specialization} · </>}
                      {doc.license_number && <>License: {doc.license_number}</>}
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

export default AdminDoctorsPage;
