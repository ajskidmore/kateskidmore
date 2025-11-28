# Maria Skidmore - Violinist, Pianist & Music Director Portfolio

A modern, elegant portfolio website built with React, Vite, Firebase, and TailwindCSS. Features a public-facing website showcasing musical work and performances, plus a comprehensive admin dashboard for content management.

🌐 **Live Site**: [https://mariaskidmore-6c8be.web.app](https://mariaskidmore-6c8be.web.app)

## ✨ Features

### Public Website
- **Home/Hero Page**: Elegant landing page with animated welcome section
- **About Page**: Biography and professional information
- **Music Page**: Showcase recordings with album art and streaming links
- **Videos Page**: Performance videos with thumbnails and descriptions
- **Events Page**: Upcoming and past events with dates, locations, and ticket links
- **News/Blog Page**: Latest updates and announcements with rich content
- **Contact Page**: Contact form with Firebase integration

### Admin Dashboard
- **Profile Editor**: Manage personal profile, bio, and profile image
- **Music Manager**: CRUD operations for music entries with cover images and streaming platform links
- **Video Manager**: Manage video content with custom thumbnails
- **Events Manager**: Schedule and manage performances with full event details
- **Posts Manager**: Create and publish blog posts with rich text editor, tags, and featured images
- **Messages Viewer**: View and manage contact form submissions with read/unread status
- **Social Links Editor**: Manage social media profile links

### Technical Features
- 🎨 **Dark Mode Theme**: Elegant dark color scheme throughout
- ⚡ **Vite Build System**: Lightning-fast development and optimized production builds
- 🔥 **Firebase Integration**: Firestore database, Storage, Authentication, and Hosting
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- ✨ **Smooth Animations**: Framer Motion animations for polished UX
- 🔐 **Secure Authentication**: Protected admin routes with Firebase Auth
- 📝 **Form Validation**: React Hook Form with Zod schema validation
- 🖼️ **Image Uploads**: Firebase Storage integration with progress tracking
- 📄 **Rich Text Editor**: HTML content editor with live preview

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend & Services
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - Image and file storage
- **Firebase Authentication** - User authentication
- **Firebase Hosting** - Static site hosting

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mariaskidmore
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Firestore Database**
   - **Storage**
   - **Authentication** (Email/Password provider)
   - **Hosting**

#### Get Firebase Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" and click "Web" icon (</>) to add a web app
3. Copy the Firebase configuration object

#### Configure Environment Variables
Create `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

⚠️ **Important**: Add `.env` to your `.gitignore` to keep credentials secure!

#### Set Up Firestore Security Rules

Go to Firestore Database → Rules and use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    // Public read access for all collections
    match /{collection}/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // Contact messages - anyone can create, only admins can read
    match /contact_messages/{message} {
      allow create: if true;
      allow read, update, delete: if isAuthenticated();
    }
  }
}
```

#### Set Up Storage Security Rules

Go to Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Create Admin User

#### Option 1: Firebase Console (Quickest)
1. Go to Firebase Console → Authentication
2. Click "Add User"
3. Enter email and password
4. Use these credentials to log in at `/admin/login`

#### Option 2: Admin Creation Script
```bash
# Install firebase-admin (dev dependency)
npm install --save-dev firebase-admin

# Download service account key from Firebase Console
# Place it as serviceAccountKey.json in project root
# Add to .gitignore!

# Run the script
node scripts/createAdmin.js
```

### 5. Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🏗️ Building for Production

### Build the Project

```bash
npm run build
```

This creates optimized files in the `build/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase (if not already done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

Your site will be live at: `https://your-project-id.web.app`

## 📁 Project Structure

```
mariaskidmore/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── admin/      # Admin-specific components
│   │   │   ├── ImageUpload.tsx
│   │   │   └── RichTextEditor.tsx
│   │   └── common/     # Shared components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Loading.tsx
│   │       └── ProtectedRoute.tsx
│   ├── contexts/       # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/          # Custom hooks
│   │   ├── useFirestore.ts
│   │   └── useImageUpload.ts
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Music.tsx
│   │   ├── Videos.tsx
│   │   ├── Events.tsx
│   │   ├── News.tsx
│   │   ├── Contact.tsx
│   │   └── admin/      # Admin pages
│   │       ├── Dashboard.tsx
│   │       ├── Login.tsx
│   │       ├── Profile.tsx
│   │       ├── MusicManager.tsx
│   │       ├── VideoManager.tsx
│   │       ├── EventsManager.tsx
│   │       ├── PostsManager.tsx
│   │       ├── MessagesViewer.tsx
│   │       └── SocialLinksEditor.tsx
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── firebase.ts     # Firebase configuration
│   ├── App.tsx         # Main app component
│   ├── index.css       # Global styles
│   └── main.tsx        # Entry point
├── scripts/
│   └── createAdmin.js  # Admin user creation script
├── .env                # Environment variables (create this!)
├── .gitignore
├── firebase.json       # Firebase configuration
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: { /* Your primary colors */ },
  accent: { /* Your accent colors */ },
  dark: { /* Your dark theme colors */ },
}
```

### Fonts
Current fonts:
- **Display**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

To change fonts, update `tailwind.config.js` and add links in `index.html`.

### Content
All content is managed through the admin dashboard at `/admin`. No code changes needed!

## 📱 Key Pages

- **Home**: `/`
- **About**: `/about`
- **Music**: `/music`
- **Videos**: `/videos`
- **Events**: `/events`
- **News**: `/news`
- **Contact**: `/contact`
- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`

## 🔐 Admin Features

### Profile Management
- Upload profile photo
- Edit name, title, bio
- Update contact information

### Content Management
- Add/edit/delete music entries with streaming links
- Manage video content with custom thumbnails
- Schedule and track events with ticket links
- Create rich blog posts with images and tags
- Publish/unpublish posts

### Communication
- View contact form submissions
- Mark messages as read/unread
- Manage social media links

## 🐛 Troubleshooting

### Build Errors

**TypeScript errors**: Ensure all dependencies are installed:
```bash
npm install
```

**Environment variables not found**: Make sure `.env` file exists with all required variables.

### Firebase Errors

**Permission denied**: Check Firestore and Storage security rules.

**Authentication failed**: Verify Firebase Authentication is enabled with Email/Password provider.

**Image upload fails**: Check Firebase Storage is enabled and rules are set correctly.

### Development Issues

**Port already in use**: Kill the process or change the port in `vite.config.ts`.

**Hot reload not working**: Try clearing Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

This is a personal portfolio project. If you're working on this project, please follow the existing code style and patterns.

## 📧 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ using React, Vite, Firebase, and TailwindCSS**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
