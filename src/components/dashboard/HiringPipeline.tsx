
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StageStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const pipelineStats: StageStats[] = [
  {
    name: "New Applications",
    count: 145,
    percentage: 100,
    color: "bg-blue-500"
  },
  {
    name: "Resume Screening",
    count: 98,
    percentage: 67.6,
    color: "bg-cyan-500"
  },
  {
    name: "Phone Interview",
    count: 67,
    percentage: 46.2,
    color: "bg-teal-500"
  },
  {
    name: "Technical Assessment",
    count: 42,
    percentage: 29,
    color: "bg-emerald-500"
  },
  {
    name: "On-site Interview",
    count: 23,
    percentage: 15.9,
    color: "bg-indigo-500"
  },
  {
    name: "Offer Stage",
    count: 12,
    percentage: 8.3,
    color: "bg-violet-500"
  },
  {
    name: "Hired",
    count: 8,
    percentage: 5.5,
    color: "bg-green-500"
  }
];

export function HiringPipeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipelineStats.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <span className="text-muted-foreground">{stage.count}</span>
              </div>
              <Progress value={stage.percentage} className="h-2" indicatorClassName={stage.color} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
