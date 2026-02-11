'use client'
import { Loader2, Search } from 'lucide-react'
import { Input } from '../ui/input'
import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SearchInput = () => {
  const router = useRouter()
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)

  const results = useQuery(
    api.blogs.searchBlogPosts,
    term.length >= 2 ? { limit: 5, term: term } : 'skip',
  )

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value)
    setOpen(true)
  }

  return (
    <div className='relative w-full max-w-sm z-10'>
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search Posts...'
          className='w-full pl-8 bg-background'
          value={term}
          onChange={handleInputChange}
        />
      </div>

      {open && term.length >= 2 && (
        <div className='absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95'>
          {results === undefined ? (
            <div className='flex items-center justify-center p-4 text-sm text-muted-foreground'>
              <Loader2 className='mr-2 size-4 animate-spin' /> Searching...
            </div>
          ) : results.length === 0 ? (
            <p className='p-4 text-sm text-muted-foreground text-center'>
              No results found!
            </p>
          ) : (
            <div className='py-1'>
              {results.map((result) => (
                <div
                  key={result._id}
                  className='flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer'
                  onClick={() => {
                    router.push(`blog/${result._id}`)
                    setOpen(false)
                    setTerm('')
                  }}
                >
                  <p className='font-medium truncate'>{result.title}</p>
                  <p className='text-xs text-muted-foreground pt-1'>
                    {result.content.substring(0, 60)}
                  </p>
                </div>
                // <Link
                //   key={result._id}
                //   href={`blog/${result._id}`}
                //   className='flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer'
                //   onClick={() => {
                //     setOpen(false)
                //     setTerm('')
                //   }}
                // >
                //   <p className='font-medium truncate'>{result.title}</p>
                //   <p className='text-xs text-muted-foreground pt-1'>
                //     {result.content.substring(0, 60)}
                //   </p>
                // </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchInput
