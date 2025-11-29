import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// @ts-ignore - Apollo Client v4 exports issue
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import apolloClient from './graphql/client';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Music from './pages/Music';
import Videos from './pages/Videos';
import Events from './pages/Events';
import News from './pages/News';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile';
import MusicManager from './pages/admin/MusicManager';
import VideoManager from './pages/admin/VideoManager';
import EventsManager from './pages/admin/EventsManager';
import PostsManager from './pages/admin/PostsManager';
import MessagesViewer from './pages/admin/MessagesViewer';
import SocialLinksEditor from './pages/admin/SocialLinksEditor';
import FeaturedContentManager from './pages/admin/FeaturedContentManager';

// Layout wrapper for public pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-dark-background">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <About />
                </PublicLayout>
              }
            />
            <Route
              path="/music"
              element={
                <PublicLayout>
                  <Music />
                </PublicLayout>
              }
            />
            <Route
              path="/videos"
              element={
                <PublicLayout>
                  <Videos />
                </PublicLayout>
              }
            />
            <Route
              path="/events"
              element={
                <PublicLayout>
                  <Events />
                </PublicLayout>
              }
            />
            <Route
              path="/news"
              element={
                <PublicLayout>
                  <News />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <Contact />
                </PublicLayout>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Management Pages */}
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/music"
              element={
                <ProtectedRoute>
                  <MusicManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/videos"
              element={
                <ProtectedRoute>
                  <VideoManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <EventsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute>
                  <PostsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <MessagesViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/social"
              element={
                <ProtectedRoute>
                  <SocialLinksEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/featured"
              element={
                <ProtectedRoute>
                  <FeaturedContentManager />
                </ProtectedRoute>
              }
            />
          </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
