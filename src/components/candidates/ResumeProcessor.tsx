
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { aiApi } from "@/services/api";

interface ResumeProcessorProps {
  onProcessed: (data: any) => void;
}

export function ResumeProcessor({ onProcessed }: ResumeProcessorProps) {
  const [resumeText, setResumeText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  const handleProcessResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume text required",
        description: "Please paste or upload resume text to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const extractedData = await aiApi.processResume(resumeText);
      onProcessed(extractedData);
      toast({
        title: "Resume processed",
        description: "Resume data has been successfully extracted",
      });
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Processing failed",
        description: "Failed to process resume",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type - only allow text files for simplicity
    if (file.type !== "text/plain" && file.type !== "application/pdf" && file.type !== "application/msword") {
      toast({
        title: "Invalid file type",
        description: "Please upload a text, PDF, or Word document",
        variant: "destructive",
      });
      return;
    }

    // For simplicity, we'll just handle text files in this example
    // In a real application, you'd need more complex file parsing
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "File processing",
        description: "For this demo, please paste the resume text directly",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Resume Processor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="resume-upload" className="text-sm font-medium">
            Upload Resume
          </label>
          <div className="flex gap-2 items-center">
            <Button variant="outline" className="w-full relative" onClick={() => document.getElementById('resume-upload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
              <input
                id="resume-upload"
                type="file"
                className="sr-only"
                onChange={handleUpload}
                accept=".txt,.pdf,.doc,.docx"
              />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: For simplicity, this demo only processes .txt files
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="resume-text" className="text-sm font-medium">
            Or paste resume text
          </label>
          <Textarea
            id="resume-text"
            placeholder="Paste resume content here..."
            className="min-h-[200px]"
            value={resumeText}
            onChange={handleTextChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleProcessResume}
          className="w-full bg-ats-600 hover:bg-ats-700"
          disabled={isProcessing || !resumeText.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
            </>
          ) : (
            "Process Resume with AI"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
