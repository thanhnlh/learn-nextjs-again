import Link from 'next/link'

// Example blog posts data
const posts = [
  { slug: 'getting-started', title: 'Getting Started with Next.js', date: '2024-01-01' },
  { slug: 'routing-basics', title: 'Understanding Next.js Routing', date: '2024-01-15' },
  { slug: 'data-fetching', title: 'Data Fetching Strategies', date: '2024-02-01' },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <p className="text-lg mb-8">
        This page demonstrates a list of blog posts with links to individual post pages using dynamic routes.
      </p>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <Link href={`/blog/${post.slug}`} className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:underline">
              {post.title}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{post.date}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <p className="font-mono text-sm">
          💡 Try clicking on any post title to navigate to the dynamic route at /blog/[slug]
        </p>
      </div>
    </div>
  )
}
