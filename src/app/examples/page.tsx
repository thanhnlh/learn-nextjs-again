'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ApiResponse {
  message?: string
  timestamp?: string
  info?: string
  receivedData?: unknown
  error?: string
}

export default function ExamplesPage() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchFromAPI = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hello')
      const data = await res.json()
      setApiResponse(data)
    } catch {
      setApiResponse({ error: 'Failed to fetch' })
    } finally {
      setLoading(false)
    }
  }

  const postToAPI = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ example: 'data', from: 'client' }),
      })
      const data = await res.json()
      setApiResponse(data)
    } catch {
      setApiResponse({ error: 'Failed to post' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Next.js Examples</h1>
      
      <div className="space-y-8">
        {/* Navigation Example */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">1. Navigation with Link Component</h2>
          <p className="mb-4">
            The Link component provides client-side navigation with automatic prefetching:
          </p>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Home
            </Link>
            <Link 
              href="/about"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              About Page
            </Link>
            <Link 
              href="/blog"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Blog List
            </Link>
          </div>
        </section>

        {/* Image Optimization Example */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">2. Image Optimization</h2>
          <p className="mb-4">
            Next.js automatically optimizes images with the Image component:
          </p>
          <div className="flex gap-4 items-start">
            <div className="text-center">
              <Image 
                src="/next.svg" 
                alt="Next.js Logo" 
                width={180} 
                height={37}
                className="dark:invert"
              />
              <p className="text-sm mt-2">Optimized with next/image</p>
            </div>
            <div className="text-center">
              <Image 
                src="/vercel.svg" 
                alt="Vercel Logo" 
                width={180} 
                height={37}
                className="dark:invert"
              />
              <p className="text-sm mt-2">Auto-optimized & lazy-loaded</p>
            </div>
          </div>
        </section>

        {/* API Routes Example */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">3. API Routes</h2>
          <p className="mb-4">
            Next.js allows you to create API endpoints in the app/api directory:
          </p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={fetchFromAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              GET Request
            </button>
            <button
              onClick={postToAPI}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              POST Request
            </button>
          </div>
          {loading && <p>Loading...</p>}
          {apiResponse && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* Client Component Example */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">4. Client Components</h2>
          <p className="mb-4">
            This entire page is a Client Component (uses &apos;use client&apos; directive) 
            because it has interactive state and event handlers.
          </p>
          <Counter />
        </section>

        {/* Styling Example */}
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">5. Tailwind CSS Styling</h2>
          <p className="mb-4">
            This project uses Tailwind CSS for styling. Notice the utility classes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-center">
              <span className="font-bold">Red Box</span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded text-center">
              <span className="font-bold">Blue Box</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded text-center">
              <span className="font-bold">Green Box</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setCount(count - 1)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        -
      </button>
      <span className="text-2xl font-bold">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        +
      </button>
    </div>
  )
}
