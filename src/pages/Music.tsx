import { motion } from 'framer-motion';
import { useMusic } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { Music as MusicIcon, ExternalLink } from 'lucide-react';

export const Music = () => {
  const { data: music, loading } = useMusic();

  if (loading) {
    return <Loading fullScreen message="Loading music..." />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-primary-800 dark:text-primary-200 mb-4">
            Music
          </h1>
          <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Explore my musical recordings and performances
          </p>
        </motion.div>

        {music && music.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {music.map((item, index) => (
              <motion.div
                key={item.id}
                className="card group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Cover Image */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {item.coverImageURL ? (
                    <img
                      src={item.coverImageURL}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MusicIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-display text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                {item.artist && (
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-2">
                    {item.artist}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Links */}
                {item.streamingLinks && item.streamingLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.streamingLinks.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.platform}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MusicIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-text-secondary dark:text-dark-text-secondary">
              No music has been added yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Music;
