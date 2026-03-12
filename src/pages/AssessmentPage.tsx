import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FileText, PenLine, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { AssessmentData, initialAssessmentData, RiskResult } from "@/types/assessment";
import { calculateRiskScore } from "@/lib/riskCalculator";
import Step1Demographics from "@/components/assessment/Step1Demographics";
import Step2Surgery from "@/components/assessment/Step2Surgery";
import Step3MedicalHistory from "@/components/assessment/Step3MedicalHistory";
import Step4PreOperative from "@/components/assessment/Step4PreOperative";
import Step5PostOperative from "@/components/assessment/Step5PostOperative";
import Step6Symptoms from "@/components/assessment/Step6Symptoms";
import Step7FollowUp from "@/components/assessment/Step7FollowUp";
import RiskResultView from "@/components/assessment/RiskResultView";

const stepLabels = [
  "Demographics",
  "Surgery Info",
  "Medical History",
  "Pre-operative",
  "Post-operative",
  "Symptoms",
  "Follow-up",
];

type Mode = "entry" | "form" | "result";

const AssessmentPage = () => {
  const [mode, setMode] = useState<Mode>("entry");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(initialAssessmentData);
  const [result, setResult] = useState<RiskResult | null>(null);

  const handleChange = (partial: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleAnalyze = () => {
    const r = calculateRiskScore(data);
    setResult(r);
    setMode("result");
  };

  const handleReset = () => {
    setData(initialAssessmentData);
    setResult(null);
    setStep(0);
    setMode("entry");
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <Step1Demographics data={data} onChange={handleChange} />;
      case 1: return <Step2Surgery data={data} onChange={handleChange} />;
      case 2: return <Step3MedicalHistory data={data} onChange={handleChange} />;
      case 3: return <Step4PreOperative data={data} onChange={handleChange} />;
      case 4: return <Step5PostOperative data={data} onChange={handleChange} />;
      case 5: return <Step6Symptoms data={data} onChange={handleChange} />;
      case 6: return <Step7FollowUp data={data} onChange={handleChange} />;
      default: return null;
    }
  };

  // Entry screen
  if (mode === "entry") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="text-3xl font-bold text-foreground">Patient Risk Assessment</h1>
          <p className="mt-2 text-muted-foreground">
            Choose how you'd like to enter clinical data.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <button
              onClick={() => setMode("form")}
              className="group rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Upload Medical Report</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a PDF or image-based post-operative report. AI will extract clinical values and pre-fill the form.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">Supports PDF, JPEG, PNG</p>
            </button>

            <button
              onClick={() => setMode("form")}
              className="group rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <PenLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Manual Data Entry</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter all clinical data manually using the step-by-step assessment form.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">7 assessment steps</p>
            </button>
          </div>

          <footer className="mt-16 flex flex-wrap items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
            <p><strong>Disclaimer:</strong> For demonstration purposes only. Not a medical diagnosis tool.</p>
            <p>Built using AI &amp; Machine Learning concepts</p>
          </footer>
        </div>
      </div>
    );
  }

  // Result screen
  if (mode === "result" && result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Risk Assessment Results</h1>
          <RiskResultView result={result} onReset={handleReset} />
        </div>
      </div>
    );
  }

  // Multi-step form
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => step === 0 ? setMode("entry") : setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Risk Assessment</h1>
            <p className="text-sm text-muted-foreground">Step {step + 1} of 7 — {stepLabels[step]}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-1">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-[10px] text-muted-foreground md:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => step === 0 ? setMode("entry") : setStep(step - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? "Back" : "Previous"}
          </Button>

          {step < 6 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleAnalyze} className="gap-2 bg-primary shadow-lg shadow-primary/25">
              <CheckCircle2 className="h-4 w-4" />
              Analyze Risk
            </Button>
          )}
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          <p><strong>Disclaimer:</strong> For demonstration purposes only. Not a medical diagnosis tool.</p>
        </footer>
      </div>
    </div>
  );
};

export default AssessmentPage;
