import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, ExternalLink, Music as MusicIcon, FileText } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  ticketURL?: string;
  imageURL?: string;
}

interface Post {
  id: string;
  title: string;
  publishDate: string;
  excerpt?: string;
  content?: string;
  imageURL?: string;
  tags?: string[];
}

interface Music {
  id: string;
  title: string;
  artist?: string;
  coverImageURL?: string;
  spotifyURL?: string;
  appleMusicURL?: string;
  youtubeURL?: string;
  releaseDate?: string;
  description?: string;
}

type ContentItem = Event | Post | Music;

interface FeaturedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem | null;
  type: 'event' | 'post' | 'music';
}

export const FeaturedContentModal = ({ isOpen, onClose, content, type }: FeaturedContentModalProps) => {
  if (!content) return null;

  const renderEventContent = (event: Event) => (
    <>
      {event.imageURL && (
        <div className="w-full h-64 -mx-6 -mt-6 mb-6 rounded-t-xl overflow-hidden">
          <img
            src={event.imageURL}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-grey mb-4">
        <Calendar className="w-5 h-5" />
        <span className="text-lg font-semibold">
          {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {event.location && (
        <div className="flex items-center gap-2 text-grey mb-4">
          <MapPin className="w-5 h-5" />
          <span className="text-lg">{event.location}</span>
        </div>
      )}

      {event.description && (
        <div className="mb-6">
          <p className="text-grey-dark leading-relaxed">{event.description}</p>
        </div>
      )}

      {event.ticketURL && (
        <a
          href={event.ticketURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-grey-dark text-white rounded-lg hover:bg-grey transition-colors text-lg font-semibold"
        >
          Get Tickets <ExternalLink className="w-5 h-5" />
        </a>
      )}
    </>
  );

  const renderPostContent = (post: Post) => {
    // Handle Firestore Timestamp conversion
    const getPostDate = () => {
      if (!post.publishDate) return '';
      const dateObj = (post.publishDate as any).toDate
        ? (post.publishDate as any).toDate()
        : new Date(post.publishDate);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return (
      <>
        {post.imageURL && (
          <div className="w-full h-64 -mx-6 -mt-6 mb-6 rounded-t-xl overflow-hidden">
            <img
              src={post.imageURL}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-grey mb-4">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">
            {getPostDate()}
          </span>
        </div>

        {post.excerpt && (
          <div className="mb-4">
            <p className="text-lg text-grey-dark italic">{post.excerpt}</p>
          </div>
        )}

        {post.content && (
          <div
            className="prose prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-200 text-grey-dark rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderMusicContent = (music: Music) => (
    <>
      {music.coverImageURL && (
        <div className="w-full aspect-square -mx-6 -mt-6 mb-6 rounded-t-xl overflow-hidden">
          <img
            src={music.coverImageURL}
            alt={music.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {music.artist && (
        <div className="mb-4">
          <p className="text-xl text-grey">by {music.artist}</p>
        </div>
      )}

      {music.releaseDate && (
        <div className="flex items-center gap-2 text-grey mb-4">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">
            Released {new Date(music.releaseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      )}

      {music.description && (
        <div className="mb-6">
          <p className="text-grey-dark leading-relaxed">{music.description}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {music.spotifyURL && (
          <a
            href={music.spotifyURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <MusicIcon className="w-4 h-4" />
            Spotify
          </a>
        )}
        {music.appleMusicURL && (
          <a
            href={music.appleMusicURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <MusicIcon className="w-4 h-4" />
            Apple Music
          </a>
        )}
        {music.youtubeURL && (
          <a
            href={music.youtubeURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            YouTube
          </a>
        )}
      </div>
    </>
  );

  const getIcon = () => {
    switch (type) {
      case 'event':
        return <Calendar className="w-6 h-6" />;
      case 'post':
        return <FileText className="w-6 h-6" />;
      case 'music':
        return <MusicIcon className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="sticky top-4 float-right p-2 bg-grey-dark/80 text-white rounded-lg hover:bg-grey-dark transition-colors z-10 -mt-2 -mr-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-grey-dark text-white rounded-lg">
                  {getIcon()}
                </div>
                <h2 className="font-display text-3xl font-bold text-grey-dark flex-1">
                  {content.title}
                </h2>
              </div>

              {/* Content */}
              {type === 'event' && renderEventContent(content as Event)}
              {type === 'post' && renderPostContent(content as Post)}
              {type === 'music' && renderMusicContent(content as Music)}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeaturedContentModal;
