import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={37}
            priority
          />
          <h1 className="text-5xl font-bold mb-4">Learn Next.js</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            From Beginner to Advanced - A Comprehensive Learning Project
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Getting Started */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-3">📚 Getting Started</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This project is set up with Next.js 16, TypeScript, and Tailwind CSS. 
              Check the README for comprehensive learning content.
            </p>
            <a 
              href="https://github.com/thanhnlh/learn-nextjs-again/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read the README →
            </a>
          </div>

          {/* Examples */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-3">🎯 Interactive Examples</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Explore hands-on examples demonstrating key Next.js features 
              like routing, API routes, and client components.
            </p>
            <Link 
              href="/examples"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Examples →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Explore the Project</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/about"
              className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn about this project
              </p>
            </Link>

            <Link 
              href="/blog"
              className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-bold mb-2">Blog</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Example blog with dynamic routes
              </p>
            </Link>

            <Link 
              href="/examples"
              className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center"
            >
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold mb-2">Examples</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive feature demos
              </p>
            </Link>
          </div>
        </div>

        {/* Learning Path */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Learning Path</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold mb-1">Beginner Topics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start with routing, layouts, navigation, and basic components
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold mb-1">Intermediate Topics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn data fetching, API routes, forms, and styling
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold mb-1">Advanced Topics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Master SSR, SSG, ISR, middleware, and performance optimization
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Official Resources</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
            >
              Next.js Docs
            </a>
            <a
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Interactive Tutorial
            </a>
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              React Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

