import { gql } from '@apollo/client';

export const GET_FEATURED_CONTENT = gql`
  query GetFeaturedContent($eventsLimit: Int, $postsLimit: Int, $musicLimit: Int) {
    getFeaturedContent(
      eventsLimit: $eventsLimit
      postsLimit: $postsLimit
      musicLimit: $musicLimit
    ) {
      upcomingEvents {
        id
        title
        date
        time
        location
        description
        ticketURL
      }
      recentPosts {
        id
        title
        excerpt
        imageURL
        publishDate
        tags
      }
      featuredMusic {
        id
        title
        artist
        album
        coverImageURL
        spotifyURL
        appleMusicURL
        youtubeURL
      }
      profile {
        id
        name
        title
        bio
        tagline
      }
    }
  }
`;

export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents($limit: Int) {
    getUpcomingEvents(limit: $limit) {
      id
      title
      date
      time
      location
      description
      ticketURL
    }
  }
`;

export const GET_RECENT_POSTS = gql`
  query GetRecentPosts($limit: Int) {
    getRecentPosts(limit: $limit) {
      id
      title
      excerpt
      content
      imageURL
      publishDate
      tags
    }
  }
`;

export const GET_FEATURED_MUSIC = gql`
  query GetFeaturedMusic($limit: Int) {
    getFeaturedMusic(limit: $limit) {
      id
      title
      artist
      album
      releaseDate
      coverImageURL
      spotifyURL
      appleMusicURL
      youtubeURL
    }
  }
`;
