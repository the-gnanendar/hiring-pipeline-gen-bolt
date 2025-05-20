
/**
 * Utility functions for CSV imports and downloads
 */

// Convert array of objects to CSV string
export const objectsToCSV = <T extends Record<string, any>>(items: T[]): string => {
  if (items.length === 0) {
    return '';
  }

  const headers = Object.keys(items[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const item of items) {
    const values = headers.map(header => {
      const value = item[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Create downloadable CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // TypeScript type guard for IE/Edge
  if ('msSaveBlob' in navigator) {
    // For IE and Edge browsers
    (navigator as any).msSaveBlob(blob, filename);
  } else {
    // For other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Export data from Jobs to CSV
export const exportJobsToCSV = (jobs: any[], filename: string = 'jobs_export.csv'): void => {
  // Filter out properties we don't want to export
  const cleanedJobs = jobs.map(job => {
    const { 
      title, department, location, type, status, 
      description, requirements, responsibilities, salary 
    } = job;
    
    return { 
      title, department, location, type, status,
      description: description || '',
      requirements: Array.isArray(requirements) ? requirements.join('; ') : '',
      responsibilities: Array.isArray(responsibilities) ? responsibilities.join('; ') : '',
      salary_min: salary?.min || '',
      salary_max: salary?.max || '',
      salary_currency: salary?.currency || ''
    };
  });
  
  const csv = objectsToCSV(cleanedJobs);
  downloadCSV(csv, filename);
};

// Export data from Candidates to CSV
export const exportCandidatesToCSV = (candidates: any[], filename: string = 'candidates_export.csv'): void => {
  // Filter out properties we don't want to export
  const cleanedCandidates = candidates.map(candidate => {
    const { 
      name, email, position, status, date
    } = candidate;
    
    return { name, email, position, status, applied_date: date };
  });
  
  const csv = objectsToCSV(cleanedCandidates);
  downloadCSV(csv, filename);
};

// Sample candidate data for CSV template
export const sampleCandidatesCSV = (): string => {
  const sampleData = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      position: "Frontend Developer",
      status: "new"
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      position: "UX Designer",
      status: "reviewing"
    }
  ];
  
  return objectsToCSV(sampleData);
};

// Sample job data for CSV template
export const sampleJobsCSV = (): string => {
  const sampleData = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "full-time",
      status: "active",
      description: "We're looking for a talented frontend developer..."
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "New York",
      type: "full-time",
      status: "active",
      description: "Join our design team to create beautiful user experiences..."
    }
  ];
  
  return objectsToCSV(sampleData);
};

// Parse CSV string to array of objects
export const parseCSV = <T>(csvString: string): T[] => {
  const lines = csvString.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());
  const result: T[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(val => val.trim());
    const obj: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    
    result.push(obj as T);
  }
  
  return result;
};
