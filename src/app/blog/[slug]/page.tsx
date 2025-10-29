import { Metadata } from 'next'
import Link from 'next/link'

// This would normally come from a database or CMS
const blogPosts: Record<string, { title: string; content: string; date: string }> = {
  'getting-started': {
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework that makes building web applications easier...',
    date: '2024-01-01',
  },
  'routing-basics': {
    title: 'Understanding Next.js Routing',
    content: 'Next.js uses a file-based routing system that automatically creates routes based on your file structure...',
    date: '2024-01-15',
  },
  'data-fetching': {
    title: 'Data Fetching Strategies',
    content: 'Next.js provides several ways to fetch data: Server-side Rendering (SSR), Static Site Generation (SSG), and more...',
    date: '2024-02-01',
  },
}

type Props = {
  params: { slug: string }
}

// Generate static paths for all blog posts (SSG)
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug]
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - Learn Next.js Blog`,
    description: post.content.substring(0, 155),
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts[params.slug]

  if (!post) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>
      
      <article>
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{post.date}</p>
        <div className="prose dark:prose-invert">
          <p>{post.content}</p>
        </div>
      </article>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <p className="font-mono text-sm mb-2">
          📁 File: <code>src/app/blog/[slug]/page.tsx</code>
        </p>
        <p className="font-mono text-sm">
          🔧 This demonstrates:
        </p>
        <ul className="list-disc list-inside font-mono text-sm mt-2 space-y-1">
          <li>Dynamic routes with [slug]</li>
          <li>generateStaticParams for SSG</li>
          <li>Dynamic metadata generation</li>
        </ul>
      </div>
    </div>
  )
}
