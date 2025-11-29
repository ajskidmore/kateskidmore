import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Calendar, MapPin, Clock } from 'lucide-react';
import { useCollection, useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';
import Loading from '../../components/common/Loading';
import { orderBy } from 'firebase/firestore';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  ticketURL: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

export const EventsManager = () => {
  const { data: events, loading, refetch } = useCollection(COLLECTIONS.EVENTS, [orderBy('date', 'desc')]);
  const { create, update, remove } = useFirestoreCRUD(COLLECTIONS.EVENTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      ticketURL: '',
    },
  });

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setShowForm(true);

    // Convert Firestore Timestamp to YYYY-MM-DD format for date input
    let dateString = '';
    if (event.date) {
      const dateObj = event.date.toDate ? event.date.toDate() : new Date(event.date);
      dateString = dateObj.toISOString().split('T')[0];
    }

    reset({
      title: event.title || '',
      date: dateString,
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      ticketURL: event.ticketURL || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await remove(id);
      await refetch();
    }
  };

  const onSubmit = async (data: EventFormData) => {
    setSaving(true);

    try {
      // Convert date string to Date object for Firestore
      // The date input provides a string in format: YYYY-MM-DD
      const eventDate = new Date(data.date);

      // Validate the date is valid
      if (isNaN(eventDate.getTime())) {
        console.error('Invalid date:', data.date);
        alert('Invalid event date. Please select a valid date.');
        setSaving(false);
        return;
      }

      const eventData = {
        ...data,
        date: eventDate,
      };

      if (editingId) {
        await update(editingId, eventData);
      } else {
        await create(eventData);
      }
      await refetch();
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading events..." />;
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
                <h1 className="font-display text-2xl font-bold text-white">
                  Events Manager
                </h1>
                <p className="text-sm text-white/80">
                  Manage upcoming performances and events
                </p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Event
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
                  {editingId ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-grey-dark" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Event Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="input-field"
                    placeholder="Concert at Carnegie Hall"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-2">
                      Date *
                    </label>
                    <input
                      {...register('date')}
                      type="date"
                      className="input-field"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-2">
                      Time
                    </label>
                    <input
                      {...register('time')}
                      type="text"
                      className="input-field"
                      placeholder="7:30 PM"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Location
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="input-field"
                    placeholder="Carnegie Hall, New York, NY"
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
                    placeholder="Brief description of the event..."
                  />
                </div>

                {/* Ticket URL */}
                <div>
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Ticket URL
                  </label>
                  <input
                    {...register('ticketURL')}
                    type="url"
                    className="input-field"
                    placeholder="https://tickets.example.com"
                  />
                  {errors.ticketURL && (
                    <p className="mt-1 text-sm text-red-400">{errors.ticketURL.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn-secondary"
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

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events && events.length > 0 ? (
            events.map((event: any, index: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group relative"
              >
                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-grey-dark text-white px-3 py-2 rounded-lg text-center">
                  {event.date && (() => {
                    const dateObj = event.date.toDate ? event.date.toDate() : new Date(event.date);
                    return (
                      <>
                        <div className="text-xs font-medium">
                          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-xl font-bold">
                          {dateObj.getDate()}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Content */}
                <div className="pr-20">
                  <h3 className="font-display text-lg font-bold text-grey-dark mb-2">
                    {event.title}
                  </h3>

                  {event.time && (
                    <div className="flex items-center gap-2 text-sm text-grey mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-grey mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.description && (
                    <p className="text-sm text-grey mb-3 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  {event.ticketURL && (
                    <a
                      href={event.ticketURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-grey-dark hover:underline"
                    >
                      Get Tickets
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 p-2 bg-grey-dark rounded-lg hover:bg-grey transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
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
              <Calendar className="w-16 h-16 text-grey mx-auto mb-4" />
              <p className="text-grey">No events added yet. Click "Add Event" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventsManager;
