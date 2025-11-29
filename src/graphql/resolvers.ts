import { collection, getDocs, getDoc, query, orderBy, limit, where, Timestamp, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase';

// Helper to convert Firestore Timestamp to ISO string
const timestampToString = (timestamp: any): string => {
  if (!timestamp) return '';
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return new Date(timestamp).toISOString();
};

export const resolvers = {
  Query: {
    getFeaturedContent: async (_: any, args: { eventsLimit?: number; postsLimit?: number; musicLimit?: number }) => {
      const eventsLimit = args.eventsLimit || 3;
      const postsLimit = args.postsLimit || 3;
      const musicLimit = args.musicLimit || 3;

      // Load featured settings
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'featured');
      const settingsSnap = await getDoc(settingsRef);
      const settings = settingsSnap.exists() ? settingsSnap.data() : null;

      let upcomingEvents: any[] = [];
      let recentPosts: any[] = [];
      let featuredMusic: any[] = [];

      // Fetch featured events
      if (settings?.featuredEventIds && settings.featuredEventIds.length > 0) {
        const eventsRef = collection(db, COLLECTIONS.EVENTS);
        const eventsSnapshot = await getDocs(eventsRef);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        upcomingEvents = eventsSnapshot.docs
          .filter((docSnap) => settings.featuredEventIds.includes(docSnap.id))
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            date: timestampToString(docSnap.data().date),
          }))
          .filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
          })
          .slice(0, eventsLimit);
      } else {
        // Fallback: fetch upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventsRef = collection(db, COLLECTIONS.EVENTS);
        const eventsQuery = query(eventsRef, orderBy('date', 'asc'));
        const eventsSnapshot = await getDocs(eventsQuery);
        const allEvents = eventsSnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          date: timestampToString(docSnap.data().date),
        }));

        upcomingEvents = allEvents
          .filter((event: any) => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
          })
          .slice(0, eventsLimit);
      }

      // Fetch featured posts
      if (settings?.featuredPostIds && settings.featuredPostIds.length > 0) {
        const postsRef = collection(db, COLLECTIONS.POSTS);
        const postsSnapshot = await getDocs(postsRef);

        recentPosts = postsSnapshot.docs
          .filter((docSnap) => settings.featuredPostIds.includes(docSnap.id))
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            publishDate: timestampToString(docSnap.data().publishDate),
          }))
          .filter((post: any) => post.published)
          .slice(0, postsLimit);
      } else {
        // Fallback: fetch recent published posts
        const postsRef = collection(db, COLLECTIONS.POSTS);
        const postsQuery = query(postsRef, orderBy('publishDate', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);

        recentPosts = postsSnapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            publishDate: timestampToString(docSnap.data().publishDate),
          }))
          .filter((post: any) => post.published)
          .slice(0, postsLimit);
      }

      // Fetch featured music
      if (settings?.featuredMusicIds && settings.featuredMusicIds.length > 0) {
        const musicRef = collection(db, COLLECTIONS.MUSIC);
        const musicSnapshot = await getDocs(musicRef);

        featuredMusic = musicSnapshot.docs
          .filter((docSnap) => settings.featuredMusicIds.includes(docSnap.id))
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            releaseDate: timestampToString(docSnap.data().releaseDate),
          }))
          .slice(0, musicLimit);
      } else {
        // Fallback: fetch first music items
        const musicRef = collection(db, COLLECTIONS.MUSIC);
        const musicQuery = query(musicRef, limit(musicLimit));
        const musicSnapshot = await getDocs(musicQuery);

        featuredMusic = musicSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          releaseDate: timestampToString(docSnap.data().releaseDate),
        }));
      }

      // Fetch profile
      const profileRef = collection(db, COLLECTIONS.PROFILE);
      const profileSnapshot = await getDocs(profileRef);
      const profile = profileSnapshot.empty
        ? null
        : { id: profileSnapshot.docs[0].id, ...profileSnapshot.docs[0].data() };

      return {
        upcomingEvents,
        recentPosts,
        featuredMusic,
        profile,
      };
    },

    getUpcomingEvents: async (_: any, args: { limit?: number }) => {
      const eventsLimit = args.limit || 10;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventsRef = collection(db, COLLECTIONS.EVENTS);
      const eventsQuery = query(eventsRef, orderBy('date', 'asc'));
      const eventsSnapshot = await getDocs(eventsQuery);

      const allEvents = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: timestampToString(doc.data().date),
      }));

      return allEvents
        .filter((event: any) => new Date(event.date) >= today)
        .slice(0, eventsLimit);
    },

    getRecentPosts: async (_: any, args: { limit?: number }) => {
      const postsLimit = args.limit || 10;
      const postsRef = collection(db, COLLECTIONS.POSTS);
      const postsQuery = query(
        postsRef,
        where('published', '==', true),
        orderBy('publishDate', 'desc'),
        limit(postsLimit)
      );
      const postsSnapshot = await getDocs(postsQuery);

      return postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishDate: timestampToString(doc.data().publishDate),
      }));
    },

    getFeaturedMusic: async (_: any, args: { limit?: number }) => {
      const musicLimit = args.limit || 10;
      const musicRef = collection(db, COLLECTIONS.MUSIC);
      const musicQuery = query(musicRef, limit(musicLimit));
      const musicSnapshot = await getDocs(musicQuery);

      return musicSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: timestampToString(doc.data().releaseDate),
      }));
    },

    getProfile: async () => {
      const profileRef = collection(db, COLLECTIONS.PROFILE);
      const profileSnapshot = await getDocs(profileRef);

      if (profileSnapshot.empty) return null;

      return {
        id: profileSnapshot.docs[0].id,
        ...profileSnapshot.docs[0].data(),
      };
    },
  },
};

export default resolvers;
