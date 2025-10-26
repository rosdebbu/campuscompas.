// FIX: Import React to make the React namespace available for type definitions like React.FC.
import type React from 'react';

export interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  imageUrl: string;
  reviewCount: number;
}

export interface Hostel {
  name:string;
  floorData: Record<string, string[]>; // Key: "Floor 1", Value: ["101", "102", ...]
}

// Keep existing type definitions for other components
export interface NavItem {
  id: number;
  label: string;
  icon: React.FC;
}

export interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  isFeatured?: boolean; // For special items like the Auditorium
  featuredText?: string;
  buildingDetails?: {
    floorCount: number;
    floorData: Record<string, string[]>; // e.g., { "Floor 1": ["Teacher A", "Teacher B"] }
    otherInfo?: { // For extra details like list of hostels
      title: string;
      items: Hostel[];
    }
  };
}


export interface NewsArticle {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  author?: string;
  date: string;
  imageUrl: string;
  excerpt: string;
}

// --- NEW TYPES ---
export interface LostItem {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    status: 'Lost' | 'Found' | 'Claimed';
    date: string;
    location: string;
}

export interface NotificationItem {
    id: number;
    type: 'alert' | 'event' | 'news';
    title: string;
    timestamp: string;
}

export interface Course {
  id: string;
  name: string;
  color: {
    background: string;
    text: string;
    border: string;
  };
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: string; // YYYY-MM-DD
}

export interface StudyBlock {
  id: string;
  courseId: string;
  title: string; // For the specific topic
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface StudyGoal {
  type: 'weeklyHours';
  target: number;
}

export interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    url: string;
}

export interface ProjectTask {
    id: number;
    text: string;
    completed: boolean;
}

export interface GitHubUser {
    login: string;
    avatar_url: string;
    html_url: string;
}

export interface OpenSourceIssue {
    id: number;
    repoName: string;
    repoUrl: string;
    title: string;
    url: string;
    language: 'Python' | 'JavaScript' | 'TypeScript' | 'Go' | 'Rust';
    labels: { name: string; color: string }[];
}

export interface PortfolioProject extends GitHubRepo {
    whatILearned?: string;
    challenges?: string;
    course?: string;
    techStack?: string[];
}

export interface GitHubStats {
    totalContributions: number;
    longestStreak: number;
    mostUsedLanguage: string;
}

export interface Gig {
    id: number;
    title: string;
    client: string;
    description: string;
    skills: string[];
    budget: number;
    postedDate: string;
}

export interface TechArticle {
    id: number;
    title: string;
    author: {
        name: string;
        avatarUrl: string;
    };
    date: string;
    content: string;
    tags: string[];
    claps: number;
    repoUrl?: string;
    imageUrl: string;
}

export interface VirtualMachine {
    id: string;
    name: string;
    type: string;
    os: string;
    status: 'off' | 'pending' | 'running' | 'error';
    ipAddress: string | null;
}

export interface CloudDatabase {
    id: string;
    name: string;
    engine: 'MySQL' | 'PostgreSQL' | 'DynamoDB';
    status: 'off' | 'provisioning' | 'available' | 'error';
    endpoint: string | null;
}

export interface ServerlessFunction {
    id: string;
    name: string;
    runtime: 'Python 3.9';
    code: string;
    status: 'off' | 'deploying' | 'deployed' | 'error';
    lastLog: string | null;
}

// FIX: Export missing type `PipelineStage` for DevOpsPlayground.
export interface PipelineStage {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'success' | 'failure';
    log: string;
}

// FIX: Export missing types for PersonalGrowthDashboard
export interface SkillData {
  skill: string;
  level: number;
}

export interface ProjectVelocityData {
  month: string;
  projects: number;
}

export interface CommunityImpactStats {
  mentees: number;
  doubtsAnswered: number;
  articleClaps: number;
}

// --- Internship Board Types ---
export interface InsiderReview {
    reviewer: string; // e.g., 'SRMIST Senior, CSE'
    year: number;
    rating: 5 | 4 | 3 | 2 | 1;
    review: string;
    interviewTips: string;
}

export interface InternshipListing {
    id: number;
    title: string;
    company: string;
    logoUrl: string;
    location: string;
    stipend: string;
    type: 'Internship' | 'Co-op';
    description: string;
    requirements: string[];
    reviews: InsiderReview[];
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer';

export interface TrackedApplication {
    id: number;
    listing: InternshipListing;
    status: ApplicationStatus;
}

// --- Weekend Project Generator Types ---
export interface WeekendProject {
    id: string;
    mission: string;
    requirements: string[];
    techStack: string[];
    stretchGoal: string;
}

// --- Algorithm Performance Lab Types ---
export interface BenchmarkResult {
    datasetSize: string;
    solutionA: {
        time: number | 'Timed Out';
        memory: string;
    };
    solutionB: {
        time: number;
        memory: string;
    };
}

// --- Open Source Apprenticeship Types ---
export interface ApprenticeshipIssue {
    id: number;
    title: string;
    labels: { name: string; color: string }[];
}

export interface ApprenticeshipTask {
    stage: string;
    title: string;
    description: string;
    relatedIssueId?: number;
}