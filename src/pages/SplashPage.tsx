import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Eye, Brain, Activity, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SplashPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1300);
    const t4 = setTimeout(() => setPhase(4), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(222,47%,8%)]">
      {/* Animated background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial gradient core */}
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(221 83% 53% / 0.4) 0%, hsl(221 83% 53% / 0.1) 40%, transparent 70%)" }} />

        {/* Orbiting rings */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 animate-[spin_30s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5 animate-[spin_45s_linear_infinite_reverse]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 animate-[spin_20s_linear_infinite]" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30 animate-[pulse_3s_ease-in-out_infinite]"
            style={{
              left: `${10 + (i * 4.2) % 80}%`,
              top: `${5 + (i * 7.3) % 90}%`,
              animationDelay: `${i * 0.3}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(221 83% 53%) 1px, transparent 1px), linear-gradient(90deg, hsl(221 83% 53%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* DNA helix decorative elements */}
      <div className="pointer-events-none absolute left-8 top-1/4 flex flex-col items-center gap-3 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-2 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite]"
            style={{ width: `${12 + Math.sin(i * 0.8) * 10}px`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <div className="pointer-events-none absolute right-8 bottom-1/4 flex flex-col items-center gap-3 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-2 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite]"
            style={{ width: `${12 + Math.cos(i * 0.8) * 10}px`, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center">
        {/* Animated eye icon */}
        <div className={`mb-8 transition-all duration-1000 ${phase >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-2 rounded-full bg-primary/10 animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-[hsl(222,47%,12%)]">
              <Eye className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Feature icons row */}
        <div className={`mb-8 flex items-center gap-6 transition-all duration-700 ${phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          {[
            { icon: Brain, label: "AI Analysis" },
            { icon: Activity, label: "Risk Prediction" },
            { icon: Shield, label: "Clinical Safety" },
            { icon: Sparkles, label: "Smart Insights" },
          ].map((item, i) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5"
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
                <item.icon className="h-5 w-5 text-primary/70" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-primary/40">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className={`mb-4 text-3xl font-bold leading-tight tracking-tight text-white transition-all duration-1000 sm:text-4xl md:text-5xl ${phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          AI-Based Clinical Intelligence System
          <br />
          <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            for Ophthalmology Risk Prediction
          </span>
          <br />
          <span className="text-2xl font-medium text-white/60 sm:text-3xl">
            & Workflow Optimization
          </span>
        </h1>

        {/* Separator line */}
        <div className={`my-6 h-px w-48 transition-all duration-700 ${phase >= 3 ? "w-48 opacity-100" : "w-0 opacity-0"}`}
          style={{ background: "linear-gradient(90deg, transparent, hsl(221 83% 53% / 0.5), transparent)" }} />

        {/* Team credit */}
        <p className={`mb-10 text-sm font-medium uppercase tracking-[0.3em] text-white/30 transition-all duration-700 ${phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Developed by{" "}
          <span className="bg-gradient-to-r from-primary/70 to-cyan-400/70 bg-clip-text text-transparent">
            Team Vision Sorcerers
          </span>
        </p>

        {/* Enter button */}
        <div className={`transition-all duration-700 ${phase >= 4 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="group relative gap-3 rounded-full border border-primary/30 bg-primary/10 px-10 py-6 text-base font-semibold text-white shadow-[0_0_30px_hsl(221_83%_53%/0.2)] backdrop-blur-sm transition-all hover:bg-primary/20 hover:shadow-[0_0_50px_hsl(221_83%_53%/0.35)]"
          >
            <span className="relative z-10">Enter Platform</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-cyan-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </div>

        {/* Bottom version tag */}
        <p className={`mt-12 text-xs text-white/15 transition-all duration-700 ${phase >= 4 ? "opacity-100" : "opacity-0"}`}>
          MindEye Spark · AI-Based Eye Clinical Intelligence Platform · v2.0
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
