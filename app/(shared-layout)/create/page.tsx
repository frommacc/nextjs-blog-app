'use client'
import { createBlogAction } from '@/actions/blog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createBlogSchema } from '@/lib/schemas/blog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const CreatePage = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      image: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof createBlogSchema>) {
    startTransition(async () => {
      await createBlogAction(values)

      toast.success('Everything went well! Your blog post has been created.')
      router.push('/')
    })
  }

  return (
    <div className='py-12'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Create Post
        </h1>
        <p className='text-xl text-muted-foreground mt-4'>
          Share your thoughts with the big world!
        </p>
      </div>

      <Card className='w-full max-w-xl mx-auto'>
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className='gap-y-4'>
              {/* Title */}
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder='Super cool title'
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Content */}
              <Controller
                name='content'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder='Super cool blog content'
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Image */}
              <Controller
                name='image'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      type='file'
                      aria-invalid={fieldState.invalid}
                      placeholder='Super cool blog content'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file)
                      }}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button>
                {isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  'Create Post'
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreatePage
