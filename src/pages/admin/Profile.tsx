import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';
import ImageUpload from '../../components/admin/ImageUpload';
import RichTextEditor from '../../components/admin/RichTextEditor';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  location: z.string().optional(),
  profileImageURL: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile = () => {
  const { user } = useAuth();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { getAll, create, update } = useFirestoreCRUD(COLLECTIONS.PROFILE);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      profileImageURL: '',
    },
  });

  const bio = watch('bio');
  const profileImageURL = watch('profileImageURL');

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      const profiles = await getAll();
      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        setProfileId(profile.id);
        setValue('name', profile.name || '');
        setValue('title', profile.title || '');
        setValue('bio', profile.bio || '');
        setValue('email', profile.email || '');
        setValue('phone', profile.phone || '');
        setValue('location', profile.location || '');
        setValue('profileImageURL', profile.profileImageURL || '');
      }
    };
    loadProfile();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setSuccessMessage(null);

    try {
      if (profileId) {
        await update(profileId, data);
      } else {
        const result = await create(data);
        if (result) {
          setProfileId(result);
        }
      }
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
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
                  Profile Settings
                </h1>
                <p className="text-sm text-white/80">
                  Manage your public profile information
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
            {/* Profile Image */}
            <div className="card">
              <h2 className="font-display text-xl font-bold text-grey-dark mb-6">
                Profile Image
              </h2>
              <ImageUpload
                currentImageURL={profileImageURL}
                onUploadComplete={(url) => setValue('profileImageURL', url)}
                onRemove={() => setValue('profileImageURL', '')}
                label="Profile Photo"
                folder="profile"
                aspectRatio="square"
              />
            </div>

            {/* Basic Information */}
            <div className="card">
              <h2 className="font-display text-xl font-bold text-grey-dark mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="input-field"
                    placeholder="Kate Skidmore"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="input-field"
                    placeholder="Violinist, Pianist & Music Director"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field"
                    placeholder="kate@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Phone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Location
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="input-field"
                    placeholder="Los Angeles, CA"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="card">
              <h2 className="font-display text-xl font-bold text-grey-dark mb-6">
                Biography
              </h2>
              <RichTextEditor
                value={bio}
                onChange={(value) => setValue('bio', value)}
                label="Bio *"
                placeholder="Write your biography here..."
                minHeight="400px"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-400">{errors.bio.message}</p>
              )}
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
                    <span>Save Profile</span>
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

export default Profile;
