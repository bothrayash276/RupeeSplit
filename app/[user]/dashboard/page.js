"use client"
import { useParams } from 'next/navigation'
import React, {useState, useEffect} from 'react'
import { loadUserData } from './loadUserData'


const Dashboard = ({}) => {

    const username = useParams().user
    const data = loadUserData(username)
  return (
        <>
        </>
  )
}

export default Dashboard
