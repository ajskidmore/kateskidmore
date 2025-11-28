import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';

export const About = () => {
  const { data: profile, loading } = useProfile();

  if (loading) {
    return <Loading fullScreen message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          className="font-display text-5xl lg:text-6xl font-bold text-primary-200 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About
        </motion.h1>

        {profile?.photoURL && (
          <motion.div
            className="mb-12 rounded-2xl overflow-hidden shadow-xl max-w-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={profile.photoURL}
              alt={profile.name || 'Maria Skidmore'}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        <motion.div
          className="prose prose-lg dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {profile?.bio ? (
            <div dangerouslySetInnerHTML={{ __html: profile.bio }} />
          ) : (
            <p className="text-dark-text-secondary">
              Profile information will be displayed here once added by the admin.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
