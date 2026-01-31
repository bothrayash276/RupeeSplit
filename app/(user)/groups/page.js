"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {importGrpData, newGroup, updateUser} from './_groupFxn'
import serverData_User from '@/app/_data'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
// import dotenv from 'dotenv'
// dotenv.config()

const Groups = () => {
  // Checks Loading
  const [loading, setLoading] = useState(true)

  // Save userData
  const [user, setUser] = useState()

  // Save groups in which user is in
  const [group, setGroup] = useState([])

  // State for popup of creating a new group
  const [groupPopup, setGroupPopup] = useState(false)

  // Empty Group Name Error
  const [grpNameError, setGrpNameError] = useState(false)

  // Loading Session
  const {data:session, status} = useSession()

  // Loading Userdata and groups
  useEffect( () => {
    const load = async () => {
      if( status === 'authenticated' ) {
        try {
          const data = await serverData_User(session.user.email)
          setUser(data)
          
          // Getting Groups Data
          const data2 = await Promise.all(
            data.groups.map( (id) => {
              const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/findgrp/${id}`
              const res = fetch(url).then( res => res.json())
              return res
            })
          )
          setGroup(data2)

        }
        finally {
          if(group)
            setLoading(false)
        }
      }
    }
    load()
  }, [status, groupPopup])

  // Function creates a group when button is pressed
  const createGroup = () => {

    // Initial Check if Name entered is empty
    if (document.getElementById('groupName-Laptop')?.value === "" || document.getElementById('groupName-Mobile')?.value === "")
    {    
      setGrpNameError(true)
      setTimeout(() => {
        setGrpNameError(false)
      }, 2000);
      return
    }
    

    // Gets Group Name
    let groupName;
    if(document.getElementById('groupName-Laptop')?.value){
      groupName = document.getElementById('groupName-Laptop').value
    }


    // Group Template
    const groupInfo = {
      'id': uuidv4(),
      'groupName': groupName,
      'members': [user.uid],
      'transactions' : [],
      'dues' : []
    }
    // Excludes _id from rest of data to avoid conflict with MongoDB
    const {_id, ...noIDuser} = user;

    // Creating New User with updated groups array
    const newUser = {
      ...noIDuser,
      'groups' : [...user.groups, groupInfo.id]
    }
    // Saving new user's data into the old user variable
    setUser(newUser)
    
    // Updating the User Database
    updateUser(newUser).finally(() => {})
    
    // Adding the new group entry to database
    newGroup(groupInfo).finally(() => {setGroupPopup(false)})
  }

  // Loading Screen
  if(loading){
    return <>Loading....</>
  }

  // PopUp of Obtaining a Group Name
  if(groupPopup){
    return (
      <>
      {/* Creates a new group popup */}
      <div className="mt-[25vh] w-full flex items-center justify-center">
      <div 
      className="bg-white flex flex-col items-center justify-center gap-5 p-8 rounded-xl">

        {/* Title */}
        <span
        className='text-3xl font-bold'>
          Create a New Group
        </span>

        {/* Input */}
        <div className="w-full flex flex-col gap-2">

          {/* Label */}
          Name

          {/* Input Box */}
          <input
          id='groupName-Laptop' 
          placeholder='Enter a Group Name'
          type="text"
          className={`w-full px-3 py-2 rounded-2xl border  bg-gray-100 ${grpNameError ? "border-red-500" : "border-white" }`} />
        
          <span
          className={`text-red-500 ${grpNameError ? "" : "hidden"}`}>
            Group Name must to entered
          </span>
        </div>

        {/* Create Button */}
        <button
        onClick={createGroup}
        className='bg-[#2C9986] text-white px-10 py-2 rounded-full'>
          Create
        </button>

      </div>
      </div>
      </>
    )
  }

  return (
    <>
    {/* Laptop UI */}
    <div 
    className={`not-md:hidden h-full w-full my-10`}>

      {/* Container for Heading, Description and Create Group Button */}
      <div 
      className="w-full flex px-10">

        {/* Heading and Description */}
        <div
        className='flex flex-col flex-1 gap-2'>

          {/* Heading */}
          <span
          className='text-3xl font-bold'>
            Groups
          </span>
          <span
          className='text-gray-400 font-bold' >
          Manage your shared expenses and keep a track on it.
          </span>

        </div>

        {/* Create Group Button */}
        <button
        onClick={() => {setGroupPopup(true)}}
        className='flex items-center justify-center gap-3 bg-[#2C9986] px-3 rounded-full h-12 text-white shadow-lg'>
          <img src="/add.svg" alt="" className='w-6' />
          Create New Group
        </button>

      </div>

      {/* Group Cards Container */}
      <div className="flex items-center justify-evenly gap-3 w-full h-full">
        {
          group.map ((mygrp) => {
            return (             
              <Link
              href={`/groups/${mygrp.id}`}
              target='_blank'
              key={`${mygrp.id} main container`}
              className='bg-white flex flex-col p-5 h-130 w-80 shadow rounded-2xl'>

                {/* Group Icon Container */}
                <div
                key={`${mygrp.id} group icon container`}
                className='bg-[#D4EBE7] w-full h-70 flex item-center justify-center rounded-2xl mb-5'>
                  {/* Group Icon */}
                  <img 
                  key={`${mygrp.id} group icon`}
                  src="/mygroup.svg" 
                  className='w-15' />
                </div>                

                {/* Group Name */}
                <span
                key={`${mygrp.id} group name`}
                className='text-xl font-bold mb-2'>
                  {mygrp.groupName}
                </span>

                {/* Members Container */}
                <div
                key={`${mygrp.id} members container`}
                className='flex'>
                {/* Members Icon */}
                  <img
                  key={`${mygrp.id} members icon `} 
                  src="/members.svg" 
                  className='w-5' />

                  {/* Members */}
                  <span 
                  key={`${mygrp.id} group members`}
                  className='text-[#68827E] px-2'>
                    {mygrp.members.length} members
                  </span>
                </div>

                

                {/* Divider */}
                <div 
                key={`${mygrp.id} divider`}
                className='border border-[#eaeaea] mt-6 mb-4'></div>

                {/* Balance Text */}
                <span
                key={`${mygrp.id} text saying balance`}
                className='text-[#68827E] text-sm font-bold'>
                  YOUR BALANCE
                </span>

                {/* Showcasing Balance */}
                <span
                key={`${mygrp.id} your balance`}
                className='text-red-500 font-bold text-xl mt-2'>
                  You owe $500
                </span>

              </Link>
            )
            
          })
        }
      </div>
      
    </div>
      
    </>
  )
}

export default Groups
