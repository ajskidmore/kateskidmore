import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebase';
import { useAllPosts, useMusic, useUpcomingEvents } from '../../hooks/useFirestore';
import Loading from '../../components/common/Loading';

interface FeaturedSettings {
  featuredEventIds: string[];
  featuredPostIds: string[];
  featuredMusicIds: string[];
}

export const FeaturedContentManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events, loading: loadingEvents } = useUpcomingEvents();
  const { data: posts, loading: loadingPosts } = useAllPosts();
  const { data: music, loading: loadingMusic } = useMusic();

  const [settings, setSettings] = useState<FeaturedSettings>({
    featuredEventIds: [],
    featuredPostIds: [],
    featuredMusicIds: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, [user, navigate]);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, COLLECTIONS.SETTINGS, 'featured');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as FeaturedSettings);
      }
    } catch (error) {
      console.error('Error loading featured settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const docRef = doc(db, COLLECTIONS.SETTINGS, 'featured');
      await setDoc(docRef, settings);

      setMessage({ type: 'success', text: 'Featured content settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = (type: 'event' | 'post' | 'music', id: string) => {
    setSettings((prev) => {
      const key = type === 'event' ? 'featuredEventIds' : type === 'post' ? 'featuredPostIds' : 'featuredMusicIds';
      const currentIds = prev[key];
      const isSelected = currentIds.includes(id);

      return {
        ...prev,
        [key]: isSelected
          ? currentIds.filter((itemId) => itemId !== id)
          : [...currentIds, id],
      };
    });
  };

  if (loading || loadingEvents || loadingPosts || loadingMusic) {
    return <Loading fullScreen message="Loading featured content manager..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-grey shadow-sm border-b border-grey">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-grey rounded-lg transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-beige-light" />
              </button>
              <div>
                <h1 className="font-display text-2xl font-bold text-beige-light">
                  Featured Content
                </h1>
                <p className="text-sm text-beige">
                  Select content to feature on the home page
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-grey-dark text-white rounded-lg hover:bg-grey transition-colors disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Events Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-grey-dark mb-4 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Featured Events ({settings.featuredEventIds.length}/3)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events && events.length > 0 ? (
              events.map((event: any) => {
                const isSelected = settings.featuredEventIds.includes(event.id);
                const canSelect = settings.featuredEventIds.length < 3 || isSelected;

                return (
                  <button
                    key={event.id}
                    onClick={() => canSelect && toggleSelection('event', event.id)}
                    disabled={!canSelect}
                    className={`card text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-grey-dark bg-gray-100'
                        : 'hover:shadow-lg'
                    } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-grey-dark flex-1">{event.title}</h3>
                      {isSelected && <Star className="w-5 h-5 text-grey-dark fill-current flex-shrink-0 ml-2" />}
                    </div>
                    <p className="text-sm text-grey">
                      {event.date?.toDate ? new Date(event.date.toDate()).toLocaleDateString() : ''}
                    </p>
                    {event.location && (
                      <p className="text-xs text-grey mt-1">{event.location}</p>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="text-grey col-span-full">No events available</p>
            )}
          </div>
        </section>

        {/* Posts Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-grey-dark mb-4 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Featured Posts ({settings.featuredPostIds.length}/3)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => {
                  const isSelected = settings.featuredPostIds.includes(post.id);
                  const canSelect = settings.featuredPostIds.length < 3 || isSelected;

                  return (
                    <button
                      key={post.id}
                      onClick={() => canSelect && toggleSelection('post', post.id)}
                      disabled={!canSelect}
                      className={`card text-left transition-all ${
                        isSelected
                          ? 'ring-2 ring-grey-dark bg-gray-100'
                          : 'hover:shadow-lg'
                      } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {post.imageURL && (
                        <div className="mb-3 -mx-6 -mt-6 rounded-t-xl overflow-hidden">
                          <img
                            src={post.imageURL}
                            alt={post.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-grey-dark line-clamp-2">
                            {post.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-grey text-white'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {isSelected && <Star className="w-5 h-5 text-grey-dark fill-current flex-shrink-0 ml-2" />}
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-grey line-clamp-2">{post.excerpt}</p>
                      )}
                    </button>
                  );
                })
            ) : (
              <p className="text-grey col-span-full">No published posts available</p>
            )}
          </div>
        </section>

        {/* Music Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-grey-dark mb-4 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Featured Music ({settings.featuredMusicIds.length}/3)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {music && music.length > 0 ? (
              music.map((track: any) => {
                const isSelected = settings.featuredMusicIds.includes(track.id);
                const canSelect = settings.featuredMusicIds.length < 3 || isSelected;

                return (
                  <button
                    key={track.id}
                    onClick={() => canSelect && toggleSelection('music', track.id)}
                    disabled={!canSelect}
                    className={`card text-left transition-all ${
                      isSelected
                        ? 'ring-2 ring-grey-dark bg-gray-100'
                        : 'hover:shadow-lg'
                    } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {track.coverImageURL && (
                      <div className="mb-3 -mx-6 -mt-6 rounded-t-xl overflow-hidden">
                        <img
                          src={track.coverImageURL}
                          alt={track.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-grey-dark">{track.title}</h3>
                        {track.artist && <p className="text-sm text-grey">{track.artist}</p>}
                      </div>
                      {isSelected && <Star className="w-5 h-5 text-grey-dark fill-current flex-shrink-0 ml-2" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-grey col-span-full">No music available</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturedContentManager;
