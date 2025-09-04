import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  content: string;
  excerpt?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
}

export function getSortedPostsData(): BlogPostMeta[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    // Get file names under /content/blog
    const fileNames = fs.readdirSync(postsDirectory);
    const markdownFiles = fileNames.filter(name => name.endsWith('.md'));
    
    if (markdownFiles.length === 0) {
      return [];
    }

    const allPostsData = markdownFiles.map((fileName) => {
      // Remove ".md" from file name to get id
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Ensure required fields exist
      const postData = {
        slug,
        title: matterResult.data.title || 'Untitled',
        description: matterResult.data.description || '',
        date: matterResult.data.date || new Date().toISOString(),
        author: matterResult.data.author || 'Anonymous',
        tags: Array.isArray(matterResult.data.tags) ? matterResult.data.tags : [],
        readTime: matterResult.data.readTime || '5 min',
      };

      return postData;
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export function getAllPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    const markdownFiles = fileNames.filter(name => name.endsWith('.md'));
    return markdownFiles.map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading post slugs:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<BlogPost> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post not found: ${slug}`);
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
      slug,
      content: contentHtml,
      title: matterResult.data.title || 'Untitled',
      description: matterResult.data.description || '',
      date: matterResult.data.date || new Date().toISOString(),
      author: matterResult.data.author || 'Anonymous',
      tags: Array.isArray(matterResult.data.tags) ? matterResult.data.tags : [],
      readTime: matterResult.data.readTime || '5 min',
    };
  } catch (error) {
    console.error('Error reading post data:', error);
    throw error;
  }
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getSortedPostsData();
  return allPosts.filter(post => post.tags.includes(tag));
}

export function getAllTags(): string[] {
  const allPosts = getSortedPostsData();
  const tags = allPosts.flatMap(post => post.tags);
  // Corrigir compatibilidade do TypeScript
  const uniqueTags = Array.from(new Set(tags));
  return uniqueTags;
}
