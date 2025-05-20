import { Job, Candidate, Interview, APPLICATION_STAGES } from "@/types";

// Base API URL - replace with your actual Node.js API endpoint
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user).id : null;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Helper function to create request options with authentication
const createRequestOptions = (method: string, body?: any): RequestInit => {
  const token = getAuthToken();
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    credentials: 'include',
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return options;
};

// Job-related API calls
export const jobsApi = {
  getAll: async (): Promise<Job[]> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/jobs`, options);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Job> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/jobs/${id}`, options);
    return handleResponse(response);
  },
  
  create: async (job: Omit<Job, 'id' | 'applicants' | 'postedDate'>): Promise<Job> => {
    const options = createRequestOptions('POST', job);
    const response = await fetch(`${API_URL}/jobs`, options);
    return handleResponse(response);
  },
  
  update: async (id: string, job: Partial<Job>): Promise<Job> => {
    const options = createRequestOptions('PUT', job);
    const response = await fetch(`${API_URL}/jobs/${id}`, options);
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    const options = createRequestOptions('DELETE');
    const response = await fetch(`${API_URL}/jobs/${id}`, options);
    return handleResponse(response);
  },
  
  bulkImport: async (jobs: Partial<Job>[]): Promise<Job[]> => {
    const options = createRequestOptions('POST', { jobs });
    const response = await fetch(`${API_URL}/jobs/bulk-import`, options);
    return handleResponse(response);
  },
  
  bulkExport: async (jobIds: string[]): Promise<string> => {
    const options = createRequestOptions('POST', { jobIds });
    const response = await fetch(`${API_URL}/jobs/bulk-export`, options);
    return handleResponse(response);
  },
  
  searchJobs: async (query: string): Promise<Job[]> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/jobs/search?q=${encodeURIComponent(query)}`, options);
    return handleResponse(response);
  },
};

// Candidate-related API calls
export const candidatesApi = {
  getAll: async (): Promise<Candidate[]> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/candidates`, options);
    
    // Mock implementation for demo purposes
    const mockCandidates = [
      {
        id: "1",
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        position: "Frontend Developer",
        status: "interview" as const,
        date: "June 3, 2025",
        initials: "AM",
        applicationStage: APPLICATION_STAGES[4] // First Interview
      },
      // ... other candidates
    ];
    
    try {
      return await handleResponse(response);
    } catch (error) {
      console.log("Using mock data for candidates");
      return mockCandidates;
    }
  },
  
  getById: async (id: string): Promise<Candidate> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/candidates/${id}`, options);
    return handleResponse(response);
  },
  
  create: async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
    const options = createRequestOptions('POST', candidate);
    const response = await fetch(`${API_URL}/candidates`, options);
    return handleResponse(response);
  },
  
  update: async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
    const options = createRequestOptions('PUT', candidate);
    const response = await fetch(`${API_URL}/candidates/${id}`, options);
    return handleResponse(response);
  },
  
  bulkImport: async (candidates: Partial<Candidate>[]): Promise<Candidate[]> => {
    const options = createRequestOptions('POST', { candidates });
    const response = await fetch(`${API_URL}/candidates/bulk-import`, options);
    return handleResponse(response);
  },
  
  bulkExport: async (candidateIds: string[]): Promise<string> => {
    const options = createRequestOptions('POST', { candidateIds });
    const response = await fetch(`${API_URL}/candidates/bulk-export`, options);
    return handleResponse(response);
  },
  
  updateStage: async (id: string, stageId: string): Promise<Candidate> => {
    const stage = APPLICATION_STAGES.find(s => s.id === stageId);
    if (!stage) {
      throw new Error('Invalid stage ID');
    }
    
    const options = createRequestOptions('PATCH', { applicationStage: stage });
    const response = await fetch(`${API_URL}/candidates/${id}/stage`, options);
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    const options = createRequestOptions('DELETE');
    const response = await fetch(`${API_URL}/candidates/${id}`, options);
    return handleResponse(response);
  },
};

// Interview-related API calls
export const interviewsApi = {
  getAll: async (): Promise<Interview[]> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/interviews`, options);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Interview> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/interviews/${id}`, options);
    return handleResponse(response);
  },
  
  create: async (interview: Omit<Interview, 'id'>): Promise<Interview> => {
    const options = createRequestOptions('POST', interview);
    const response = await fetch(`${API_URL}/interviews`, options);
    return handleResponse(response);
  },
  
  update: async (id: string, interview: Partial<Interview>): Promise<Interview> => {
    const options = createRequestOptions('PUT', interview);
    const response = await fetch(`${API_URL}/interviews/${id}`, options);
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    const options = createRequestOptions('DELETE');
    const response = await fetch(`${API_URL}/interviews/${id}`, options);
    return handleResponse(response);
  },
};

// Third-party job portal integration API
export const jobPortalsApi = {
  importJobs: async (source: string): Promise<Job[]> => {
    const options = createRequestOptions('POST');
    const response = await fetch(`${API_URL}/job-portals/import?source=${source}`, options);
    return handleResponse(response);
  },
  
  getSources: async (): Promise<string[]> => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/job-portals/sources`, options);
    return handleResponse(response);
  },
  
  exportJobs: async (jobIds: string[], destination: string): Promise<boolean> => {
    const options = createRequestOptions('POST', { jobIds, destination });
    const response = await fetch(`${API_URL}/job-portals/export-jobs`, options);
    return handleResponse(response);
  },
  
  importCandidates: async (source: string): Promise<Candidate[]> => {
    const options = createRequestOptions('POST', { source });
    const response = await fetch(`${API_URL}/job-portals/import-candidates`, options);
    return handleResponse(response);
  },
  
  exportCandidates: async (candidateIds: string[], destination: string): Promise<boolean> => {
    const options = createRequestOptions('POST', { candidateIds, destination });
    const response = await fetch(`${API_URL}/job-portals/export-candidates`, options);
    return handleResponse(response);
  },
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const options = createRequestOptions('POST', { email, password });
    const response = await fetch(`${API_URL}/auth/login`, options);
    return handleResponse(response);
  },
  
  logout: async () => {
    const options = createRequestOptions('POST');
    const response = await fetch(`${API_URL}/auth/logout`, options);
    return handleResponse(response);
  },
  
  getCurrentUser: async () => {
    const options = createRequestOptions('GET');
    const response = await fetch(`${API_URL}/auth/me`, options);
    return handleResponse(response);
  },
};

// AI-related API calls
export const aiApi = {
  processResume: async (resumeText: string): Promise<any> => {
    const options = createRequestOptions('POST', { resumeText });
    const response = await fetch(`${API_URL}/ai/process-resume`, options);
    return handleResponse(response);
  },
  
  generateJobDescription: async (title: string, department?: string): Promise<any> => {
    const options = createRequestOptions('POST', { title, department });
    const response = await fetch(`${API_URL}/ai/generate-job-description`, options);
    return handleResponse(response);
  }
};
