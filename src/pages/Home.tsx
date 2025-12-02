import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useFirestore';
import { ChevronDown } from 'lucide-react';
import FeaturedContent from '../components/FeaturedContent';

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Optional overlay for profile image */}

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
              alt={profile.name || 'Kate Skidmore'}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-beige/50 to-beige" />
          </motion.div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-purple mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {profile?.name || 'Kate Skidmore'}
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl text-grey-light mb-8 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {profile?.title || 'Violinist • Pianist • Music Director'}
          </motion.p>

          {profile?.tagline && (
            <motion.p
              className="text-lg text-grey max-w-2xl mx-auto mb-12"
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
              className="px-8 py-3 text-lg border-2 border-purple text-purple rounded-full hover:bg-purple hover:text-white transition-colors font-medium"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-grey hover:text-grey-dark transition-colors"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </section>

      {/* Featured Content Section - Powered by GraphQL */}
      <FeaturedContent />
    </div>
  );
};

export default Home;
