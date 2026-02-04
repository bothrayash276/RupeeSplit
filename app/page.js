"use client"
import { useSession } from 'next-auth/react'
import { redirect, RedirectType } from 'next/navigation'
import React from 'react'
import PageLoading from './Loading'

const Homepage = () => {
  const {data:session, status} = useSession()

  if(status === 'authenticated') {
    redirect('/dashboard', RedirectType.push)
  }
  else if (status === 'unauthenticated'){
    redirect('/login', RedirectType.replace)
  }
  
  return (
    <>
    <PageLoading/>
    </>
  )
}

export default Homepage
