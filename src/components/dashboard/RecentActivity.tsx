
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, MessageSquare, Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "message" | "interview" | "application" | "hired" | "document";

interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  person: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "message",
    content: "Left a comment on John Doe's application",
    person: "Sarah Taylor",
    time: "2 hours ago"
  },
  {
    id: "2",
    type: "interview",
    content: "Scheduled an interview with Emily Johnson",
    person: "Michael Rogers",
    time: "3 hours ago"
  },
  {
    id: "3",
    type: "application",
    content: "Submitted application for Senior Developer",
    person: "David Chen",
    time: "5 hours ago"
  },
  {
    id: "4",
    type: "hired",
    content: "Hired as Junior Marketing Specialist",
    person: "Amanda Lee",
    time: "1 day ago"
  },
  {
    id: "5",
    type: "document",
    content: "Uploaded resume and cover letter",
    person: "Robert Smith",
    time: "1 day ago"
  }
];

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "message":
      return <MessageSquare className="h-5 w-5" />;
    case "interview":
      return <Calendar className="h-5 w-5" />;
    case "application":
      return <User className="h-5 w-5" />;
    case "hired":
      return <CheckCircle className="h-5 w-5" />;
    case "document":
      return <Upload className="h-5 w-5" />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "message":
      return "bg-blue-100 text-blue-600";
    case "interview":
      return "bg-purple-100 text-purple-600";
    case "application":
      return "bg-amber-100 text-amber-600";
    case "hired":
      return "bg-green-100 text-green-600";
    case "document":
      return "bg-slate-100 text-slate-600";
  }
};

export function RecentActivity() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto">
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start gap-4">
              <div className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-full", getActivityColor(activity.type))}>
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{activity.person}</p>
                <p className="text-sm text-muted-foreground">{activity.content}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
