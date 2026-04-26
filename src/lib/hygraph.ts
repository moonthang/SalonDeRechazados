import { GraphQLClient, gql } from 'graphql-request';
import type { Post } from './types';

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_TOKEN;

if (!endpoint) {
  throw new Error('Hygraph endpoint is not configured in environment variables.');
}

const client = new GraphQLClient(endpoint, {
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const PostsQuery = gql`
  query GetPosts($limit: Int) {
    posts(orderBy: publishedAt_DESC, first: $limit) {
      slug
      title
      publishedAt
      excerpt
      coverImage {
        url
      }
      tags
    }
  }
`;

const PostBySlugQuery = gql`
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }) {
      slug
      title
      publishedAt
      coverImage {
        url
      }
      content {
        html
      }
      tags
    }
  }
`;

const SlugsQuery = gql`
    query GetSlugs {
        posts {
            slug
        }
    }
`

export async function getPosts(limit?: number): Promise<Post[]> {
  try {
    const { posts } = await client.request<{ posts: Post[] }>(PostsQuery, { limit });
    return posts;
  } catch (error) {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { post } = await client.request<{ post: Post | null }> (PostBySlugQuery, { slug });
    return post;
  } catch (error) {
    return null;
  }
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
    try {
        const { posts } = await client.request<{ posts: { slug: string }[] }>(SlugsQuery);
        return posts;
    } catch (error) {
        return [];
    }
}
