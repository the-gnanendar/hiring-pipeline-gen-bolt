
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  candidate: {
    name: string;
    image?: string;
    initials: string;
  };
  position: string;
  status: "new" | "reviewing" | "interview" | "offer" | "rejected";
  appliedDate: string;
}

const applications: Application[] = [
  {
    id: "1",
    candidate: {
      name: "Anna Kim",
      initials: "AK"
    },
    position: "UX Designer",
    status: "interview",
    appliedDate: "June 3, 2025"
  },
  {
    id: "2",
    candidate: {
      name: "Robert Johnson",
      initials: "RJ"
    },
    position: "Senior Developer",
    status: "new",
    appliedDate: "June 3, 2025"
  },
  {
    id: "3",
    candidate: {
      name: "Maria Garcia",
      initials: "MG"
    },
    position: "Product Manager",
    status: "reviewing",
    appliedDate: "June 2, 2025"
  },
  {
    id: "4",
    candidate: {
      name: "James Wilson",
      initials: "JW"
    },
    position: "Frontend Developer",
    status: "offer",
    appliedDate: "June 1, 2025"
  },
  {
    id: "5",
    candidate: {
      name: "Li Wei",
      initials: "LW"
    },
    position: "Data Analyst",
    status: "rejected",
    appliedDate: "May 31, 2025"
  }
];

const getStatusColor = (status: Application["status"]) => {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-600 hover:bg-blue-100";
    case "reviewing":
      return "bg-amber-50 text-amber-600 hover:bg-amber-100";
    case "interview":
      return "bg-purple-50 text-purple-600 hover:bg-purple-100";
    case "offer":
      return "bg-green-50 text-green-600 hover:bg-green-100";
    case "rejected":
      return "bg-gray-50 text-gray-600 hover:bg-gray-100";
  }
};

export function RecentApplications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {applications.map((application) => (
            <li key={application.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={application.candidate.image} />
                  <AvatarFallback className="bg-ats-100 text-ats-800">
                    {application.candidate.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{application.candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{application.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="hidden text-gray-500 sm:block">{application.appliedDate}</span>
                <Badge variant="secondary" className={cn(getStatusColor(application.status))}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
