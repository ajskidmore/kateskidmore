import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Music as MusicIcon, ExternalLink } from 'lucide-react';
import { useMusic, useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';
import ImageUpload from '../../components/admin/ImageUpload';
import Loading from '../../components/common/Loading';

const musicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().optional(),
  description: z.string().optional(),
  coverImageURL: z.string().optional(),
  streamingLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url('Invalid URL'),
  })).optional(),
});

type MusicFormData = z.infer<typeof musicSchema>;

export const MusicManager = () => {
  const { data: musicList, loading } = useMusic();
  const { create, update, remove } = useFirestoreCRUD(COLLECTIONS.MUSIC);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [streamingLinks, setStreamingLinks] = useState<Array<{ platform: string; url: string }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MusicFormData>({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      title: '',
      artist: '',
      description: '',
      coverImageURL: '',
      streamingLinks: [],
    },
  });

  const coverImageURL = watch('coverImageURL');

  const handleEdit = (music: any) => {
    setEditingId(music.id);
    setShowForm(true);
    setValue('title', music.title || '');
    setValue('artist', music.artist || '');
    setValue('description', music.description || '');
    setValue('coverImageURL', music.coverImageURL || '');
    setStreamingLinks(music.streamingLinks || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setStreamingLinks([]);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this music entry?')) {
      await remove(id);
    }
  };

  const addStreamingLink = () => {
    setStreamingLinks([...streamingLinks, { platform: '', url: '' }]);
  };

  const updateStreamingLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...streamingLinks];
    updated[index][field] = value;
    setStreamingLinks(updated);
  };

  const removeStreamingLink = (index: number) => {
    setStreamingLinks(streamingLinks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: MusicFormData) => {
    setSaving(true);

    const musicData = {
      ...data,
      streamingLinks: streamingLinks.filter(link => link.platform && link.url),
    };

    try {
      if (editingId) {
        await update(editingId, musicData);
      } else {
        await create(musicData);
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving music:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading music..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-grey shadow-sm border-b border-grey">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="p-2 hover:bg-grey rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-grey-dark" />
              </Link>
              <div>
                <h1 className="font-display text-2xl font-bold text-beige-light">
                  Music Manager
                </h1>
                <p className="text-sm text-beige">
                  Manage your music and recordings
                </p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Music
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-grey-dark">
                  {editingId ? 'Edit Music' : 'Add New Music'}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-grey rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-grey-dark" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Cover Image */}
                <ImageUpload
                  currentImageURL={coverImageURL}
                  onUploadComplete={(url) => setValue('coverImageURL', url)}
                  onRemove={() => setValue('coverImageURL', '')}
                  label="Cover Image"
                  folder="music"
                  aspectRatio="square"
                />

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="input-field"
                    placeholder="Album or Track Title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Artist
                  </label>
                  <input
                    {...register('artist')}
                    type="text"
                    className="input-field"
                    placeholder="Artist or Composer Name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Brief description of the music..."
                  />
                </div>

                {/* Streaming Links */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-grey-dark">
                      Streaming Links
                    </label>
                    <button
                      type="button"
                      onClick={addStreamingLink}
                      className="text-sm text-grey-dark hover:text-grey-dark"
                    >
                      + Add Link
                    </button>
                  </div>
                  <div className="space-y-3">
                    {streamingLinks.map((link, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => updateStreamingLink(index, 'platform', e.target.value)}
                          className="input-field flex-1"
                          placeholder="Platform (e.g., Spotify, Apple Music)"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateStreamingLink(index, 'url', e.target.value)}
                          className="input-field flex-[2]"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => removeStreamingLink(index)}
                          className="p-2 hover:bg-grey rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-grey text-grey-dark rounded-lg hover:bg-grey-dark transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicList && musicList.length > 0 ? (
            musicList.map((music, index) => (
              <motion.div
                key={music.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group"
              >
                {/* Cover Image */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-grey">
                  {music.coverImageURL ? (
                    <img
                      src={music.coverImageURL}
                      alt={music.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MusicIcon className="w-16 h-16 text-grey" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(music)}
                      className="p-2 bg-grey-dark rounded-full hover:bg-grey transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(music.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-display text-lg font-bold text-grey-dark mb-1">
                  {music.title}
                </h3>
                {music.artist && (
                  <p className="text-sm text-grey-dark mb-2">{music.artist}</p>
                )}
                {music.description && (
                  <p className="text-sm text-grey-dark mb-3 line-clamp-2">
                    {music.description}
                  </p>
                )}

                {/* Streaming Links */}
                {music.streamingLinks && music.streamingLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {music.streamingLinks.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 text-grey-dark rounded-full hover:bg-primary-900/50"
                      >
                        {link.platform}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <MusicIcon className="w-16 h-16 text-grey mx-auto mb-4" />
              <p className="text-beige">No music added yet. Click "Add Music" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MusicManager;
