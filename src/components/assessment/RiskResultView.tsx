import { RiskResult, AssessmentData } from "@/types/assessment";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Shield, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { result: RiskResult; onReset: () => void; data?: AssessmentData };

const riskColors: Record<string, string> = {
  Low: "bg-green-500",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-destructive",
};

function generateReportText(result: RiskResult, data?: AssessmentData): string {
  const lines: string[] = [];
  lines.push("═══════════════════════════════════════════════════════");
  lines.push("     EYE COMPLICATION RISK ASSESSMENT REPORT");
  lines.push("═══════════════════════════════════════════════════════");
  lines.push(`Date: ${new Date().toLocaleString()}`);
  lines.push("");

  if (data) {
    lines.push("── PATIENT INFORMATION ──────────────────────────────");
    if (data.patientId) lines.push(`Patient ID:      ${data.patientId}`);
    if (data.fullName) lines.push(`Full Name:       ${data.fullName}`);
    if (data.age) lines.push(`Age:             ${data.age}`);
    if (data.gender) lines.push(`Gender:          ${data.gender}`);
    if (data.contactNumber) lines.push(`Contact:         ${data.contactNumber}`);
    lines.push("");

    lines.push("── SURGERY INFORMATION ─────────────────────────────");
    if (data.surgeryType) lines.push(`Surgery Type:    ${data.surgeryType}`);
    if (data.surgeryDate) lines.push(`Surgery Date:    ${data.surgeryDate}`);
    if (data.surgeonName) lines.push(`Surgeon:         ${data.surgeonName}`);
    if (data.eyeSide) lines.push(`Eye Side:        ${data.eyeSide}`);
    if (data.anesthesiaType) lines.push(`Anesthesia:      ${data.anesthesiaType}`);
    lines.push("");

    lines.push("── MEDICAL HISTORY ────────────────────────────────");
    lines.push(`Diabetes:              ${data.diabetes}`);
    lines.push(`Hypertension:          ${data.hypertension ? "Yes" : "No"}`);
    lines.push(`Immunocompromised:     ${data.immunocompromised ? "Yes" : "No"}`);
    lines.push(`Previous Eye Surgery:  ${data.previousEyeSurgery ? "Yes" : "No"}`);
    if (data.allergies) lines.push(`Allergies:             ${data.allergies}`);
    if (data.currentMedications) lines.push(`Medications:           ${data.currentMedications}`);
    lines.push("");

    lines.push("── CLINICAL MEASUREMENTS ──────────────────────────");
    if (data.preVisualAcuity) lines.push(`Pre-op Visual Acuity:    ${data.preVisualAcuity}`);
    if (data.intraocularPressure) lines.push(`Pre-op IOP:              ${data.intraocularPressure} mmHg`);
    if (data.postVisualAcuity) lines.push(`Post-op Visual Acuity:   ${data.postVisualAcuity}`);
    if (data.postIntraocularPressure) lines.push(`Post-op IOP:             ${data.postIntraocularPressure} mmHg`);
    if (data.cornealEdema) lines.push(`Corneal Edema:           ${data.cornealEdema}`);
    if (data.anteriorChamberReaction) lines.push(`AC Reaction:             ${data.anteriorChamberReaction}`);
    if (data.woundIntegrity) lines.push(`Wound Integrity:         ${data.woundIntegrity}`);
    if (data.painLevel) lines.push(`Pain Level:              ${data.painLevel}/10`);
    lines.push("");

    const symptoms = [];
    if (data.blurredVision) symptoms.push("Blurred Vision");
    if (data.eyePain) symptoms.push("Eye Pain");
    if (data.redness) symptoms.push("Redness");
    if (data.discharge) symptoms.push("Discharge");
    if (data.photophobia) symptoms.push("Photophobia");
    if (data.floaters) symptoms.push("Floaters");
    if (symptoms.length > 0) {
      lines.push("── REPORTED SYMPTOMS ──────────────────────────────");
      lines.push(symptoms.join(", "));
      lines.push("");
    }
  }

  lines.push("═══════════════════════════════════════════════════════");
  lines.push("     RISK ASSESSMENT RESULTS");
  lines.push("═══════════════════════════════════════════════════════");
  lines.push("");
  lines.push(`Overall Risk Score:  ${result.overallScore} / 100`);
  lines.push(`Risk Level:          ${result.riskLevel}`);
  lines.push("");
  lines.push(`AI Analysis: ${result.explanation}`);
  lines.push("");

  if (result.factors.length > 0) {
    lines.push("── CONTRIBUTING RISK FACTORS ───────────────────────");
    result.factors.forEach((f) => {
      lines.push(`  • ${f.name} (+${f.contribution} pts)`);
      lines.push(`    ${f.detail}`);
    });
    lines.push("");
  }

  lines.push("── RECOMMENDATIONS ────────────────────────────────");
  result.recommendations.forEach((r) => {
    lines.push(`  • ${r}`);
  });
  lines.push("");

  lines.push("═══════════════════════════════════════════════════════");
  lines.push("DISCLAIMER: This report is for demonstration purposes");
  lines.push("only and should not be used as a substitute for");
  lines.push("professional medical evaluation.");
  lines.push("═══════════════════════════════════════════════════════");

  return lines.join("\n");
}

function downloadReport(result: RiskResult, data?: AssessmentData) {
  const text = generateReportText(result, data);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const patientName = data?.fullName || data?.patientId || "patient";
  const date = new Date().toISOString().split("T")[0];
  a.download = `risk-assessment-${patientName.replace(/\s+/g, "-").toLowerCase()}-${date}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const RiskResultView = ({ result, onReset, data }: Props) => (
  <div className="space-y-6 animate-fade-up">
    {/* Score header */}
    <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
      <p className="text-sm text-muted-foreground">Overall Risk Score</p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <span className="text-6xl font-bold text-foreground">{result.overallScore}</span>
        <span className="text-2xl text-muted-foreground">/100</span>
      </div>
      <div className="mx-auto mt-4 max-w-xs">
        <Progress value={result.overallScore} className="h-3" />
      </div>
      <Badge className={`mt-4 ${riskColors[result.riskLevel]} text-primary-foreground px-4 py-1`}>
        {result.riskLevel} Risk
      </Badge>
    </div>

    {/* AI Explanation */}
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Risk Analysis</h3>
      </div>
      <p className="text-sm text-muted-foreground">{result.explanation}</p>
    </div>

    {/* Risk Factors */}
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Contributing Risk Factors</h3>
      </div>
      {result.factors.length === 0 ? (
        <p className="text-sm text-muted-foreground">No significant risk factors identified.</p>
      ) : (
        <div className="space-y-4">
          {result.factors.map((f) => (
            <div key={f.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{f.name}</span>
                <span className="text-muted-foreground">+{f.contribution} pts</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(f.contribution * 5, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Recommendations */}
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recommendations</h3>
      </div>
      <ul className="space-y-3">
        {result.recommendations.map((r, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {r}
          </li>
        ))}
      </ul>
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-3">
      <Button onClick={onReset}>
        New Assessment
      </Button>
      <Button variant="outline" className="gap-2" onClick={() => downloadReport(result, data)}>
        <Download className="h-4 w-4" />
        Download Report
      </Button>
    </div>

    {/* Disclaimer */}
    <p className="text-xs text-muted-foreground">
      <strong>Disclaimer:</strong> This risk assessment is for demonstration purposes only. It should not be used as a substitute for professional medical evaluation. All clinical decisions must be made by qualified healthcare professionals.
    </p>
  </div>
);

export default RiskResultView;
