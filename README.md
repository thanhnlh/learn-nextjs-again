# Learn Next.js - From Beginner to Advanced

A comprehensive learning project for mastering Next.js, covering everything from basic concepts to advanced topics. This project uses Next.js 16 with the App Router, TypeScript, and Tailwind CSS.

## Table of Contents

- [Getting Started](#getting-started)
- [Part 1: Beginner Topics](#part-1-beginner-topics)
- [Part 2: Intermediate Topics](#part-2-intermediate-topics)
- [Part 3: Advanced Topics](#part-3-advanced-topics)
- [Part 4: Best Practices](#part-4-best-practices)
- [Additional Resources](#additional-resources)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Basic knowledge of React, JavaScript/TypeScript, HTML, and CSS

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Other Commands

```bash
npm run lint    # Run ESLint
```

---

## Part 1: Beginner Topics

### 1.1 What is Next.js?

Next.js is a React framework that provides:
- **Server-Side Rendering (SSR)**: Render pages on the server
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **File-based Routing**: Automatic routing based on file structure
- **API Routes**: Build backend APIs within your Next.js app
- **Built-in Optimization**: Image, font, and script optimization
- **TypeScript Support**: First-class TypeScript support

### 1.2 App Router vs Pages Router

This project uses the **App Router** (recommended for new projects):
- Introduced in Next.js 13+
- Uses the `app/` directory
- Built on React Server Components
- Better layouts and nested routes
- Improved data fetching

The older **Pages Router** uses the `pages/` directory and is still supported.

### 1.3 Project Structure

```
learn-nextjs-again/
├── src/
│   └── app/              # App Router directory
│       ├── layout.tsx    # Root layout (wraps all pages)
│       ├── page.tsx      # Home page (/)
│       ├── globals.css   # Global styles
│       └── favicon.ico   # Favicon
├── public/               # Static assets
├── node_modules/         # Dependencies
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

### 1.4 Routing Basics

Next.js uses file-system based routing:

```
app/
├── page.tsx           # / (home page)
├── about/
│   └── page.tsx       # /about
├── blog/
│   ├── page.tsx       # /blog
│   └── [slug]/
│       └── page.tsx   # /blog/[slug] (dynamic route)
└── dashboard/
    ├── layout.tsx     # Layout for dashboard section
    └── page.tsx       # /dashboard
```

**Creating a new page:**

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <h1>About Page</h1>
}
```

### 1.5 Layouts

Layouts wrap multiple pages and preserve state on navigation:

```tsx
// app/layout.tsx (Root Layout)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Nested Layouts:**

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      {children}
    </div>
  )
}
```

### 1.6 Links and Navigation

Use the `<Link>` component for client-side navigation:

```tsx
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  )
}
```

**Programmatic Navigation:**

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()
  
  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

### 1.7 Images

Use the `<Image>` component for automatic image optimization:

```tsx
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={500}
      priority // Load immediately for above-the-fold images
    />
  )
}
```

### 1.8 Metadata and SEO

Add metadata to improve SEO:

```tsx
// app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Learning Next.js from beginner to advanced',
}

export default function Page() {
  return <h1>Home Page</h1>
}
```

**Dynamic Metadata:**

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Post: ${params.slug}`,
  }
}
```

---

## Part 2: Intermediate Topics

### 2.1 Dynamic Routes

Create dynamic routes using square brackets:

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Blog Post: {params.slug}</h1>
}
```

**Catch-all Routes:**

```tsx
// app/shop/[...slug]/page.tsx
// Matches /shop/a, /shop/a/b, /shop/a/b/c, etc.
export default function ShopPage({ params }: { params: { slug: string[] } }) {
  return <div>Category: {params.slug.join('/')}</div>
}
```

### 2.2 Data Fetching

#### Server Components (Default)

Fetch data directly in Server Components:

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

#### Client Components

Use 'use client' directive for client-side rendering:

```tsx
'use client'
import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <div>{data && JSON.stringify(data)}</div>
}
```

### 2.3 API Routes

Create backend APIs in the `app/api/` directory:

```tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  const data = await request.json()
  return NextResponse.json({ received: data })
}
```

**Dynamic API Routes:**

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await fetchUser(params.id)
  return NextResponse.json(user)
}
```

### 2.4 Loading UI

Create loading states with `loading.tsx`:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>
}
```

### 2.5 Error Handling

Handle errors with `error.tsx`:

```tsx
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### 2.6 Styling Options

#### Tailwind CSS (Included)

```tsx
export default function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Click me
    </button>
  )
}
```

#### CSS Modules

```tsx
// app/components/Button.module.css
.button {
  background-color: blue;
  color: white;
}

// app/components/Button.tsx
import styles from './Button.module.css'

export default function Button() {
  return <button className={styles.button}>Click me</button>
}
```

### 2.7 Environment Variables

Create `.env.local` for environment variables:

```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

Access in code:

```tsx
// Server-side only
const dbUrl = process.env.DATABASE_URL

// Client-side (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### 2.8 Forms and Mutations

Use Server Actions for form handling:

```tsx
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // Save to database
  return { success: true }
}

// app/new-post/page.tsx
import { createPost } from '../actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" type="text" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

---

## Part 3: Advanced Topics

### 3.1 Rendering Strategies

#### Static Site Generation (SSG)

Default for Server Components without dynamic data:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Post({ params }) {
  const post = await fetchPost(params.slug)
  return <article>{post.content}</article>
}
```

#### Server-Side Rendering (SSR)

Force dynamic rendering:

```tsx
// app/posts/page.tsx
export const dynamic = 'force-dynamic'

export default async function Posts() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // Disable caching
  }).then(res => res.json())
  
  return <div>{/* render posts */}</div>
}
```

#### Incremental Static Regeneration (ISR)

Revalidate static pages after a time period:

```tsx
export default async function Posts() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then(res => res.json())
  
  return <div>{/* render posts */}</div>
}
```

**On-Demand Revalidation:**

```tsx
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST() {
  revalidatePath('/posts')
  return Response.json({ revalidated: true })
}
```

### 3.2 Middleware

Create middleware for request processing:

```tsx
// middleware.ts (in root directory)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add custom header
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'value')
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

### 3.3 Parallel Routes

Load multiple pages simultaneously:

```
app/
└── dashboard/
    ├── @analytics/
    │   └── page.tsx
    ├── @team/
    │   └── page.tsx
    └── layout.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {analytics}
      {team}
    </>
  )
}
```

### 3.4 Intercepting Routes

Intercept navigation to display modals:

```
app/
├── photos/
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (..)photos/
        └── [id]/
            └── page.tsx
