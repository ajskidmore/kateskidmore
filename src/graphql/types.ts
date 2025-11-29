// GraphQL Types
export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  ticketURL?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  imageURL?: string;
  published: boolean;
  publishDate: string;
  tags?: string[];
}

export interface Music {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  releaseDate?: string;
  coverImageURL?: string;
  spotifyURL?: string;
  appleMusicURL?: string;
  youtubeURL?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailURL?: string;
  videoURL: string;
  publishDate?: string;
}

export interface Profile {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  tagline?: string;
  photoURL?: string;
  profileImageURL?: string;
}

export interface FeaturedContent {
  upcomingEvents: Event[];
  recentPosts: Post[];
  featuredMusic: Music[];
  profile?: Profile;
}

export interface GetFeaturedContentData {
  getFeaturedContent: FeaturedContent;
}

export interface GetFeaturedContentVars {
  eventsLimit?: number;
  postsLimit?: number;
  musicLimit?: number;
}
