import { motion } from 'framer-motion';
import { useUpcomingEvents, usePastEvents } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export const Events = () => {
  const { data: upcomingEvents, loading: loadingUpcoming } = useUpcomingEvents();
  const { data: pastEvents, loading: loadingPast } = usePastEvents();

  if (loadingUpcoming && loadingPast) {
    return <Loading fullScreen message="Loading events..." />;
  }

  const EventCard = ({ event, index }: { event: any; index: number }) => (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-20 h-20 bg-primary-500 text-white rounded-lg flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">
            {event.date?.toDate ? new Date(event.date.toDate()).getDate() : ''}
          </span>
          <span className="text-xs uppercase">
            {event.date?.toDate
              ? new Date(event.date.toDate()).toLocaleDateString('en-US', { month: 'short' })
              : ''}
          </span>
        </div>

        {/* Event Details */}
        <div className="flex-grow">
          <h3 className="font-display text-2xl font-bold text-dark-text-primary mb-2">
            {event.title}
          </h3>

          <div className="flex flex-col gap-2 mb-4 text-sm text-dark-text-secondary">
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.date.toDate())}</span>
              </div>
            )}

            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-dark-text-secondary mb-4">
              {event.description}
            </p>
          )}

          {event.ticketURL && (
            <a
              href={event.ticketURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              Get Tickets
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-primary-200 mb-4">
            Events
          </h1>
          <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
            Join me for upcoming performances and events
          </p>
        </motion.div>

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-dark-text-primary mb-8">
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <div>
            <h2 className="font-display text-3xl font-bold text-dark-text-primary mb-8">
              Past Events
            </h2>
            <div className="space-y-6 opacity-75">
              {pastEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}

        {(!upcomingEvents || upcomingEvents.length === 0) &&
          (!pastEvents || pastEvents.length === 0) && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-dark-text-secondary">
                No events scheduled at this time. Check back soon!
              </p>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default Events;
