import { Navbar } from '@/components/web/Navbar'
import { ReactNode } from 'react'

const SharedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default SharedLayout