```

### 3.5 Streaming and Suspense

Stream UI as data loads:

```tsx
import { Suspense } from 'react'

async function SlowComponent() {
  const data = await fetchSlowData()
  return <div>{data}</div>
}

export default function Page() {
  return (
    <div>
      <h1>Page Title</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
```

### 3.6 Server Actions

Server-side functions callable from client:

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function updateUser(formData: FormData) {
  const name = formData.get('name')
  await db.users.update({ name })
  revalidatePath('/users')
  return { success: true }
}

// app/profile/page.tsx
'use client'
import { updateUser } from '../actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Save</button>
}

export default function Profile() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <SubmitButton />
    </form>
  )
}
```

### 3.7 Route Handlers

Advanced API route patterns:

```tsx
// app/api/posts/route.ts
import { NextRequest } from 'next/server'
import { headers, cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Access headers
  const headersList = await headers()
  const authorization = headersList.get('authorization')
  
  // Access cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  
  // URL parameters
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  
  return Response.json({ query })
}
```

### 3.8 Optimizations

#### Image Optimization

```tsx
import Image from 'next/image'

// Remote images
<Image
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// Responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ objectFit: 'cover' }}
/>
```

#### Font Optimization

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

#### Script Optimization

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        strategy="lazyOnload" // or 'beforeInteractive' or 'afterInteractive'
        onLoad={() => console.log('Script loaded')}
      />
    </>
  )
}
```

### 3.9 Internationalization (i18n)

```tsx
// middleware.ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'es', 'fr']

function getLocale(request: Request) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, 'en')
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request)
  const pathname = request.nextUrl.pathname
  
  if (!locales.some(loc => pathname.startsWith(`/${loc}`))) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
}
```

### 3.10 Authentication

Example with NextAuth.js:

```bash
npm install next-auth
```

```tsx
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }

