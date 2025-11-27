import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocialLinks } from '../../hooks/useFirestore';
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Github, Music } from 'lucide-react';

const getSocialIcon = (platform: string) => {
  const iconClass = "w-5 h-5";
  const platformLower = platform.toLowerCase();

  switch (platformLower) {
    case 'facebook':
      return <Facebook className={iconClass} />;
    case 'instagram':
      return <Instagram className={iconClass} />;
    case 'youtube':
      return <Youtube className={iconClass} />;
    case 'twitter':
    case 'x':
      return <Twitter className={iconClass} />;
    case 'linkedin':
      return <Linkedin className={iconClass} />;
    case 'github':
      return <Github className={iconClass} />;
    case 'spotify':
    case 'apple music':
    case 'soundcloud':
      return <Music className={iconClass} />;
    default:
      return <Music className={iconClass} />;
  }
};

export const Footer = () => {
  const { data: socialLinks } = useSocialLinks();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Music', path: '/music' },
    { name: 'Videos', path: '/videos' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl font-bold text-primary-700 dark:text-primary-300">
              Maria Skidmore
            </h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary max-w-xs">
              Violinist, Pianist, Music Director - Bringing classical music to life through performance and education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
              Connect
            </h4>
            {socialLinks && socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-primary-600 dark:hover:bg-primary-500 text-gray-700 dark:text-dark-text-primary hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </motion.a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                Follow me on social media for updates
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary text-center sm:text-left">
              &copy; {currentYear} Maria Skidmore. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/admin"
                className="text-xs text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
