import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Learn Next.js',
  description: 'Learn about this Next.js learning project',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">About This Project</h1>
      <p className="text-lg mb-4">
        This is a demonstration of Next.js routing. This page is located at{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          src/app/about/page.tsx
        </code>
      </p>
      <p className="text-lg mb-4">
        The file-based routing system automatically creates a route at <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/about</code> based on the directory structure.
      </p>
      <h2 className="text-2xl font-bold mb-2 mt-8">Static Metadata</h2>
      <p className="text-lg">
        Notice how we have added metadata to this page using the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">metadata</code> export. 
        This helps with SEO and social sharing.
      </p>
    </div>
  )
}
