import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, FileText, Tag, Image as ImageIcon } from 'lucide-react';
import { useCollection, useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';
import ImageUpload from '../../components/admin/ImageUpload';
import RichTextEditor from '../../components/admin/RichTextEditor';
import Loading from '../../components/common/Loading';
import { orderBy } from 'firebase/firestore';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  imageURL: z.string().optional(),
  published: z.boolean(),
  publishDate: z.string().min(1, 'Publish date is required'),
});

type PostFormData = z.infer<typeof postSchema>;

export const PostsManager = () => {
  const { data: posts, loading, refetch } = useCollection(COLLECTIONS.POSTS, [orderBy('publishDate', 'desc')]);
  const { create, update, remove } = useFirestoreCRUD(COLLECTIONS.POSTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      imageURL: '',
      published: false,
      publishDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
    },
  });

  const content = watch('content');
  const imageURL = watch('imageURL');

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setShowForm(true);

    // Convert Firestore Timestamp to date format (YYYY-MM-DD)
    let publishDateString = new Date().toISOString().slice(0, 10);
    if (post.publishDate) {
      const dateObj = post.publishDate.toDate ? post.publishDate.toDate() : new Date(post.publishDate);
      publishDateString = dateObj.toISOString().slice(0, 10);
    }

    setValue('title', post.title || '');
    setValue('excerpt', post.excerpt || '');
    setValue('content', post.content || '');
    setValue('imageURL', post.imageURL || '');
    setValue('published', post.published || false);
    setValue('publishDate', publishDateString);
    setTags(post.tags || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setTags([]);
    setNewTag('');
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await remove(id);
      await refetch();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: PostFormData) => {
    setSaving(true);

    try {
      // Convert publishDate string to Date object for Firestore
      // The date input provides a string in format: YYYY-MM-DD
      const publishDate = new Date(data.publishDate);

      // Validate the date is valid
      if (isNaN(publishDate.getTime())) {
        console.error('Invalid date:', data.publishDate);
        alert('Invalid publish date. Please select a valid date.');
        setSaving(false);
        return;
      }

      const postData = {
        ...data,
        tags,
        publishDate,
      };

      if (editingId) {
        await update(editingId, postData);
      } else {
        await create(postData);
      }
      await refetch();
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading posts..." />;
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
                <ArrowLeft className="w-5 h-5 text-beige-light" />
              </Link>
              <div>
                <h1 className="font-display text-2xl font-bold text-beige-light">
                  Posts Manager
                </h1>
                <p className="text-sm text-beige">
                  Manage blog posts and news updates
                </p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Post
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
                  {editingId ? 'Edit Post' : 'Add New Post'}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-grey rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-grey-dark" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Featured Image */}
                <ImageUpload
                  currentImageURL={imageURL}
                  onUploadComplete={(url) => setValue('imageURL', url)}
                  onRemove={() => setValue('imageURL', '')}
                  label="Featured Image"
                  folder="posts"
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
                    placeholder="Post Title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Excerpt
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Brief summary of the post..."
                  />
                </div>

                {/* Content */}
                <div>
                  <RichTextEditor
                    value={content}
                    onChange={(value) => setValue('content', value)}
                    label="Content *"
                    placeholder="Write your post content here..."
                    minHeight="400px"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-grey-dark">
                      Tags
                    </label>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="input-field flex-1"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-grey-dark text-white rounded-lg hover:bg-grey transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-grey-dark rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Publish Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-2">
                      Publish Date *
                    </label>
                    <input
                      {...register('publishDate')}
                      type="date"
                      className="input-field"
                    />
                    {errors.publishDate && (
                      <p className="mt-1 text-sm text-red-400">{errors.publishDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-2">
                      Status
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-gradient-grey rounded-lg cursor-pointer">
                      <input
                        {...register('published')}
                        type="checkbox"
                        className="w-5 h-5 text-grey-dark bg-grey border-beige-dark rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-beige-light">Published</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-grey text-white rounded-lg hover:bg-grey-dark hover:text-white transition-colors"
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

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post: any, index: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group"
              >
                {/* Featured Image */}
                {post.imageURL && (
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gradient-grey">
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Status Badge */}
                <div className="mb-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    post.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-grey text-white'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold text-grey-dark mb-2">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-sm text-grey-dark mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-grey-dark rounded-full text-xs"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-grey text-xs">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Publish Date */}
                <p className="text-xs text-grey-dark mb-4">
                  {post.publishDate && (() => {
                    const dateObj = post.publishDate.toDate ? post.publishDate.toDate() : new Date(post.publishDate);
                    return dateObj.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                  })()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-grey">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 p-2 bg-grey-dark rounded-lg hover:bg-grey transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <FileText className="w-16 h-16 text-grey mx-auto mb-4" />
              <p className="text-beige">No posts added yet. Click "Add Post" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostsManager;
