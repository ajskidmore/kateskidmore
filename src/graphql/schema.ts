import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    date: String!
    time: String
    location: String
    description: String
    ticketURL: String
  }

  type Post {
    id: ID!
    title: String!
    excerpt: String
    content: String!
    imageURL: String
    published: Boolean!
    publishDate: String!
    tags: [String!]
  }

  type Music {
    id: ID!
    title: String!
    artist: String
    album: String
    releaseDate: String
    coverImageURL: String
    spotifyURL: String
    appleMusicURL: String
    youtubeURL: String
  }

  type Video {
    id: ID!
    title: String!
    description: String
    thumbnailURL: String
    videoURL: String!
    publishDate: String
  }

  type Profile {
    id: ID!
    name: String!
    title: String
    bio: String
    tagline: String
    photoURL: String
    profileImageURL: String
  }

  type FeaturedContent {
    upcomingEvents: [Event!]!
    recentPosts: [Post!]!
    featuredMusic: [Music!]!
    profile: Profile
  }

  type Query {
    # Get featured content for home page
    getFeaturedContent(
      eventsLimit: Int
      postsLimit: Int
      musicLimit: Int
    ): FeaturedContent!

    # Individual queries
    getUpcomingEvents(limit: Int): [Event!]!
    getRecentPosts(limit: Int): [Post!]!
    getFeaturedMusic(limit: Int): [Music!]!
    getProfile: Profile
  }
`;

export default typeDefs;
