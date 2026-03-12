import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Stethoscope, Mail, Phone, Hash, Shield, Calendar } from "lucide-react";

const DoctorProfilePage = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  const fields = [
    { label: "Full Name", value: profile.full_name, icon: Stethoscope },
    { label: "Email", value: profile.email, icon: Mail },
    { label: "Phone", value: profile.phone || "Not set", icon: Phone },
    { label: "Specialization", value: profile.specialization || "Not set", icon: Shield },
    { label: "License Number", value: profile.license_number || "Not set", icon: Hash },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{profile.full_name || "Doctor"}</h1>
            <p className="text-muted-foreground">{profile.specialization || "Doctor"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Profile Details</h2>
          <div className="space-y-5">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="font-medium text-foreground">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
