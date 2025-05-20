
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { API_URL } from "@/services/api";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { toast } = useToast();
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to connect to the API when the app starts
    const checkApiConnection = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/health-check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setApiConnected(true);
          toast({
            title: "Connected to API",
            description: "Successfully connected to the backend API.",
          });
        } else {
          setApiConnected(false);
          toast({
            title: "API Connection Failed",
            description: "Could not connect to the backend API. Using mock data.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setApiConnected(false);
        console.error("API connection error:", error);
        toast({
          title: "API Connection Failed",
          description: "Could not connect to the backend API. Using mock data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkApiConnection();
  }, [toast]);

  return (
    <div className="flex h-screen">
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        {loading && (
          <div className="h-1">
            <Progress value={75} indicatorClassName="bg-ats-600" />
          </div>
        )}
        {!loading && !apiConnected && (
          <div className="bg-amber-50 text-amber-800 text-xs px-4 py-1 text-center">
            Using mock data (API not connected)
          </div>
        )}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
