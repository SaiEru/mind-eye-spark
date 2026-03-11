import { RiskResult } from "@/types/assessment";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Shield, TrendingUp } from "lucide-react";

type Props = { result: RiskResult; onReset: () => void };

const riskColors: Record<string, string> = {
  Low: "bg-green-500",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-destructive",
};

const RiskResultView = ({ result, onReset }: Props) => (
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
      <button
        onClick={onReset}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        New Assessment
      </button>
      <button className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
        Download Report
      </button>
    </div>

    {/* Disclaimer */}
    <p className="text-xs text-muted-foreground">
      <strong>Disclaimer:</strong> This risk assessment is for demonstration purposes only. It should not be used as a substitute for professional medical evaluation. All clinical decisions must be made by qualified healthcare professionals.
    </p>
  </div>
);

export default RiskResultView;
