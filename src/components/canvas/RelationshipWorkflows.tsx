import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  Zap,
  TrendingUp,
  BarChart3,
  Layers,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Calculator,
  FlaskConical,
  Target,
  Puzzle,
} from "lucide-react";
import type { RelationshipType, ConfidenceLevel, EvidenceItem } from "@/lib/types";

interface RelationshipWorkflowProps {
  type: RelationshipType;
  onConfidenceChange: (confidence: ConfidenceLevel) => void;
  onEvidenceAdd: (evidence: EvidenceItem) => void;
  currentEvidence: EvidenceItem[];
}

// Workflow templates for each relationship type
const getWorkflowConfig = (type: RelationshipType) => {
  switch (type) {
    case "Deterministic":
      return {
        icon: Zap,
        color: "text-blue-600",
        title: "Deterministic Relationship",
        description: "Direct causal relationships with predictable outcomes",
        requirements: [
          "Mathematical formula or logical rule",
          "100% predictable outcomes",
          "No external variables affect the relationship",
        ],
        evidenceTypes: ["Mathematical Proof", "Logical Analysis", "System Documentation"],
        validationSteps: [
          "Verify mathematical relationship",
          "Test edge cases",
          "Confirm no exceptions",
        ],
        confidenceMapping: {
          "High": "Formula proven and tested",
          "Medium": "Formula exists but edge cases unverified", 
          "Low": "Theoretical relationship only",
        },
        template: {
          formula: "",
          inputRange: "",
          outputRange: "",
          constraints: "",
        },
      };
    case "Probabilistic":
      return {
        icon: TrendingUp,
        color: "text-green-600",
        title: "Probabilistic Relationship",
        description: "Statistical correlation with probabilistic outcomes",
        requirements: [
          "Statistical correlation coefficient",
          "Sample size and time period",
          "Confidence intervals",
        ],
        evidenceTypes: ["Statistical Analysis", "Data Study", "Correlation Report"],
        validationSteps: [
          "Calculate correlation coefficient",
          "Verify sample size adequacy",
          "Check for confounding variables",
        ],
        confidenceMapping: {
          "High": "r > 0.7, n > 100, p < 0.001",
          "Medium": "r > 0.5, n > 50, p < 0.05",
          "Low": "r > 0.3 or insufficient data",
        },
        template: {
          correlationCoefficient: "",
          sampleSize: "",
          pValue: "",
          confidenceInterval: "",
          timeframe: "",
        },
      };
    case "Causal":
      return {
        icon: BarChart3,
        color: "text-yellow-600",
        title: "Causal Relationship",
        description: "Proven causal influence through experimentation",
        requirements: [
          "Controlled experiment design",
          "Treatment and control groups",
          "Temporal precedence established",
        ],
        evidenceTypes: ["A/B Test", "Randomized Experiment", "Natural Experiment"],
        validationSteps: [
          "Design controlled experiment",
          "Establish temporal order",
          "Rule out alternative explanations",
        ],
        confidenceMapping: {
          "High": "Randomized controlled trial with significant results",
          "Medium": "Quasi-experimental design with controls",
          "Low": "Observational evidence only",
        },
        template: {
          experimentType: "",
          treatmentGroup: "",
          controlGroup: "",
          effectSize: "",
          pValue: "",
          duration: "",
        },
      };
    case "Compositional":
      return {
        icon: Layers,
        color: "text-purple-600",
        title: "Compositional Relationship",
        description: "Part-of or hierarchical relationship",
        requirements: [
          "Clear hierarchy or composition structure",
          "Part-whole relationship defined",
          "Aggregation or decomposition rules",
        ],
        evidenceTypes: ["System Architecture", "Business Process", "Organizational Chart"],
        validationSteps: [
          "Define composition rules",
          "Verify aggregation logic",
          "Confirm hierarchical structure",
        ],
        confidenceMapping: {
          "High": "Formal definition with clear aggregation rules",
          "Medium": "Logical composition with some ambiguity",
          "Low": "Assumed relationship without formal definition",
        },
        template: {
          compositionType: "",
          aggregationRule: "",
          parentMetric: "",
          childMetrics: "",
          weight: "",
        },
      };
    default:
      return null;
  }
};

