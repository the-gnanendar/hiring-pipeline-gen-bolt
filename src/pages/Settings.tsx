
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Schema for API keys
const apiKeySchema = z.object({
  jobPortalApiKey: z.string().optional(),
  aiApiKey: z.string().optional(),
  zoomApiKey: z.string().optional(),
  teamsApiKey: z.string().optional(),
  googleMeetApiKey: z.string().optional(),
  emailNotificationApiKey: z.string().optional(),
  smsNotificationApiKey: z.string().optional(),
});

type ApiKeyValues = z.infer<typeof apiKeySchema>;

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("job-portals");

  // Initialize form with values from localStorage
  const form = useForm<ApiKeyValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      jobPortalApiKey: localStorage.getItem("jobPortalApiKey") || "",
      aiApiKey: localStorage.getItem("aiApiKey") || "",
      zoomApiKey: localStorage.getItem("zoomApiKey") || "",
      teamsApiKey: localStorage.getItem("teamsApiKey") || "",
      googleMeetApiKey: localStorage.getItem("googleMeetApiKey") || "",
      emailNotificationApiKey: localStorage.getItem("emailNotificationApiKey") || "",
      smsNotificationApiKey: localStorage.getItem("smsNotificationApiKey") || "",
    },
  });

  // Save API keys to localStorage
  const onSubmit = (values: ApiKeyValues) => {
    // Store in localStorage (in a real app, these would be stored securely on the server)
    Object.entries(values).forEach(([key, value]) => {
      if (value) localStorage.setItem(key, value);
    });

    toast({
      title: "Settings saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your API integrations and application settings
          </p>
        </div>

        <Tabs defaultValue="job-portals" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="job-portals">Job Portals</TabsTrigger>
            <TabsTrigger value="ai">AI Services</TabsTrigger>
            <TabsTrigger value="video">Video Conference</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <TabsContent value="job-portals">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Portal APIs</CardTitle>
                    <CardDescription>
                      Connect to job boards and recruitment platforms to post jobs and source candidates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="jobPortalApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Portal API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your API key" />
                          </FormControl>
                          <FormDescription>
                            Used for posting jobs to external job boards and importing candidates
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Services</CardTitle>
                    <CardDescription>
                      Connect to AI services for resume parsing, candidate matching, and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="aiApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your API key" />
                          </FormControl>
                          <FormDescription>
                            Used for resume parsing, candidate matching, and job description generation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Conference APIs</CardTitle>
                    <CardDescription>
                      Connect to video conferencing platforms for interview scheduling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="zoomApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zoom API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your Zoom API key" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="teamsApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Microsoft Teams API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your Microsoft Teams API key" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="googleMeetApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Meet API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your Google Meet API key" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification APIs</CardTitle>
                    <CardDescription>
                      Configure email and SMS notification services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emailNotificationApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Service API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your email service API key" />
                          </FormControl>
                          <FormDescription>
                            Used for sending email notifications to candidates and team members
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smsNotificationApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMS Service API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter your SMS service API key" />
                          </FormControl>
                          <FormDescription>
                            Used for sending SMS notifications to candidates and team members
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <Button type="submit" className="bg-ats-600 hover:bg-ats-700">Save Settings</Button>
            </form>
          </Form>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
