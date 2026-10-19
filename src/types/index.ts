export type Priority = 'Low' | 'Medium' | 'High';
export type TodoStatus = 'Pending' | 'In Progress' | 'Completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority?: Priority;
  category?: string;
  tags?: string[];
  status?: TodoStatus;
  reminder?: string;
  createdAt?: string;
  completedAt?: string;
  subtasks?: SubTask[];
}

export type JobType = 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Freelance' | 'Other';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type JobStatus =
  | 'Saved'
  | 'Applied'
  | 'Application Viewed'
  | 'Shortlisted'
  | 'Recruiter Contacted'
  | 'Assessment'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Technical Round'
  | 'HR Round'
  | 'Next Process'
  | 'Offer Received'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'
  | 'No Response'
  | 'On Hold'
  | 'Other';

export type AppSource =
  | 'LinkedIn'
  | 'Naukri'
  | 'Indeed'
  | 'Company Website'
  | 'Referral'
  | 'Other';

export interface JobTimelineUpdate {
  id: string;
  date?: string;
  status?: JobStatus;
  notes?: string;
  link?: string;
}

export interface JobApplication {
  id: string;
  companyName?: string;
  jobRole?: string;
  jobType?: JobType;
  location?: string;
  workMode?: WorkMode;
  jobLink?: string;
  companyWebsite?: string;
  salary?: string;
  notes?: string;

  dateApplied?: string;
  source?: AppSource;
  resumeVersion?: string;
  coverLetter?: string;
  recruiterName?: string;
  recruiterContact?: string;
  referralName?: string;

  status?: JobStatus;
  timeline?: JobTimelineUpdate[];
}

export interface JobTargets {
  dailyTarget?: number;
  monthlyTarget?: number;
}

export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export interface DailyGoalLog {
  date: string; // YYYY-MM-DD
  completed?: boolean;
  actualValue?: number;
  notes?: string;
  timeSpentMinutes?: number;
  startTime?: string;
  endTime?: string;
}

export interface Goal {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  frequency?: Frequency;
  targetValue?: number;
  unit?: string;
  logs?: Record<string, DailyGoalLog>; // Keyed by YYYY-MM-DD
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillStatus = 'Not Started' | 'Learning' | 'Paused' | 'Completed';

export interface SkillLog {
  id: string;
  date: string; // YYYY-MM-DD
  hours?: number;
  minutes?: number;
  topicLearned?: string;
  notes?: string;
  resourceLink?: string;
}

export interface Skill {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  priority?: Priority;
  startDate?: string;
  targetDate?: string;
  currentLevel?: SkillLevel;
  targetLevel?: SkillLevel;
  learningResources?: string;
  notes?: string;
  status?: SkillStatus;
  dailyTargetHours?: number; // Integration with consistency system
  logs?: SkillLog[];
}

export interface SettingsState {
  theme: 'dark' | 'light';
  defaultTodoView: 'list' | 'compact';
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
}

export interface AppData {
  todos: Todo[];
  jobApplications: JobApplication[];
  jobTargets: JobTargets;
  goals: Goal[];
  skills: Skill[];
  settings: SettingsState;
}
