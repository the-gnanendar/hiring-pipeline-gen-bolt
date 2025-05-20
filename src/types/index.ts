
// Types for the entire application

// User Roles
export type Role = 'admin' | 'recruiter' | 'hiring_manager' | 'viewer';

// Permission Types
export type ActionType = 'create' | 'read' | 'update' | 'delete';
export type SubjectType = 'users' | 'roles' | 'candidates' | 'jobs' | 'interviews' | 'reports' | 'pipeline_levels' | 'settings';

export interface Permission {
  action: ActionType;
  subject: SubjectType;
}

// User Type
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
  permissions?: Permission[];
}

// Job Type
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'draft' | 'active' | 'paused' | 'closed';
  applicants: number;
  postedDate: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  pipelineLevels?: PipelineLevel[];
}

// Pipeline Level Type
export interface PipelineLevel {
  id: string;
  name: string;
  description?: string;
  order: number;
  jobId: string;
  assignedUsers?: string[];
}

// Candidate Application Stage
export interface ApplicationStage {
  id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
}

// Default Application Stages
export const APPLICATION_STAGES: ApplicationStage[] = [
  {
    id: 'new',
    name: 'New',
    description: 'Candidate has just applied',
    color: 'blue',
    order: 1
  },
  {
    id: 'screening',
    name: 'Resume Screening',
    description: 'Resume being reviewed',
    color: 'purple',
    order: 2
  },
  {
    id: 'phone_screen',
    name: 'Phone Screen',
    description: 'Initial phone screening',
    color: 'orange',
    order: 3
  },
  {
    id: 'assessment',
    name: 'Assessment',
    description: 'Technical or skill assessment',
    color: 'yellow',
    order: 4
  },
  {
    id: 'interview',
    name: 'First Interview',
    description: 'First round interview',
    color: 'green',
    order: 5
  },
  {
    id: 'second_interview',
    name: 'Second Interview',
    description: 'Second round interview',
    color: 'cyan',
    order: 6
  },
  {
    id: 'final_interview',
    name: 'Final Interview',
    description: 'Final interview round',
    color: 'indigo',
    order: 7
  },
  {
    id: 'offer',
    name: 'Offer',
    description: 'Offer extended',
    color: 'pink',
    order: 8
  },
  {
    id: 'hired',
    name: 'Hired',
    description: 'Candidate accepted offer',
    color: 'green',
    order: 9
  },
  {
    id: 'rejected',
    name: 'Rejected',
    description: 'Candidate was rejected',
    color: 'red',
    order: 10
  }
];

// Candidate Experience
export interface CandidateExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

// Candidate Skill Rating
export interface SkillRating {
  id: string;
  skill: string;
  rating: number; // 1-5
}

// Interview Feedback
export interface InterviewFeedback {
  id: string;
  interviewerId: string;
  interviewerName: string;
  candidateId: string;
  jobId: string;
  pipelineLevelId: string;
  date: string;
  overallRating: number; // 1-5
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no';
  skillRatings?: SkillRating[];
}

// Candidate Type
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  date: string;
  initials: string;
  resumeUrl?: string;
  applicationStage?: ApplicationStage;
  jobId?: string;
  experiences?: CandidateExperience[];
  skills?: SkillRating[];
  feedback?: InterviewFeedback[];
  overallRating?: number; // 1-5, averaged from feedback
}

// Interview Type
export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'in-person' | 'phone' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: InterviewFeedback;
}

// Workflow step
export interface WorkflowStep {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

// Recruitment workflow 
export interface RecruitmentWorkflow {
  jobId: string;
  jobTitle: string;
  totalCandidates: number;
  steps: WorkflowStep[];
}

// API Key Settings
export interface ApiKeySettings {
  jobPortalApiKey?: string;
  aiApiKey?: string;
  zoomApiKey?: string;
  teamsApiKey?: string;
  googleMeetApiKey?: string;
  emailNotificationApiKey?: string;
  smsNotificationApiKey?: string;
}
