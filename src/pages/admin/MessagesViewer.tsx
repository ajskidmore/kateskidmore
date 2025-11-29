import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User, MessageSquare, Clock, CheckCircle, Circle } from 'lucide-react';
import { useContactMessages, useFirestoreCRUD } from '../../hooks/useFirestore';
import { COLLECTIONS } from '../../firebase';
import Loading from '../../components/common/Loading';

export const MessagesViewer = () => {
  const { data: messages, loading, refetch } = useContactMessages();
  const { update } = useFirestoreCRUD(COLLECTIONS.CONTACT_MESSAGES);

  const toggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    await update(messageId, { isRead: !currentStatus });
    await refetch();
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';

    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading fullScreen message="Loading messages..." />;
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
                  Contact Messages
                </h1>
                <p className="text-sm text-white/80">
                  View and manage contact form submissions
                </p>
              </div>
            </div>
            {messages && messages.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-grey rounded-lg">
                <Mail className="w-5 h-5 text-grey-dark" />
                <span className="text-sm text-grey-dark">
                  {messages.filter((m: any) => !m.isRead).length} unread
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message: any, index: number) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card relative ${
                  !message.isRead
                    ? 'border-l-4 border-primary-500'
                    : 'border-l-4 border-transparent'
                }`}
              >
                {/* Unread Indicator */}
                {!message.isRead && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-grey-dark rounded-full animate-pulse" />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-grey rounded-lg">
                        <User className="w-5 h-5 text-grey-dark" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-grey-dark">
                          {message.name}
                        </h3>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-sm text-grey-dark hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                    </div>

                    {message.subject && (
                      <div className="flex items-center gap-2 text-sm text-grey-dark mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">Subject: {message.subject}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                  </div>

                  {/* Mark as Read/Unread Button */}
                  <button
                    onClick={() => toggleReadStatus(message.id, message.isRead)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      message.isRead
                        ? 'bg-grey hover:bg-grey-dark text-grey-dark'
                        : 'bg-grey-dark hover:bg-grey text-white'
                    }`}
                  >
                    {message.isRead ? (
                      <>
                        <Circle className="w-4 h-4" />
                        <span className="text-sm">Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Mark Read</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Message Content */}
                <div className="bg-gradient-grey rounded-lg p-4">
                  <p className="text-sm text-grey-dark whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20">
              <Mail className="w-16 h-16 text-grey mx-auto mb-4" />
              <p className="text-white/80">No messages yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessagesViewer;
