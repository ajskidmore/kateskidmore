import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '../utils/validators';
import { useFirestoreCRUD } from '../hooks/useFirestore';
import { COLLECTIONS } from '../firebase';
import type { ContactFormData } from '../types';
import { Mail, Send, CheckCircle } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { create, loading, error } = useFirestoreCRUD(COLLECTIONS.CONTACT_MESSAGES);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const messageData = {
      ...data,
      isRead: false,
    };

    const result = await create(messageData);

    if (result) {
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-primary-200 mb-4">
            Contact
          </h1>
          <p className="text-lg text-dark-text-secondary">
            Get in touch for bookings, collaborations, or inquiries
          </p>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-dark-text-primary mb-2">
                Message Sent!
              </h2>
              <p className="text-dark-text-secondary">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-dark-text-primary mb-2"
                >
                  Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="input-field"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-dark-text-primary mb-2"
                >
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-dark-text-primary mb-2"
                >
                  Subject
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  id="subject"
                  className="input-field"
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-dark-text-primary mb-2"
                >
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 text-dark-text-secondary">
            <Mail className="w-5 h-5" />
            <p className="text-sm">
              Or reach out directly via social media (links in footer)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
