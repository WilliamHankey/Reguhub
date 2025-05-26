export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  image_url?: string;
  organization_id?: string;
  tasksCount?: number;
  membersCount?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  created_by?: string;
  foldersCount?: number;
  filesCount?: number;
  workers?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  }[];
}

export type ProjectStatus = 'completed' | 'in progress' | 'on hold' | 'not started' | 'planning'; 