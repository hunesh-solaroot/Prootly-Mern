export interface EmployeeProfile {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  email: string;
  contactNumber: string;
  joiningDate: Date;
  profilePicture: string | null;
  performanceScore: number;
  location: string;
  workSchedule: string;
  reportingManager: string;
  teamSize: number;
  projectsCompleted: number;
  gender?: string;
  dateOfBirth?: Date;
  skills?: string[];
  bio?: string;
}

export interface AttendanceData {
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: string;
  checkOut?: string;
}

export interface LeaveRecord {
  id: string;
  type: 'sick' | 'vacation' | 'personal' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
  reason: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
}

export interface PerformanceData {
  month: string;
  score: number;
  goals: number;
  feedback?: string;
}

export interface ProjectInvolvement {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  startDate: Date;
  endDate: Date;
  role: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WorkingHours {
  week: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  efficiency: number;
}

export interface KPIData {
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'certification' | 'award' | 'milestone' | 'training';
  issuer?: string;
  badge?: string;
}

export interface LeaveSummary {
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  casualLeaves: number;
  sickLeaves: number;
  annualLeaves: number;
}