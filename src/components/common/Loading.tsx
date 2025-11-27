import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

export const Loading = ({ size = 'medium', fullScreen = false, message }: LoadingProps) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  const dotSize = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const dotTransition: any = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  };

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`flex gap-2 items-center justify-center ${sizeClasses[size]}`}
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSize[size]} bg-primary-600 dark:bg-primary-400 rounded-full`}
            variants={dotVariants}
            transition={dotTransition}
          />
        ))}
      </motion.div>
      {message && (
        <motion.p
          className="text-sm text-text-secondary dark:text-dark-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-background dark:bg-dark-background flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingAnimation />
      </motion.div>
    );
  }

  return <LoadingAnimation />;
};

export default Loading;
