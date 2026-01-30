"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const GrpSetting = () => {

    // Loading Page
    const [loading, setLoading] = useState(true)

    // Save Group Data
    const [group, setGroup] = useState()
    const [members, setMembers] = useState()

    // Checks expense Popup
    const [expensePopUp, setExpensePopUp] = useState(false)

    // Split Buttons
    const [equally, setEqually] = useState(true)
    const [exact, setExact] = useState(false)
    const [ratio, setRatio] = useState(false)
    
    // Getting Group Id
    const params = useParams()
    const groupID = params.grpid

    // Loads Group Data and Members
    useEffect( () => {
        const load = async () => {

            // url
            const url = `http://localhost:8080/findgrp/${groupID}`

            // getting data
            try {
                const res = await fetch(url)
                const data = await res.json()
                setGroup(data)

                // Loading members
                const data2 = await Promise.all(
                    data.members.map((id) => {
                        const url = `http://localhost:8080/grpmem/${id}`
                        const res = fetch(url).then( res => res.json())
                        return res
                    })
                )
                setMembers(data2)
            }
            finally {
                setLoading(false)
            }
        }
        load()
    } , [group])


    // Function Adding Expenses
    const addExpense = () => {

    } 

    // Loading Page
    if(loading){
        return <>Loading...</>
    }

    // Expense PopUp Page
    if(expensePopUp) {
        return (
            <>
            <div 
            className="h-full w-full not-md:hidden flex flex-col p-2 items-center justify-center">

                    {/* Top heading */}
                    <div 
                    className='flex flex-col gap-3 border-b border-[#dddddd] p-5 bg-white rounded-2xl rounded-b-none w-150'>
                        <span
                        className='text-3xl font-bold'>
                            Add an Expense
                        </span>
                        <span
                        className='text-sm text-[#68827E]'>
                            Record a new shared transaction and update your trust score
                        </span>
                    </div>

                    {/* Middle Section */}
                    <div
                    className='bg-white w-150 flex flex-col items-center'>

                        {/* Text Total Amount */}
                        <span
                        className='text-sm text-[#68827E] mt-8 font-bold'>
                            TOTAL AMOUNT
                        </span>

                        {/* Money */}
                        <div
                        className='flex items-center justify-center mt-5'>

                            {/* Rupee Icon */}
                            <img src="/rupee.svg" alt="" className='w-9'/>

                            {/* Money Input */}
                            <input 
                            type="number"
                            placeholder='0.00'
                            min='0'
                            className='text-5xl w-100 text-center font-bold placeholder:text-black foucs: outline-none' />
                        </div>

                        {/* What is it for */}
                        <span
                        className='w-7/10 text-sm mt-5'>
                            What is it for?
                        </span>

                        {/* Title Input */}
                        <input 
                        type="text"
                        placeholder='eg. Dinner at Burger King'
                        className='w-7/10 py-2 px-4 rounded-xl focus:outline-none border border-[#dddddd] focus:border-[#9b9b9b] my-2' />
                        

                    </div>

                    {/* Money Division Section */}
                    <div
                    className='bg-white w-150 flex flex-col items-center border-b border-[#dddddd]'>

                        {/* Text Split Options */}
                        <span
                        className='w-7/10 font-bold my-5'>
                            Split Options
                        </span>

                        {/* Option Selector buttons */}
                        <div
                        className='flex w-8/10 border border-[#dddddd]  rounded-full bg-[#F6F8F6] p-1'>

                            {/* Equally */}
                            <button
                            onClick={() => {setEqually(true); setExact(false); setRatio(false)}}
                            className={`${equally ? "bg-[#2C9986] text-white" : ""} py-1.5 px-4 rounded-full flex-1 cursor-pointer`}>
                                Equally
                            </button>

                            {/* Exact Amounts */}
                            <button
                            onClick={() => {setEqually(false); setExact(true); setRatio(false)}}
                            className={`${exact ? "bg-[#2C9986] text-white" : ""} py-1.5 px-4 rounded-full flex-1 cursor-pointer`}>
                                Exact Amounts
                            </button>

                            {/* Ratio */}
                            <button
                            onClick={() => {setEqually(false); setExact(false); setRatio(true)}}
                            className={`${ratio ? "bg-[#2C9986] text-white" : ""} py-1.5 px-4 rounded-full flex-1 cursor-pointer`}>
                                Ratio
                            </button>
                        </div>

                        {/* Equally */}
                        <div 
                        className={`${equally ? "" : "hidden"} w-full my-5 px-2 flex flex-col gap-5`}>

                            {/* Displaying Users */}
                            { members.map ( (user) => {
                                return (
                                    <div
                                    onClick={() => {document.getElementById(`${user.uid} checkbox`).checked = !document.getElementById(`${user.uid} checkbox`).checked}}
                                    key={`${user.uid} container`}
                                    className='bg-white w-full p-3 border border-[#dddddd] flex gap-5 rounded-xl'>

                                        {/* Icon */}
                                        <img 
                                        key={`${user.uid} icon`}
                                        src="/person.svg" 
                                        className='w-5' />
                                        
                                        {/* Full Name */}
                                        <span
                                        key={`${user.uid} full name`}
                                        className='full font-bold flex-1'>
                                            {user.fullName}
                                        </span>

                                        {/* Checkbox */}
                                        <input 
                                        key={`${user.uid} checkbox`}
                                        id={`${user.uid} checkbox`}
                                        type="checkbox" 
                                        className='w-4 accent-[#2C9986] rounded-full'/>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Exact Amounts */}
                        <div 
                        className={`${exact ? "" : "hidden"} w-full my-5 px-2 flex flex-col gap-5`}>

                            {/* Displaying Users */}
                            { members.map ( (user) => {
                                return (
                                    <div
                                    key={`${user.uid} container`}
                                    className='bg-white w-full p-3 border border-[#dddddd] flex gap-5 rounded-xl items-center'>

                                        {/* Icon */}
                                        <img 
                                        key={`${user.uid} icon`}
                                        src="/person.svg" 
                                        className='w-5' />
                                        
                                        {/* Full Name */}
                                        <span
                                        key={`${user.uid} full name`}
                                        className='full font-bold flex-1'>
                                            {user.fullName}
                                        </span>

                                        {/* Rupee Icon */}
                                        <img src="/rupee.svg" alt="" className='w-5' />

                                        {/* Number Input */}
                                        <input 
                                        key={`${user.uid} checkbox`}
                                        id={`${user.uid} checkbox`}
                                        type="number" 
                                        defaultValue='0'
                                        placeholder='0.00'
                                        min='0'
                                        className='w-20 px-2 pt-1 pb-0.5 border-b-2 border-[#2C9986] focus:outline-none font-bold text-[#2C9986] placeholder:text-[#2C9986] placeholder:font-bold text-center'/>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Ratio */}
                        <div 
                        className={`${ratio ? "" : "hidden"} w-full my-5 px-2 flex flex-col gap-5`}>

                            {/* Displaying Users */}
                            { members.map ( (user) => {
                                return (
                                    <div
                                    key={`${user.uid} container`}
                                    className='bg-white w-full p-3 border border-[#dddddd] flex gap-5 rounded-xl items-center'>

                                        {/* Icon */}
                                        <img 
                                        key={`${user.uid} icon`}
                                        src="/person.svg" 
                                        className='w-5' />
                                        
                                        {/* Full Name */}
                                        <span
                                        key={`${user.uid} full name`}
                                        className='full font-bold flex-1'>
                                            {user.fullName}
                                        </span>

                                        {/* Number Input */}
                                        <input 
                                        key={`${user.uid} checkbox`}
                                        id={`${user.uid} checkbox`}
                                        type="number" 
                                        defaultValue='1'
                                        placeholder='1'
                                        min='0'
                                        className='w-15 px-2 pt-1 pb-0.5 border-b-2 border-[#2C9986] focus:outline-none font-bold text-[#2C9986] placeholder:text-[#2C9986] placeholder:font-bold text-center'/>
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    {/* Save Section */}
                    <div
                    className='rounded-2xl rounded-t-none bg-white w-150 flex items-center justify-center p-3'>
                        <button
                        onClick={addExpense}
                        className='bg-[#2C9986] w-8/10 p-3 font-bold text-white rounded-2xl hover:bg-[#1e7f6f] cursor-pointer'>
                            Save Expense
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
    className="h-full w-full not-md:hidden p-2 flex flex-col items-center justify-center">

        {/* Group Details */}
        <div 
        className="bg-white w-8/10 flex gap-5 px-5 py-10 rounded-3xl shadow items-center min-w-180 mt-10">

            {/* Group Name and Amount Owed */}
            <div
            className='flex flex-col flex-1 gap-3'>

                {/* Group Name */}
                <span
                className='text-3xl font-bold'>
                    {group.groupName}
                </span>
                
                {/* Your Balance */}
                <div
                className='flex gap-2 items-center text-[#68827E]'>

                    {/* Image */}
                    <img src="/pie.gif" alt="" className='w-6' />

                    {/* Text */}
                    Your share in the total balance:

                    {/* Your Balance */}
                    <span
                    className='text-red-500 font-bold'>$500</span>
                </div>
            </div>

            {/* Add Expense Button */}
            <button
            onClick={() => setExpensePopUp(true)}
            className='flex items-center justify-center gap-3 bg-[#2C9986] px-3 rounded-full h-12 text-white shadow-lg cursor-pointer'>
                <img src="/add.svg" alt="" className='w-6' />
                Add Expense
            </button>

            {/* Settle Up Button */}
            <button
            onClick={() => {}}
            className='flex items-center justify-center gap-3 bg-[#F1F4F3] px-3 rounded-full h-12'>
                <img src="/settle.svg" alt="" className='w-6' />
                Settle Up
            </button>
        </div>

    </div>
    </>
  )
}

export default GrpSetting
