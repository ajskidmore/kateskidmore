// Core data types for the application

export interface Profile {
  id: string;
  bio: string;
  photoUrls: string[];
  currentRole?: string;
  education?: string;
  socialLinks: SocialLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  displayName?: string;
  order: number;
}

export type SocialPlatform =
  | 'instagram'
  | 'spotify'
  | 'apple-music'
  | 'linkedin'
  | 'youtube'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | 'bandcamp'
  | 'other';

export interface Music {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  releaseDate: Date;
  projectType: ProjectType;
  streamingLinks: StreamingLink[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectType = 'solo' | 'band' | 'collaboration' | 'other';

export interface StreamingLink {
  platform: StreamingPlatform;
  url: string;
}

export type StreamingPlatform =
  | 'spotify'
  | 'apple-music'
  | 'youtube-music'
  | 'bandcamp'
  | 'soundcloud'
  | 'other';

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  description: string;
  category: VideoCategory;
  createdAt: Date;
  updatedAt: Date;
}

export type VideoCategory =
  | 'performance'
  | 'behind-the-scenes'
  | 'interview'
  | 'rehearsal'
  | 'other';

export interface Event {
  id: string;
  date: Date;
  time?: string;
  venue: string;
  city: string;
  state?: string;
  country?: string;
  eventType: EventType;
  description?: string;
  ticketUrl?: string;
  isPast: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventType =
  | 'concert'
  | 'recital'
  | 'festival'
  | 'workshop'
  | 'masterclass'
  | 'other';

export interface Post {
  id: string;
  title: string;
  content: string;
  featuredImageUrl?: string;
  publishDate: Date;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PostStatus = 'draft' | 'published';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Form input types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface MusicFormData {
  title: string;
  description: string;
  coverImage: File | null;
  releaseDate: string;
  projectType: ProjectType;
  streamingLinks: StreamingLink[];
}

export interface VideoFormData {
  title: string;
  url: string;
  thumbnailUrl?: string;
  description: string;
  category: VideoCategory;
}

export interface EventFormData {
  date: string;
  time?: string;
  venue: string;
  city: string;
  state?: string;
  country?: string;
  eventType: EventType;
  description?: string;
  ticketUrl?: string;
}

export interface PostFormData {
  title: string;
  content: string;
  featuredImage: File | null;
  publishDate: string;
  status: PostStatus;
}

export interface ProfileFormData {
  bio: string;
  currentRole?: string;
  education?: string;
}

export interface SocialLinkFormData {
  platform: SocialPlatform;
  url: string;
  displayName?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Auth types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Theme types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Upload types
export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

export interface ImageUploadOptions {
  folder: string;
  maxSizeMB?: number;
  onProgress?: (progress: number) => void;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and sort types
export interface FilterOptions {
  projectType?: ProjectType;
  category?: VideoCategory;
  eventType?: EventType;
  status?: PostStatus;
  searchQuery?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
