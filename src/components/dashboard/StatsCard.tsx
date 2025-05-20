
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-ats-50 p-1.5 text-ats-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`mt-1 flex items-center text-xs ${
          trend === "up" ? "text-green-600" : 
          trend === "down" ? "text-red-600" : "text-gray-500"
        }`}>
          {change}
          {trend === "up" && <span className="i-lucide-trending-up ml-1" />}
          {trend === "down" && <span className="i-lucide-trending-down ml-1" />}
        </p>
      </CardContent>
    </Card>
  );
}
