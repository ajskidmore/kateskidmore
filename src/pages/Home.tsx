import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useFirestore';
import { ChevronDown } from 'lucide-react';

export const Home = () => {
  const { data: profile, loading } = useProfile();

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient (will be replaced with image if uploaded) */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-accent-50 to-primary-50 dark:from-gray-900 dark:via-primary-900/20 dark:to-gray-900" />

        {/* Profile photo if available */}
        {profile?.photoURL && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={profile.photoURL}
              alt={profile.name || 'Maria Skidmore'}
              className="w-full h-full object-cover opacity-30 dark:opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background dark:from-transparent dark:via-dark-background/50 dark:to-dark-background" />
          </motion.div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-800 dark:text-primary-200 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {profile?.name || 'Maria Skidmore'}
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl text-text-secondary dark:text-dark-text-secondary mb-8 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {profile?.title || 'Violinist • Pianist • Music Director'}
          </motion.p>

          {profile?.tagline && (
            <motion.p
              className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {profile.tagline}
            </motion.p>
          )}

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="/music"
              className="btn-primary px-8 py-3 text-lg"
            >
              Listen Now
            </a>
            <a
              href="/contact"
              className="px-8 py-3 text-lg border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-full hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-colors font-medium"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </section>

      {/* Featured Content Section (placeholder) */}
      <section className="py-20 px-4 bg-white dark:bg-dark-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-primary-200 mb-4">
              Welcome
            </h2>
            <p className="text-lg text-gray-700 dark:text-dark-text-secondary max-w-2xl mx-auto">
              {profile?.bio || 'Bringing classical music to life through passionate performance and dedicated music education.'}
            </p>
          </motion.div>

          {/* Will add featured music, videos, and events here */}
        </div>
      </section>
    </div>
  );
};

export default Home;
