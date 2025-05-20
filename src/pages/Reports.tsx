
import { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";

const Reports = () => {
  const reportCategories = [
    {
      id: "recruiting",
      title: "Recruiting Reports",
      description: "Track recruiting pipeline metrics and hiring velocity",
      icon: <BarChart className="h-12 w-12 text-blue-500" />,
      count: 8,
      reports: [
        "Time to Hire",
        "Source Effectiveness",
        "Recruiting Activity",
        "Recruiter Performance",
        "Interview Process",
        "Hiring Manager Activity",
        "Job Fill Rate",
        "Offer Acceptance Rate"
      ]
    },
    {
      id: "candidates",
      title: "Candidate Reports",
      description: "Analyze candidate pool and diversity metrics",
      icon: <PieChart className="h-12 w-12 text-green-500" />,
      count: 6,
      reports: [
        "Candidate Pipeline",
        "Candidate Evaluation",
        "Candidate Demographics",
        "Candidate Experience",
        "Candidate Rejection Reasons",
        "Candidate Sources"
      ]
    },
    {
      id: "compliance",
      title: "Compliance Reports",
      description: "Generate compliance reports for regulatory requirements",
      icon: <LineChart className="h-12 w-12 text-amber-500" />,
      count: 4,
      reports: [
        "EEO-1",
        "OFCCP",
        "Diversity Reporting",
        "Compliance Summary"
      ]
    }
  ];

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Access key metrics and analytics about your recruitment process
          </p>
        </div>

        <Tabs defaultValue="home">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>
          
          {/* Home Tab - Report Categories */}
          <TabsContent value="home" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportCategories.map((category) => (
                <Card key={category.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2">{category.icon}</div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-2xl font-bold">{category.count} Reports</div>
                    <ul className="mt-2 space-y-1">
                      {category.reports.slice(0, 3).map((report, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {report}</li>
                      ))}
                      {category.reports.length > 3 && (
                        <li className="text-sm text-muted-foreground">• And {category.reports.length - 3} more...</li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <button className="text-sm text-blue-600 hover:underline">
                      View All {category.title}
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Recent Reports</h2>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Report Name</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Last Run</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-4">Time to Hire Report</td>
                        <td className="p-4">Recruiting</td>
                        <td className="p-4">Today</td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:underline text-sm">View</button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-4">Source Effectiveness</td>
                        <td className="p-4">Recruiting</td>
                        <td className="p-4">Yesterday</td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:underline text-sm">View</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-4">Candidate Pipeline</td>
                        <td className="p-4">Candidates</td>
                        <td className="p-4">3 days ago</td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:underline text-sm">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Recruiting Reports Tab */}
          <TabsContent value="recruiting" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recruiting Reports</CardTitle>
                <CardDescription>
                  Track your recruiting funnel metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportCategories[0].reports.map((report, index) => (
                    <Card key={index} className="hover:bg-muted/50 cursor-pointer">
                      <CardHeader className="py-4 px-5">
                        <CardTitle className="text-base">{report}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Candidate Reports Tab */}
          <TabsContent value="candidates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Reports</CardTitle>
                <CardDescription>
                  Analyze candidate data and track candidate pipeline metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportCategories[1].reports.map((report, index) => (
                    <Card key={index} className="hover:bg-muted/50 cursor-pointer">
                      <CardHeader className="py-4 px-5">
                        <CardTitle className="text-base">{report}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
