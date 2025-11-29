import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Collection names as constants
export const COLLECTIONS = {
  PROFILE: 'profile',
  MUSIC: 'music',
  VIDEOS: 'videos',
  EVENTS: 'events',
  POSTS: 'posts',
  CONTACT_MESSAGES: 'contactMessages',
  SOCIAL_LINKS: 'socialLinks',
  SETTINGS: 'settings',
} as const;

// Storage folder paths
export const STORAGE_PATHS = {
  PROFILE_PHOTOS: 'profile-photos',
  MUSIC_COVERS: 'music-covers',
  VIDEO_THUMBNAILS: 'video-thumbnails',
  POST_IMAGES: 'post-images',
  GENERAL: 'general-images',
} as const;

export { app, auth, db, storage };
