import { motion } from 'framer-motion';
import { usePublishedPosts } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { FileText, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export const News = () => {
  const { data: posts, loading } = usePublishedPosts();

  if (loading) {
    return <Loading fullScreen message="Loading news..." />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-primary-800 dark:text-primary-200 mb-4">
            News
          </h1>
          <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Latest updates and announcements
          </p>
        </motion.div>

        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="card"
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

                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishDate?.toDate().toISOString()}>
                    {formatDate(post.publishDate?.toDate())}
                  </time>
                </div>

                <h2 className="font-display text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-4">
                    {post.excerpt}
                  </p>
                )}

                <div
                  className="prose prose-lg dark:prose-invert max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-text-secondary dark:text-dark-text-secondary">
              No news posts have been published yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;