// app/components/LoginButton.tsx
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  const { data: session } = useSession()
  
  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>
  }
  return <button onClick={() => signIn()}>Sign in</button>
}
```

---

## Part 4: Best Practices

### 4.1 File Organization

```
src/
├── app/
│   ├── (marketing)/        # Route groups (don't affect URL)
│   │   ├── about/
│   │   └── contact/
│   ├── (shop)/
│   │   ├── products/
│   │   └── cart/
│   └── api/
├── components/             # Reusable components
│   ├── ui/                # UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── constants/             # Constants and configs
```

### 4.2 Performance Best Practices

1. **Use Server Components by default** - Only use Client Components when needed
2. **Optimize Images** - Always use `next/image`
3. **Lazy Load Components** - Use dynamic imports for large components
4. **Minimize Client-Side JavaScript** - Keep bundle size small
5. **Use Streaming** - Show content as it loads with Suspense
6. **Implement Caching** - Use ISR and proper cache headers
7. **Analyze Bundle** - Use `@next/bundle-analyzer`

```tsx
// Dynamic import for code splitting
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering if needed
})
```

### 4.3 SEO Best Practices

1. **Add Metadata** - Use metadata API for all pages
2. **Generate Sitemaps** - Create `sitemap.ts` for dynamic sitemaps
3. **Implement Robots.txt** - Create `robots.ts`
4. **Use Semantic HTML** - Proper heading hierarchy
5. **Optimize Images** - Include alt text
6. **Implement Structured Data** - Add JSON-LD for rich snippets

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}

// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

### 4.4 TypeScript Tips

```tsx
// Define prop types
interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Use for pages
export default async function Page({ params, searchParams }: PageProps) {
  // ...
}

// Create reusable types
type User = {
  id: string
  name: string
  email: string
}

// Use generics for API responses
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}
```

### 4.5 Testing

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

```tsx
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### 4.6 Security Best Practices

1. **Validate User Input** - Always sanitize and validate
2. **Use Environment Variables** - Never commit secrets
3. **Implement CSRF Protection** - Use Server Actions tokens
4. **Set Security Headers** - Configure in `next.config.ts`
5. **Keep Dependencies Updated** - Regular `npm audit`

```ts
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

---

## Additional Resources

### Official Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Comprehensive Next.js docs
- [React Documentation](https://react.dev) - React fundamentals
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript guide

### Learning Platforms

- [Next.js Learn](https://nextjs.org/learn) - Official interactive tutorial
- [Vercel Guides](https://vercel.com/guides) - Deployment and optimization guides
- [Web.dev](https://web.dev) - Web performance best practices

### Community

- [Next.js GitHub](https://github.com/vercel/next.js) - Source code and issues
- [Next.js Discord](https://discord.gg/nextjs) - Community chat
- [Next.js Discussions](https://github.com/vercel/next.js/discussions) - Q&A forum

### Tools and Libraries

- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Next Auth](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [tRPC](https://trpc.io/) - Type-safe APIs
- [React Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://github.com/pmndrs/zustand) - State management

### Performance Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [Next.js Analytics](https://vercel.com/analytics) - Real User Monitoring
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) - Analyze bundle size

---

## Project Roadmap

As you progress through this learning journey, try building:

### Beginner Projects
- [ ] Personal portfolio website
- [ ] Simple blog with static content
- [ ] Landing page with contact form

### Intermediate Projects
- [ ] Blog with CMS integration (Contentful, Sanity)
- [ ] E-commerce product catalog
- [ ] Dashboard with charts and data visualization

### Advanced Projects
- [ ] Full-stack SaaS application
- [ ] Multi-tenant application
- [ ] Real-time chat application
- [ ] Social media platform

---

## Contributing

This is a learning project. Feel free to:
- Add new examples
- Improve documentation
- Fix issues
- Share your learning notes

---

## License

MIT License - Feel free to use this project for learning purposes.

---

**Happy Learning! 🚀**

Start with the basics, practice regularly, and gradually move to advanced topics. Remember: the best way to learn is by building real projects!
