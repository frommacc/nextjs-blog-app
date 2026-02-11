'use server'

import { api } from '@/convex/_generated/api'

import { getToken } from '@/lib/auth-server'
import { createBlogSchema } from '@/lib/schemas/blog'
import { fetchMutation } from 'convex/nextjs'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod'

// CreateBlog Action
export async function createBlogAction(
  values: z.infer<typeof createBlogSchema>,
) {
  try {
    const parsed = createBlogSchema.safeParse(values)

    if (!parsed.success) {
      throw new Error('Invalid data!')
    }

    const token = await getToken()

    if (!token) {
      throw new Error('Unauthorized!')
    }

    const imageUrl = await fetchMutation(
      api.blogs.generateImageUploadUrl,
      {},
      { token },
    )

    const uploadResult = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.data.image.type,
      },
      body: parsed.data.image,
    })

    if (!uploadResult.ok) {
      return { error: 'Failed to upload image' }
    }

    const { storageId } = await uploadResult.json()

    await fetchMutation(
      api.blogs.createBlog,
      {
        content: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      { token },
    )
  } catch {
    return { error: 'Failed to create Blog Post' }
  }

  updateTag('blog-list')
  return redirect('/blog')
}
