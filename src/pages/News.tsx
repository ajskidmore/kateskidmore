import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePublishedPosts } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { FileText, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import FeaturedContentModal from '../components/FeaturedContentModal';

export const News = () => {
  const { data: allPosts, loading } = usePublishedPosts();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  if (loading) {
    return <Loading fullScreen message="Loading news..." />;
  }

  const posts = allPosts || [];

  const openModal = (post: any) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-purple mb-4">
            News
          </h1>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Latest updates and announcements
          </p>
        </motion.div>

        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.button
                key={post.id}
                onClick={() => openModal(post)}
                className="card w-full text-left hover:shadow-xl transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {post.imageURL && (
                  <div className="mb-6 rounded-lg overflow-hidden -mx-6 -mt-6">
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-grey mb-4">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishDate?.toDate ? post.publishDate.toDate().toISOString() : new Date(post.publishDate).toISOString()}>
                    {formatDate(post.publishDate?.toDate ? post.publishDate.toDate() : new Date(post.publishDate))}
                  </time>
                </div>

                <h2 className="font-display text-3xl font-bold text-grey-dark mb-4">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-lg text-grey mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 5).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-gray-200 text-grey-dark rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 5 && (
                      <span className="text-xs px-3 py-1 text-grey">
                        +{post.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FileText className="w-16 h-16 text-grey mx-auto mb-4" />
            <p className="text-grey">
              No news posts have been published yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <FeaturedContentModal
        isOpen={modalOpen}
        onClose={closeModal}
        content={selectedPost}
        type="post"
      />
    </div>
  );
};

export default News;
