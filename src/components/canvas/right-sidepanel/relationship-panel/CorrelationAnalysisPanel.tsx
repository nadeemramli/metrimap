import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3,
  Calculator,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Target,
  Zap,
  Info,
} from "lucide-react";
import { useWorker } from "@/lib/hooks/useWorker";
import type { MetricCard } from "@/lib/types";

interface CorrelationAnalysisPanelProps {
  sourceCard: MetricCard;
  targetCard: MetricCard;
}

export default function CorrelationAnalysisPanel({
  sourceCard,
  targetCard,
}: CorrelationAnalysisPanelProps) {
  const { analyzeCorrelation, isLoading } = useWorker();
  const [analysis, setAnalysis] = useState<{
    correlation: number;
    pValue: number;
    confidenceInterval: [number, number];
    sampleSize: number;
    isSignificant: boolean;
    effectSize: "small" | "medium" | "large";
    powerAnalysis: {
      power: number;
      requiredSampleSize: number;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setError(null);
    setAnalysis(null);

    // Extract numeric data from metric cards
    const sourceData =
      sourceCard.data
        ?.map((d) => d.value)
        .filter((v) => typeof v === "number") || [];
    const targetData =
      targetCard.data
        ?.map((d) => d.value)
        .filter((v) => typeof v === "number") || [];

    if (sourceData.length < 3 || targetData.length < 3) {
      setError(
        "Need at least 3 data points in each metric to perform correlation analysis"
      );
      return;
    }

    if (sourceData.length !== targetData.length) {
      setError(
        "Metrics must have the same number of data points for correlation analysis"
      );
      return;
    }

    try {
      const result = await analyzeCorrelation(sourceData, targetData);
      if (result) {
        setAnalysis(result);
      } else {
        setError("Failed to calculate correlation analysis");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    }
  };

  const getCorrelationStrengthLabel = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return "Strong";
    if (abs >= 0.5) return "Moderate";
    if (abs >= 0.3) return "Weak";
    return "Very Weak";
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return "text-green-600 bg-green-50 border-green-200";
    if (abs >= 0.5) return "text-blue-600 bg-blue-50 border-blue-200";
    if (abs >= 0.3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getSignificanceIcon = (isSignificant: boolean) => {
    return isSignificant ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getEffectSizeColor = (effectSize: string) => {
    switch (effectSize) {
      case "large":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-blue-600 bg-blue-50";
      case "small":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Statistical Correlation Analysis
        </CardTitle>
        <CardDescription>
          Analyze the statistical relationship between {sourceCard.title} and{" "}
          {targetCard.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Run Analysis Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Available data points: {sourceCard.data?.length || 0} vs{" "}
            {targetCard.data?.length || 0}
          </div>
          <Button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="gap-2"
          >
            <Calculator className="h-4 w-4" />
            {isLoading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4">
            {/* Correlation Coefficient */}
            <Card
              className={`border ${getCorrelationColor(analysis.correlation)}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Correlation Coefficient</span>
                  <Badge className={getCorrelationColor(analysis.correlation)}>
                    {getCorrelationStrengthLabel(analysis.correlation)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  r = {analysis.correlation.toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {analysis.correlation > 0 ? "Positive" : "Negative"}{" "}
                  correlation
                </div>
              </CardContent>
            </Card>

            {/* Statistical Significance */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getSignificanceIcon(analysis.isSignificant)}
                    Statistical Significance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    p = {analysis.pValue.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analysis.isSignificant
                      ? "Statistically significant"
                      : "Not significant"}{" "}
                    (α = 0.05)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Effect Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={`${getEffectSizeColor(analysis.effectSize)} text-sm mb-2`}
                  >
                    {analysis.effectSize.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Cohen's conventions
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Confidence Interval */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  95% Confidence Interval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold mb-2">
                  [{analysis.confidenceInterval[0].toFixed(4)},{" "}
                  {analysis.confidenceInterval[1].toFixed(4)}]
                </div>
                <div className="text-sm text-muted-foreground">
                  95% confident the true correlation is within this range
                </div>
              </CardContent>
            </Card>

            {/* Power Analysis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Power Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current Power:
                  </span>
                  <Badge
                    variant={
                      analysis.powerAnalysis.power >= 0.8
                        ? "default"
                        : "secondary"
                    }
                  >
                    {(analysis.powerAnalysis.power * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Sample Size:
                  </span>
                  <span className="font-medium">{analysis.sampleSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Required for 80% Power:
                  </span>
                  <span className="font-medium">
                    {analysis.powerAnalysis.requiredSampleSize}
                  </span>
                </div>

                {analysis.powerAnalysis.power < 0.8 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Consider collecting more data points to increase
                      statistical power. Current power (
                      {(analysis.powerAnalysis.power * 100).toFixed(1)}%) is
                      below the recommended 80%.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Interpretation */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
                  <Info className="h-4 w-4" />
                  Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Relationship Strength:</strong> The correlation of{" "}
                  {analysis.correlation.toFixed(3)} indicates a{" "}
                  {getCorrelationStrengthLabel(
                    analysis.correlation
                  ).toLowerCase()}{" "}
                  {analysis.correlation > 0 ? "positive" : "negative"}{" "}
                  relationship.
                </p>
                <p>
                  <strong>Statistical Evidence:</strong>{" "}
                  {analysis.isSignificant
                    ? `With p = ${analysis.pValue.toFixed(4)}, there is strong statistical evidence for this relationship.`
                    : `With p = ${analysis.pValue.toFixed(4)}, there is insufficient statistical evidence for this relationship.`}
                </p>
                <p>
                  <strong>Practical Significance:</strong> The{" "}
                  {analysis.effectSize} effect size suggests this relationship
                  has{" "}
                  {analysis.effectSize === "large"
                    ? "substantial practical importance"
                    : analysis.effectSize === "medium"
                      ? "moderate practical importance"
                      : "limited practical importance"}
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
