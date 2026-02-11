import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { Metadata } from 'next'
// import { cacheLife, cacheTag } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Blog | Next.js + Convex Starter',
  description:
    'Read our latest blog posts on Next.js and Convex, featuring insights, tutorials, and updates from our team.',
  category: 'Web Development',
}

// export const dynamic = 'force-static'
// export const revalidate = 1 * 60 * 60

export default function BlogPage() {
  return (
    <div className='py-12'>
      <div className='text-center pb-12'>
        <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Our Blog
        </h1>
        <p className='pt-4 max-w-2xl mx-auto text-xl text-muted-foreground'>
          Insights, thoughts, and trends from out team.{' '}
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUi />}>
        <BlogList />
      </Suspense>
    </div>
  )
}

async function BlogList() {
  // 'use cache'
  // cacheLife('hours')
  // cacheTag('blog-list')
  await connection()
  const blogs = await fetchQuery(api.blogs.getBlogs)

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {blogs?.map((blog) => (
        <Card key={blog._id} className='pt-0'>
          <div className='relative w-full h-48 overflow-hidden'>
            <Image
              src={
                blog.imageUrl ??
                'https://images.unsplash.com/photo-1770567351994-dd4a743ab1e6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt={blog.title}
              fill
              className='object-cover rounded-t-lg overflow-hidden'
            />
          </div>

          <CardContent>
            <Link href={`/blog/${blog._id}`}>
              <h1 className='text-2xl font-bold hover:text-primary'>
                {blog.title}
              </h1>
            </Link>
            <p className='text-muted-foreground line-clamp-3'>{blog.content}</p>
          </CardContent>
          <CardFooter>
            <Link
              className={buttonVariants({
                className: 'w-full',
              })}
              href={`/blog/${blog._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// SKELETON
function SkeletonLoadingUi() {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='flex flex-col space-y-3'>
          <Skeleton className='h-48 w-full rounded-xl' />
          <div className='space-y-2 flex flex-col'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>
      ))}
    </div>
  )
}
