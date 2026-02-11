'use client'
import { useTransition } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Loader2, MessageSquare } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '@/lib/schemas/comment'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import z from 'zod'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'

const CommentSection = ({
  preloadedComments,
}: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>
}) => {
  const params = useParams<{ postId: Id<'blogs'> }>()

  const comments = usePreloadedQuery(preloadedComments)

  const [isPending, startTransition] = useTransition()

  const createComment = useMutation(api.comments.createComment)

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: '',
      postId: params.postId,
    },
  })

  function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data)
        form.reset()
        toast.success('Comment added successfully')
      } catch {
        toast.error('Failed to add comment')
      }
    })
  }

  if (comments === undefined) {
    return <p>loading...</p>
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center gap-2 border-b'>
        <MessageSquare className='size-5' />
        <h2 className='text-xl font-bold'>{comments.length} comments</h2>
      </CardHeader>
      <CardContent className='space-y-8'>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name='comment'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Your Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder='Share your thoughts'
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button disabled={isPending}>
            {isPending ? <Loader2 /> : 'Comment'}
          </Button>
        </form>
        {comments?.length > 0 && <Separator />}
        {/* RENDER COMMENTS */}
        <section className='space-y-6'>
          {comments?.map((comment) => (
            <div key={comment._id} className='flex gap-4'>
              <Avatar className='size-10 shrink-0'>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-sm'>{comment.authorName}</p>
                  <p className='text-muted-foreground text-xs'>
                    {new Date(comment._creationTime).toLocaleDateString(
                      'en-US',
                    )}
                  </p>
                </div>
                <p className='text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed'>
                  {comment.comment}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  )
}

export default CommentSection
