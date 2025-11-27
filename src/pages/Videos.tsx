import { motion } from 'framer-motion';
import { useVideos } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { Video as VideoIcon } from 'lucide-react';
import { extractYouTubeId, extractVimeoId } from '../utils/helpers';

export const Videos = () => {
  const { data: videos, loading } = useVideos();

  if (loading) {
    return <Loading fullScreen message="Loading videos..." />;
  }

  const getVideoThumbnail = (url: string, customThumbnail?: string) => {
    if (customThumbnail) return customThumbnail;

    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }

    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
      // Vimeo thumbnails require API call, using placeholder for now
      return null;
    }

    return null;
  };

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
            Videos
          </h1>
          <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Watch performances and video content
          </p>
        </motion.div>

        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => {
              const thumbnail = getVideoThumbnail(video.url, video.thumbnailURL);

              return (
                <motion.a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {thumbnail ? (
                      <>
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-l-[16px] border-l-primary-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-display text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </motion.a>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <VideoIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-text-secondary dark:text-dark-text-secondary">
              No videos have been added yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Videos;
