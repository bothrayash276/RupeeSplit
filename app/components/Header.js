"use client"
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation"

const Header = () => {

  const { data:session } = useSession()
  const router = useRouter()

  const handleAvatar = () => {
    if(session){
      router.push("/dashboard")
    }
    else {
      router.push("/login")
    }
  }

  return (
    <>
    <div className="lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4">
      <Link href={"/"} className='flex items-center gap-1'>
        <img src="/logo.png" alt="" className='w-8' />
        <span className='font-bold'>RupeeSplit</span>
      </Link>
      <div>
        <img onClick={handleAvatar} className='w-8' src="/avatar.gif" alt="" />
      </div>
    </div>
    <div className="not-lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4">
      <div className='flex items-center gap-1'>
        <img src="/logo.png" alt="" className='w-8' />
        <span className='font-bold'>RupeeSplit</span>
      </div>
    </div>
    </>
  )
}

export default Header