export default function RelationshipWorkflows({ 
  type, 
  onConfidenceChange, 
  onEvidenceAdd,
  currentEvidence 
}: RelationshipWorkflowProps) {
  const config = getWorkflowConfig(type);
  const [workflowData, setWorkflowData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);

  if (!config) return null;

  const Icon = config.icon;

  const handleTemplateChange = (field: string, value: string) => {
    setWorkflowData((prev: any) => ({ ...prev, [field]: value }));
  };

  const validateAndSuggestConfidence = useCallback(() => {
    // Auto-suggest confidence based on workflow completion
    let suggestedConfidence: ConfidenceLevel = "Low";

    switch (type) {
      case "Deterministic":
        if (workflowData.formula && workflowData.constraints) {
          suggestedConfidence = "High";
        } else if (workflowData.formula) {
          suggestedConfidence = "Medium";
        }
        break;
      case "Probabilistic":
        const r = parseFloat(workflowData.correlationCoefficient);
        const n = parseInt(workflowData.sampleSize);
        const p = parseFloat(workflowData.pValue);
        
        if (r > 0.7 && n > 100 && p < 0.001) {
          suggestedConfidence = "High";
        } else if (r > 0.5 && n > 50 && p < 0.05) {
          suggestedConfidence = "Medium";
        }
        break;
      case "Causal":
        if (workflowData.experimentType === "RCT" && workflowData.pValue && parseFloat(workflowData.pValue) < 0.05) {
          suggestedConfidence = "High";
        } else if (workflowData.experimentType && workflowData.controlGroup) {
          suggestedConfidence = "Medium";
        }
        break;
      case "Compositional":
        if (workflowData.aggregationRule && workflowData.childMetrics) {
          suggestedConfidence = "High";
        } else if (workflowData.compositionType) {
          suggestedConfidence = "Medium";
        }
        break;
    }

    onConfidenceChange(suggestedConfidence);
  }, [type, workflowData, onConfidenceChange]);

  const generateTemplateEvidence = () => {
    const evidence: EvidenceItem = {
      id: `evidence_${Date.now()}`,
      title: `${config.title} Validation`,
      type: config.evidenceTypes[0] as any,
      date: new Date().toISOString().split('T')[0],
      owner: "System Generated",
      summary: JSON.stringify(workflowData, null, 2),
      link: "",
      hypothesis: `This ${type.toLowerCase()} relationship follows the standard workflow template`,
      impactOnConfidence: "Validates relationship according to type-specific requirements",
    };

    onEvidenceAdd(evidence);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${config.color}`}>
            <Icon className="h-5 w-5" />
            {config.title}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Workflow Requirements</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {config.requirements.map((req, index) => (
                  <li key={index} className="text-sm">{req}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Type-Specific Template */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship Template</CardTitle>
          <CardDescription>
            Fill out the template to validate this {type.toLowerCase()} relationship
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {type === "Deterministic" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Mathematical Formula</label>
                <Input
                  value={workflowData.formula || ""}
                  onChange={(e) => handleTemplateChange("formula", e.target.value)}
                  placeholder="Y = f(X), e.g., Revenue = Price × Quantity"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Input Range</label>
                  <Input
                    value={workflowData.inputRange || ""}
                    onChange={(e) => handleTemplateChange("inputRange", e.target.value)}
                    placeholder="e.g., X > 0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Output Range</label>
                  <Input
                    value={workflowData.outputRange || ""}
                    onChange={(e) => handleTemplateChange("outputRange", e.target.value)}
                    placeholder="e.g., Y ≥ 0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Constraints & Assumptions</label>
                <Textarea
                  value={workflowData.constraints || ""}
                  onChange={(e) => handleTemplateChange("constraints", e.target.value)}
                  placeholder="List any constraints or assumptions"
                  rows={3}
                />
              </div>
            </>
          )}

          {type === "Probabilistic" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Correlation Coefficient (r)</label>
                  <Input
                    type="number"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={workflowData.correlationCoefficient || ""}
                    onChange={(e) => handleTemplateChange("correlationCoefficient", e.target.value)}
                    placeholder="0.75"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sample Size (n)</label>
                  <Input
                    type="number"
                    value={workflowData.sampleSize || ""}
                    onChange={(e) => handleTemplateChange("sampleSize", e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">P-Value</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    value={workflowData.pValue || ""}
                    onChange={(e) => handleTemplateChange("pValue", e.target.value)}
                    placeholder="0.001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Confidence Interval</label>
                  <Input
                    value={workflowData.confidenceInterval || ""}
                    onChange={(e) => handleTemplateChange("confidenceInterval", e.target.value)}
                    placeholder="95% CI: [0.65, 0.85]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Analysis Timeframe</label>
                  <Input
                    value={workflowData.timeframe || ""}
                    onChange={(e) => handleTemplateChange("timeframe", e.target.value)}
                    placeholder="Q1 2024 - Q4 2024"
                  />
                </div>
              </div>
            </>
          )}

          {type === "Causal" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Experiment Type</label>
                <Select
                  value={workflowData.experimentType || ""}
                  onValueChange={(value) => handleTemplateChange("experimentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experiment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RCT">Randomized Controlled Trial (RCT)</SelectItem>
                    <SelectItem value="Natural">Natural Experiment</SelectItem>
                    <SelectItem value="QuasiExp">Quasi-Experimental</SelectItem>
                    <SelectItem value="ABTest">A/B Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Treatment Group</label>
                  <Input
                    value={workflowData.treatmentGroup || ""}
                    onChange={(e) => handleTemplateChange("treatmentGroup", e.target.value)}
                    placeholder="Users with feature enabled"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Control Group</label>
                  <Input
                    value={workflowData.controlGroup || ""}
                    onChange={(e) => handleTemplateChange("controlGroup", e.target.value)}
                    placeholder="Users without feature"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Effect Size</label>
                  <Input
                    value={workflowData.effectSize || ""}
                    onChange={(e) => handleTemplateChange("effectSize", e.target.value)}
                    placeholder="15% improvement"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">P-Value</label>
                  <Input
                    type="number"
                    value={workflowData.pValue || ""}
                    onChange={(e) => handleTemplateChange("pValue", e.target.value)}
                    placeholder="0.02"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Input
                    value={workflowData.duration || ""}
                    onChange={(e) => handleTemplateChange("duration", e.target.value)}
                    placeholder="4 weeks"
                  />
                </div>
              </div>
            </>
          )}

          {type === "Compositional" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Composition Type</label>
                <Select
                  value={workflowData.compositionType || ""}
                  onValueChange={(value) => handleTemplateChange("compositionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select composition type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sum">Sum Aggregation</SelectItem>
                    <SelectItem value="Average">Average Aggregation</SelectItem>
                    <SelectItem value="WeightedSum">Weighted Sum</SelectItem>
                    <SelectItem value="Hierarchy">Hierarchical Structure</SelectItem>
                    <SelectItem value="Custom">Custom Aggregation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Aggregation Rule</label>
                <Input
                  value={workflowData.aggregationRule || ""}
                  onChange={(e) => handleTemplateChange("aggregationRule", e.target.value)}
                  placeholder="Parent = Sum(Children) or Parent = Weighted_Average(Children, Weights)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Parent Metric</label>
                  <Input
                    value={workflowData.parentMetric || ""}
                    onChange={(e) => handleTemplateChange("parentMetric", e.target.value)}
                    placeholder="Total Revenue"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Child Metrics</label>
                  <Input
                    value={workflowData.childMetrics || ""}
                    onChange={(e) => handleTemplateChange("childMetrics", e.target.value)}
                    placeholder="Product A Revenue, Product B Revenue"
                  />
                </div>
              </div>
              {workflowData.compositionType === "WeightedSum" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Weights</label>
                  <Input
                    value={workflowData.weight || ""}
                    onChange={(e) => handleTemplateChange("weight", e.target.value)}
                    placeholder="0.6, 0.4 (must sum to 1.0)"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Validation Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Checklist</CardTitle>
          <CardDescription>Complete these steps to ensure relationship validity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {config.validationSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confidence Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Confidence Guidelines</CardTitle>
          <CardDescription>Use these criteria to determine confidence level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(config.confidenceMapping).map(([level, criteria]) => (
              <div key={level} className="flex items-start gap-3">
                <Badge 
                  variant={level === "High" ? "default" : level === "Medium" ? "secondary" : "outline"}
                  className="mt-0.5"
                >
                  {level}
                </Badge>
                <span className="text-sm">{criteria}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={validateAndSuggestConfidence} variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Auto-Validate Confidence
        </Button>
        <Button onClick={generateTemplateEvidence} className="gap-2">
          <FlaskConical className="h-4 w-4" />
          Generate Evidence
        </Button>
      </div>
    </div>
  );
}