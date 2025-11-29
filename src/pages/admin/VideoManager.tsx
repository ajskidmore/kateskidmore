import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Video as VideoIcon } from 'lucide-react';
import { useVideos, useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';
import ImageUpload from '../../components/admin/ImageUpload';
import Loading from '../../components/common/Loading';

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL'),
  description: z.string().optional(),
  thumbnailURL: z.string().optional(),
});

type VideoFormData = z.infer<typeof videoSchema>;

export const VideoManager = () => {
  const { data: videos, loading } = useVideos();
  const { create, update, remove } = useFirestoreCRUD(COLLECTIONS.VIDEOS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      thumbnailURL: '',
    },
  });

  const thumbnailURL = watch('thumbnailURL');

  const handleEdit = (video: any) => {
    setEditingId(video.id);
    setShowForm(true);
    setValue('title', video.title || '');
    setValue('url', video.url || '');
    setValue('description', video.description || '');
    setValue('thumbnailURL', video.thumbnailURL || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await remove(id);
    }
  };

  const onSubmit = async (data: VideoFormData) => {
    setSaving(true);

    try {
      if (editingId) {
        await update(editingId, data);
      } else {
        await create(data);
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving video:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading videos..." />;
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
                  Video Manager
                </h1>
                <p className="text-sm text-beige">
                  Manage your video content
                </p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Video
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
                  {editingId ? 'Edit Video' : 'Add New Video'}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-grey rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-grey-dark" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Thumbnail */}
                <ImageUpload
                  currentImageURL={thumbnailURL}
                  onUploadComplete={(url) => setValue('thumbnailURL', url)}
                  onRemove={() => setValue('thumbnailURL', '')}
                  label="Custom Thumbnail (optional)"
                  folder="videos"
                  aspectRatio="video"
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
                    placeholder="Video Title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Video URL *
                  </label>
                  <input
                    {...register('url')}
                    type="url"
                    className="input-field"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.url && (
                    <p className="mt-1 text-sm text-red-400">{errors.url.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Supports YouTube, Vimeo, and other video platforms
                  </p>
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
                    placeholder="Brief description of the video..."
                  />
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

        {/* Video List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gradient-grey">
                  {video.thumbnailURL ? (
                    <img
                      src={video.thumbnailURL}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoIcon className="w-16 h-16 text-grey" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 bg-grey-dark rounded-full hover:bg-grey transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-display text-lg font-bold text-grey-dark mb-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-sm text-grey-dark mb-3 line-clamp-2">
                    {video.description}
                  </p>
                )}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-grey-dark hover:underline break-all"
                >
                  {video.url}
                </a>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <VideoIcon className="w-16 h-16 text-grey mx-auto mb-4" />
              <p className="text-beige">No videos added yet. Click "Add Video" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoManager;
