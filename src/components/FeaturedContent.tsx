// @ts-ignore - Apollo Client v4 exports issue
import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Music as MusicIcon, ExternalLink } from 'lucide-react';
import { GET_FEATURED_CONTENT } from '../graphql/queries';
import { GetFeaturedContentData, GetFeaturedContentVars } from '../graphql/types';
import Loading from './common/Loading';
import FeaturedContentModal from './FeaturedContentModal';

export const FeaturedContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [contentType, setContentType] = useState<'event' | 'post' | 'music'>('event');

  const { data, loading, error } = useQuery<GetFeaturedContentData, GetFeaturedContentVars>(GET_FEATURED_CONTENT, {
    variables: {
      eventsLimit: 3,
      postsLimit: 3,
      musicLimit: 3,
    },
  });

  const openModal = (content: any, type: 'event' | 'post' | 'music') => {
    setSelectedContent(content);
    setContentType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
  };

  if (loading) return <Loading message="Loading featured content via GraphQL..." />;
  if (error) return <div className="text-center text-grey">Error loading content</div>;

  const { upcomingEvents, recentPosts, featuredMusic } = data?.getFeaturedContent || { upcomingEvents: [], recentPosts: [], featuredMusic: [] };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header with GraphQL Badge */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-grey-dark text-white rounded-full text-sm mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Powered by GraphQL
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-grey-dark mb-4">
            Featured Content
          </h2>
        </motion.div>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1: Upcoming Events */}
          <div className="card flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-grey-dark flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </h3>
              <Link to="/events" className="text-xs text-grey-dark hover:text-grey hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {upcomingEvents.map((event: any, index: number) => (
                <motion.button
                  key={event.id}
                  onClick={() => openModal(event, 'event')}
                  className="p-4 bg-white rounded-lg border border-beige-dark hover:shadow-lg hover:border-grey-dark transition-all cursor-pointer text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-grey-dark text-white rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-grey-dark mb-1 line-clamp-2">
                        {event.title}
                      </h4>
                      {event.location && (
                        <p className="text-sm text-grey truncate">{event.location}</p>
                      )}
                    </div>
                  </div>
                  {event.ticketURL && (
                    <span className="text-xs text-grey-dark inline-flex items-center gap-1">
                      Get Tickets <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Column 2: Featured Music */}
          <div className="card flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-grey-dark flex items-center gap-2">
                <MusicIcon className="w-5 h-5" />
                Featured Music
              </h3>
              <Link to="/music" className="text-xs text-grey-dark hover:text-grey hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {featuredMusic.map((music: any, index: number) => (
                <motion.button
                  key={music.id}
                  onClick={() => openModal(music, 'music')}
                  className="p-4 bg-white rounded-lg border border-beige-dark hover:shadow-lg hover:border-grey-dark transition-all cursor-pointer text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {music.coverImageURL && (
                    <div className="mb-3 -mx-4 -mt-4 rounded-t-lg overflow-hidden">
                      <img
                        src={music.coverImageURL}
                        alt={music.title}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-grey-dark mb-1 text-sm">{music.title}</h4>
                  {music.artist && <p className="text-xs text-grey mb-2">{music.artist}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {music.spotifyURL && (
                      <span className="text-xs px-2 py-1 bg-gray-200 text-grey-dark rounded-full">
                        Spotify
                      </span>
                    )}
                    {music.appleMusicURL && (
                      <span className="text-xs px-2 py-1 bg-gray-200 text-grey-dark rounded-full">
                        Apple Music
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Column 3: Latest News */}
          <div className="card flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-grey-dark flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Latest News
              </h3>
              <Link to="/news" className="text-xs text-grey-dark hover:text-grey hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {recentPosts.map((post: any, index: number) => (
                <motion.button
                  key={post.id}
                  onClick={() => openModal(post, 'post')}
                  className="p-4 bg-white rounded-lg border border-beige-dark hover:shadow-lg hover:border-grey-dark transition-all cursor-pointer text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {post.imageURL && (
                    <div className="mb-3 -mx-4 -mt-4 rounded-t-lg overflow-hidden">
                      <img
                        src={post.imageURL}
                        alt={post.title}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-grey-dark mb-2 text-sm line-clamp-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-xs text-grey mb-2 line-clamp-2">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-grey">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modal */}
      <FeaturedContentModal
        isOpen={modalOpen}
        onClose={closeModal}
        content={selectedContent}
        type={contentType}
      />
    </section>
  );
};

export default FeaturedContent;
