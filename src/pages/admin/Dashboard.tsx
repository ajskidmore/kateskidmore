import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  Music,
  Video,
  Calendar,
  FileText,
  MessageSquare,
  Share2,
  LogOut,
} from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  const adminSections = [
    { name: 'Profile', icon: User, path: '/admin/profile', description: 'Edit your profile and bio' },
    { name: 'Music', icon: Music, path: '/admin/music', description: 'Manage music releases' },
    { name: 'Videos', icon: Video, path: '/admin/videos', description: 'Manage video content' },
    { name: 'Events', icon: Calendar, path: '/admin/events', description: 'Manage upcoming events' },
    { name: 'Posts', icon: FileText, path: '/admin/posts', description: 'Write and publish posts' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages', description: 'View contact messages' },
    { name: 'Social Links', icon: Share2, path: '/admin/social', description: 'Manage social media links' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary-300">
                Admin Dashboard
              </h1>
              <p className="text-sm text-dark-text-secondary">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-primary-400 hover:underline"
              >
                View Site
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 text-dark-text-primary rounded-lg hover:bg-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-dark-text-primary mb-2">
            Content Management
          </h2>
          <p className="text-dark-text-secondary">
            Manage your website content from here
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={section.path}
                className="block p-6 bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-700 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <section.icon className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-dark-text-primary mb-1 group-hover:text-primary-400 transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-sm text-dark-text-secondary">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
