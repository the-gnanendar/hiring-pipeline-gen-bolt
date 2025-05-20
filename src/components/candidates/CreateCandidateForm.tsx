
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Candidate } from "@/types";
import { ResumeProcessor } from "./ResumeProcessor";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type Experience = {
  id: string;
  company: string;
  position: string;
  duration: string;
  description?: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  status: z.enum(["new", "reviewing", "interview", "offer", "rejected"]),
  education: z.string().optional(),
  resume: z.string().optional(),
  skills: z.array(z.string()).optional(),
  skillRatings: z.record(z.number()).optional(),
  overallRating: z.number().min(1).max(5).optional(),
});

interface CreateCandidateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: Omit<Candidate, "id" | "date" | "initials">) => void;
  initialData?: Partial<Candidate>;
  mode?: "create" | "edit";
}

export function CreateCandidateForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "create",
}: CreateCandidateFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    company: "",
    position: "",
    duration: "",
    description: ""
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      position: initialData?.position || "",
      status: initialData?.status || "new",
      education: initialData?.education?.[0] || "",
      resume: initialData?.resume || "",
      skills: [],
      skillRatings: {},
      overallRating: 3,
    },
  });

  // Skills management
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [overallRating, setOverallRating] = useState(3);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Convert education from string to array
      const education = values.education ? [values.education] : undefined;
      
      // In a real app, we would send this to an API
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      if (onSubmit) {
        onSubmit({
          name: values.name,
          email: values.email,
          position: values.position,
          status: values.status,
          phone: values.phone,
          education: education,
          resume: values.resume,
          experience: experiences.length > 0 ? experiences.length : undefined,
        });
      }
      
      toast({
        title: mode === "create" ? "Candidate added" : "Candidate updated",
        description: mode === "create" 
          ? "The candidate has been successfully added." 
          : "The candidate has been successfully updated.",
      });
      
      if (mode === "create") {
        form.reset();
        setExperiences([]);
        setSkills([]);
        setSkillRatings({});
        setOverallRating(3);
        setResumeFile(null);
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while ${mode === "create" ? "adding" : "updating"} the candidate.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type for allowed formats
    if (file.type !== "application/pdf" && 
        file.type !== "application/msword" && 
        file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setIsProcessing(true);

    // Simulate resume parsing (in a real app, we would send the file to an API for processing)
    setTimeout(() => {
      // This would be filled with data from the API response in a real implementation
      const parsedData = {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        education: "Master's in Computer Science, Stanford University",
        position: "Senior Software Engineer",
        experience: [
          {
            id: "1",
            company: "Tech Solutions Inc.",
            position: "Software Engineer",
            duration: "2018-2021",
            description: "Developed full-stack applications using React and Node.js"
          },
          {
            id: "2",
            company: "Innovation Labs",
            position: "Junior Developer",
            duration: "2016-2018",
            description: "Worked on front-end development with HTML, CSS and JavaScript"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"]
      };

      // Populate the form with parsed data
      form.setValue("name", parsedData.name);
      form.setValue("email", parsedData.email);
      form.setValue("phone", parsedData.phone);
      form.setValue("education", parsedData.education);
      form.setValue("position", parsedData.position);
      
      // Set experiences
      setExperiences(parsedData.experience);
      
      // Set skills and default ratings
      setSkills(parsedData.skills);
      const newRatings: Record<string, number> = {};
      parsedData.skills.forEach(skill => {
        newRatings[skill] = 3; // Default rating
      });
      setSkillRatings(newRatings);

      toast({
        title: "Resume parsed successfully",
        description: "The form has been filled with data extracted from the resume.",
      });

      setIsProcessing(false);
    }, 2000);
  };

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillRatings({...skillRatings, [skillInput]: 3}); // Default rating
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
    // Remove rating
    const newRatings = {...skillRatings};
    delete newRatings[skill];
    setSkillRatings(newRatings);
  };

  const handleSkillRatingChange = (skill: string, rating: number) => {
    setSkillRatings({...skillRatings, [skill]: rating});
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position && newExperience.duration) {
      const experience: Experience = {
        id: Date.now().toString(),
        company: newExperience.company,
        position: newExperience.position,
        duration: newExperience.duration,
        description: newExperience.description
      };
      
      setExperiences([...experiences, experience]);
      setNewExperience({
        company: "",
        position: "",
        duration: "",
        description: ""
      });
    } else {
      toast({
        title: "Required fields missing",
        description: "Please fill in company, position, and duration.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "create" ? "Add New Candidate" : "Edit Candidate"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Resume Upload Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <Label htmlFor="resume-upload" className="mb-2">Upload Resume</Label>
                    <div className="flex gap-2 items-center">
                      <Button 
                        variant="outline" 
                        className="w-full relative" 
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        disabled={isProcessing}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {resumeFile ? resumeFile.name : "Upload PDF or Word"}
                        <input
                          id="resume-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleResumeUpload}
                          accept=".pdf,.doc,.docx"
                        />
                      </Button>
                    </div>
                    {isProcessing && (
                      <div className="mt-4 flex items-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Parsing resume...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applied Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor's in Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Experience Section */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Work Experience</h3>
                  
                  {experiences.length > 0 && (
                    <div className="mb-6 space-y-4">
                      {experiences.map((exp, index) => (
                        <div key={exp.id} className="border p-4 rounded-md relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive"
                            onClick={() => handleRemoveExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <div className="space-y-2">
                            <div className="font-medium">{exp.position}</div>
                            <div className="text-sm">{exp.company} | {exp.duration}</div>
                            {exp.description && (
                              <div className="text-muted-foreground text-sm mt-2">{exp.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Add New Experience</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                          placeholder="Company name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={newExperience.position}
                          onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                          placeholder="Job title"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={newExperience.duration}
                          onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                          placeholder="e.g. 2018-2021"
                          className="mt-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                          placeholder="Brief description of responsibilities"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddExperience}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skills & Ratings Section */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Skills & Ratings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor="skill">Add Skill</Label>
                        <Input
                          id="skill"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="e.g. JavaScript, React, UX Design"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {skills.length > 0 && (
                      <div className="space-y-4 mt-4">
                        <Label>Skill Ratings</Label>
                        {skills.map((skill) => (
                          <div key={skill} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge>{skill}</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveSkill(skill)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Button
                                  key={rating}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className={`px-2 ${skillRatings[skill] === rating ? 'bg-primary text-primary-foreground' : ''}`}
                                  onClick={() => handleSkillRatingChange(skill, rating)}
                                >
                                  {rating}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Label>Overall Rating</Label>
                      <div className="flex justify-center mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`px-4 py-2 ${overallRating === rating ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setOverallRating(rating)}
                          >
                            {rating}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Feedback Section */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Interview Feedback</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="technical-feedback">Technical Interview</Label>
                      <Textarea
                        id="technical-feedback"
                        placeholder="Feedback from technical interview round..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="culture-feedback">Cultural Fit</Label>
                      <Textarea
                        id="culture-feedback"
                        placeholder="Feedback about cultural fit..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="final-feedback">Final Round</Label>
                      <Textarea
                        id="final-feedback"
                        placeholder="Feedback from final interview round..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-ats-600 hover:bg-ats-700"
              >
                {isSubmitting 
                  ? (mode === "create" ? "Adding..." : "Updating...") 
                  : (mode === "create" ? "Add Candidate" : "Update Candidate")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
