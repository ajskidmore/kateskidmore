import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Instagram, Facebook, Youtube, Twitter, Music } from 'lucide-react';
import { useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';

const socialLinksSchema = z.object({
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  spotify: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type SocialLinksFormData = z.infer<typeof socialLinksSchema>;

export const SocialLinksEditor = () => {
  const [socialLinksId, setSocialLinksId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { getAll, create, update } = useFirestoreCRUD(COLLECTIONS.SOCIAL_LINKS);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SocialLinksFormData>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: '',
      spotify: '',
    },
  });

  // Load existing social links
  useEffect(() => {
    const loadSocialLinks = async () => {
      const links = await getAll();
      if (links && links.length > 0) {
        const socialLinks = links[0];
        setSocialLinksId(socialLinks.id);
        setValue('instagram', socialLinks.instagram || '');
        setValue('facebook', socialLinks.facebook || '');
        setValue('youtube', socialLinks.youtube || '');
        setValue('twitter', socialLinks.twitter || '');
        setValue('spotify', socialLinks.spotify || '');
      }
    };
    loadSocialLinks();
  }, []);

  const onSubmit = async (data: SocialLinksFormData) => {
    setSaving(true);
    setSuccessMessage(null);

    try {
      if (socialLinksId) {
        await update(socialLinksId, data);
      } else {
        const result = await create(data);
        if (result) {
          setSocialLinksId(result);
        }
      }
      setSuccessMessage('Social links saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving social links:', error);
    } finally {
      setSaving(false);
    }
  };

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
                <h1 className="font-display text-2xl font-bold text-white">
                  Social Media Links
                </h1>
                <p className="text-sm text-white/80">
                  Manage your social media profiles
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="card">
              <h2 className="font-display text-xl font-bold text-grey-dark mb-6">
                Social Media Profiles
              </h2>
              <div className="space-y-6">
                {/* Instagram */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-grey-dark mb-2">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    Instagram
                  </label>
                  <input
                    {...register('instagram')}
                    type="url"
                    className="input-field"
                    placeholder="https://instagram.com/username"
                  />
                  {errors.instagram && (
                    <p className="mt-1 text-sm text-red-400">{errors.instagram.message}</p>
                  )}
                </div>

                {/* Facebook */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-grey-dark mb-2">
                    <Facebook className="w-5 h-5 text-blue-500" />
                    Facebook
                  </label>
                  <input
                    {...register('facebook')}
                    type="url"
                    className="input-field"
                    placeholder="https://facebook.com/username"
                  />
                  {errors.facebook && (
                    <p className="mt-1 text-sm text-red-400">{errors.facebook.message}</p>
                  )}
                </div>

                {/* YouTube */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-grey-dark mb-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    YouTube
                  </label>
                  <input
                    {...register('youtube')}
                    type="url"
                    className="input-field"
                    placeholder="https://youtube.com/@username"
                  />
                  {errors.youtube && (
                    <p className="mt-1 text-sm text-red-400">{errors.youtube.message}</p>
                  )}
                </div>

                {/* Twitter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-grey-dark mb-2">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    Twitter / X
                  </label>
                  <input
                    {...register('twitter')}
                    type="url"
                    className="input-field"
                    placeholder="https://twitter.com/username"
                  />
                  {errors.twitter && (
                    <p className="mt-1 text-sm text-red-400">{errors.twitter.message}</p>
                  )}
                </div>

                {/* Spotify */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-grey-dark mb-2">
                    <Music className="w-5 h-5 text-green-500" />
                    Spotify
                  </label>
                  <input
                    {...register('spotify')}
                    type="url"
                    className="input-field"
                    placeholder="https://open.spotify.com/artist/..."
                  />
                  {errors.spotify && (
                    <p className="mt-1 text-sm text-red-400">{errors.spotify.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/30 border border-green-700 rounded-lg"
              >
                <p className="text-sm text-green-300">{successMessage}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Social Links</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default SocialLinksEditor;
