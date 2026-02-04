"use client"
import { redirect, RedirectType, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { arrToStr, due, transactionObj, updateGroup } from '../_groupFxn'

import {v4 as uuidv4} from 'uuid'
import { useSession } from 'next-auth/react'
import PageLoading from '@/app/Loading'
import setArray from '../../friends/_setArray'

const GrpSetting = () => {

    // Loading Session
    const { data:session, status} = useSession()
    const [operator, setOperator] = useState()

    // Loading Page
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    // Save Group Data
    const [group, setGroup] = useState()
    const [members, setMembers] = useState()

    // Checks expense Popup
    const [expensePopUp, setExpensePopUp] = useState(false)

    const [settleup, setSettleup] = useState(false)

    const [transacTab, setTransacTab] = useState(true)
    const [balanceTab, setBalanceTab] = useState(false)
    const [settingsTab, setSettingsTab] = useState(false)

    const [inviteFriend, setInviteFriend] = useState(false)
    const [displayInvite, setDisplayInvite] = useState(false)

    // Paid by Who
    const [drop, setDrop] = useState(false)
    const [settledrop, setSettledrop] = useState(false)
    const [paid, setPaid] = useState("Select a Person")
    const [repaid, setRepaid] = useState("Select a Person")
    const handleDrop = (name) => {
        setPaid(name)
        setDrop(false)
    }
    const handleSettledrop = (name) => {
        setRepaid(name)
        setSettledrop(false)
    }

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
            if (status === 'authenticated') {
                const email = session.user.email
                const userurl = `${process.env.NEXT_PUBLIC_MONGO_URI}/find/${email}`
                const data = await fetch(userurl).then(res => res.json())
                const userD = data
                setOperator(data)
                const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/findgrp/${groupID}`
    
                // getting data
                try {
                    const res = await fetch(url)
                    const data = await res.json()
                    setGroup(data)
    
                    // Loading members
                    const data2 = await Promise.all(
                        data.members?.map((id) => {
                            const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/grpmem/${id}`
                            const res = fetch(url).then( res => res.json())
                            return res
                        })
                    )
                    setMembers(data2)
                    

                    // Getting Invite Friends
                    const friends = userD.friends.map((friendID) => {
                        const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/findFriend/${friendID}`
                        return fetch(url).then(res=>res.json())
                    })
                    await Promise.all(friends).then(value => setDisplayInvite(value))
                    
                    
                }
                finally {
                    setLoading(false)
                }
            }
        }
        load()
    } , [group, status, expensePopUp, settleup])

    // Lend Owe Updating Function
    const lendOwe = async (op, group, newGrp) => {
        const balance = due(op.fullName, newGrp.dues)
            const oldBalance = due(op.fullName, group.dues)
            if(balance > 0) {
                const {_id, ...vari} = op
                let newUser
                if(oldBalance < 0) {
                newUser = {
                ...vari,
                "lend" : op.lend,
                "owe" : op.owe - oldBalance   
                }
            }
                else {
                newUser = {
                    ...vari,
                    "lend" : op.lend - oldBalance + balance,   
                }   
                }
                if(operator.uid === op.uid) setOperator(newUser)
                const updateUrl = `${process.env.NEXT_PUBLIC_MONGO_URI}/update`
                return fetch(updateUrl, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(newUser)
                })
            }
            else if (balance < 0) {
                const {_id, ...vari} = op
                let newUser
                if(oldBalance > 0) {
                    newUser = {
                    ...vari,
                    "lend" : op.lend - oldBalance,
                    "owe" : op.owe + balance
                    }
                }
                else {
                    newUser = {
                    ...vari,
                    "owe" : op.owe + balance
                }
                }
                if(operator.uid === op.uid) setOperator(newUser)
                const updateUrl = `${process.env.NEXT_PUBLIC_MONGO_URI}/update`
                return fetch(updateUrl, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(newUser)
                })
                
            }
            else {
                 const {_id, ...vari} = op
                let newUser
                if(oldBalance > 0) {
                    newUser = {
                    ...vari,
                    "lend" : op.lend - oldBalance
                    }
                }
                else {
                    newUser = {
                    ...vari,
                    "owe" : op.owe - oldBalance
                }
                }
                if(operator.uid === op.uid) setOperator(newUser)
                const updateUrl = `${process.env.NEXT_PUBLIC_MONGO_URI}/update`
                return fetch(updateUrl, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(newUser)
                })
            }
    }

    // Function Adding Expenses
    const addExpense = async () => {

        if(equally) {

            // Title 
            const title = document.getElementById('title').value || "Payment"

            // Total Money
            const totalMoney = document.getElementById('total money').value

            // Stores total Participants
            const participants = []
    
            // Separates out the users with checked box
            members.map ( (user) => {
                if(document.getElementById(`${user.uid} checkbox equally`).checked) {
                    participants.push(user.fullName)
                }
                
            })

            // division of money
            const division = totalMoney / participants.length

            // Transaction history
            const obj = {
                "id" : uuidv4(),
                "title" : title,
                "Paid by" : paid,
                "Split between" : participants,
                "amount" : totalMoney,
                "division" : division
            }
            
            // const transaction
            const transac = await transactionObj([...group.transactions, obj])
            const newGrp = {
                ...group,
                'transactions' : [...group.transactions, obj],
                'dues' : transac
            }
            await updateGroup(newGrp)
            setGroup(newGrp)

            // Updating user database
            const pro = members.map((user) => {
                return lendOwe(user, group, newGrp)
            })
            await Promise.all(pro)
            
        }

        setExpensePopUp(false)
        setLoading(true)

    } 

    // Function Adding Expenses
    const settleExpense = async () => {

        // Total Money
        const totalMoney = document.getElementById('total repayed money').value

        // Transaction history
        const obj = {
            "id" : uuidv4(),
            "title" : "Repayment",
            "Paid by" : operator.fullName,
            "Split between" : [repaid],
            "amount" : totalMoney,
            "division" : totalMoney
        }
            
        // const transaction
        const transac = await transactionObj([...group.transactions, obj])
        const newGrp = {
            ...group,
            'transactions' : [...group.transactions, obj],
            'dues' : transac
        }

        await updateGroup(newGrp)
        setGroup(newGrp)

        // Updating user database
        if(-operator.owe >= totalMoney ){
            const money = Number(operator.owe) + Number(totalMoney)
            const {_id, ...vari} = operator
            const newUser = {
                ...vari,
                "owe" : Number(money)
            }
            setOperator(newUser)
            const updateUrl = `${process.env.NEXT_PUBLIC_MONGO_URI}/update`
            await fetch(updateUrl, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(newUser)
            }) 
        }
        else {
            const excess = due(operator.fullName, group.dues)
            const money = Number(operator.owe) + Number(totalMoney)
            const {_id, ...vari} = operator
            const newUser = {
                ...vari,
                "owe" : Number(operator.owe) - Number(excess),
                "lend" : Number(operator.lend) + Number(money)
            }
            setOperator(newUser)
            const updateUrl = `${process.env.NEXT_PUBLIC_MONGO_URI}/update`
            await fetch(updateUrl, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(newUser)
            }) 
        }   

        setSettleup(false)
        setLoading(true)

    }

    // Function to Exist Group
    const handleExit = async (userId, groupId) => {
        const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/deleteUserFromGroup`
        await fetch(url, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify([userId,groupId])
        })
        redirect('/groups', RedirectType.replace)
    }

    // Invite a friend in a group
    const invite = async (uid) => {

        // Get the friend
        const [d1] = displayInvite.filter((person)=>uid===person.uid)

        const newFriendData = {
            ...d1,
            "groups" : setArray([...d1.groups, group.id])
        }
        
        // Get New Group
        const newGroupData = {
            ...group,
            "members" : setArray([...group.members, uid])
        }
        setGroup(newGroupData)

        console.log(newGroupData)

        const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/grpInvite`
        await fetch(url, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify([newFriendData, newGroupData])
        })

    }

    // Loading Page
    if(loading || deleting){
        return <><PageLoading/></>
    }

    // Expense PopUp Page
    if(expensePopUp) {
        return (
            <>
            <div 
            className="h-full w-full not-md:hidden flex flex-col p-2 items-center justify-center">

                    {/* Top heading */}
                    <div 
                    className='flex border-b border-[#dddddd] p-5 bg-white rounded-2xl rounded-b-none w-150'>
                        <div
                        className='flex flex-col gap-3 flex-1'>
                            <span
                        className='text-3xl font-bold'>
                            Add an Expense
                        </span>
                        <span
                        className='text-sm text-[#68827E]'>
                            Record a new shared transaction and update your trust score
                        </span>
                        </div>
                        <img
                        onClick={() => {setExpensePopUp(false)}} 
                        src="/close.svg" alt=""  
                        className='w-8 cursor-pointer'/>
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
                            id="total money"
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
                        id='title' 
                        type="text"
                        placeholder='eg. Dinner at Burger King'
                        className='w-7/10 py-2 px-4 rounded-xl focus:outline-none border border-[#dddddd] focus:border-[#9b9b9b] my-2' />
                        

                    </div>

                    {/* Paid By Who Section */}
                    <div
                    className='w-150 bg-white flex flex-col items-center justify-center'>

                        {/* Paid by Who Text */}
                        <span
                        className='text-sm w-7/10 mt-10'>
                            Paid by who?
                        </span>

                        <button
                        onBlur={()=>{setDrop(false)}}
                        onClick={()=>{setDrop(!drop)}}
                        className={`w-7/10 flex flex-col relative p-2 rounded-xl mt-2 ${drop ? "" : "text-xl font-bold underline underline-offset-6 decoration-[#2C9986]"} `}>
                            <span className={`${drop ? "text-[#2C9886] font-bold" : ""}`}>{paid}</span>

                        {drop && <div
                        className='flex flex-col absolute left-1/2 top-8.25 -translate-x-1/2 w-full bg-white border border-[#dddddd] p-2 rounded-xl mt-2'>
                            {members.map( (user) => {
                                return (
                                    <span
                                    key={user.uid}
                                    onClick={()=>{handleDrop(user.fullName)}}
                                    className='flex items-center justify-center gap-3'>
                                        <img src="/person.svg" alt="" />
                                        {user.fullName}
                                    </span>
                                )
                            } )}
                        </div>  }           
                        
                        </button>

                    </div>


                    {/* Money Division Section */}
                    <div
                    className='bg-white w-150 flex flex-col items-center border-b border-[#dddddd]'>

                        {/* Text Split Options */}
                        <span
                        className='w-7/10 font-bold my-5 mt-10'>
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
                                    onClick={() => {document.getElementById(`${user.uid} checkbox equally`).checked = !document.getElementById(`${user.uid} checkbox equally`).checked}}
                                    key={`${user.uid} container equally`}
                                    className='bg-white w-full p-3 border border-[#dddddd] flex gap-5 rounded-xl'>

                                        {/* Icon */}
                                        <img 
                                        key={`${user.uid} icon equally`}
                                        src="/person.svg" 
                                        className='w-5' />
                                        
                                        {/* Full Name */}
                                        <span
                                        key={`${user.uid} full name equally`}
                                        className='full font-bold flex-1'>
                                            {user.fullName}
                                        </span>

                                        {/* Checkbox */}
                                        <input 
                                        key={`${user.uid} checkbox equally`}
                                        id={`${user.uid} checkbox equally`}
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
                                        id={`${user.uid} checkbox exact`}
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
                                        id={`${user.uid} checkbox ratio`}
                                        type="number" 
                                        defaultValue='1'
                                        placeholder='1'
                                        min='0'
                                        className='w-15 px-2 pt-1 pb-0.5 border-b-2 border-[#2C9986] focus:outline-none font-bold text-[#2C9986] placeholder:text-[#2C9986] placeholder:font-bold text-center'/>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='mb-10'></div>
                    </div>

                    {/* Save Section */}
                    <div
                    className='rounded-2xl rounded-t-none bg-white w-150 flex items-center justify-center p-3'>
                        <button
                        onClick={addExpense}
                        className='bg-[#2C9986] w-8/10 p-3 font-bold text-white rounded-2xl hover:bg-[#1e7f6f] cursor-pointer mt-5'>
                            Save Expense
                        </button>
                    </div>

                </div>

            </>
        )
    }

    // Settle Popup Page
    if(settleup) {
        return (
            <>
            <div 
            className="h-full w-full not-md:hidden flex flex-col p-2 items-center justify-center">

                    {/* Top heading */}
                    <div 
                    className='flex border-b border-[#dddddd] p-5 bg-white rounded-2xl rounded-b-none w-150'>
                        <div
                        className='flex flex-col gap-3 flex-1'>
                            <span
                        className='text-3xl font-bold'>
                            Settle the Dues
                        </span>
                        <span
                        className='text-sm text-[#68827E]'>
                            Clear the previous records of shared transaction and update your trust score
                        </span>
                        </div>
                        <img
                        onClick={() => {setSettleup(false)}} 
                        src="/close.svg" alt=""  
                        className='w-8 cursor-pointer'/>
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
                            id="total repayed money"
                            placeholder='0.00'
                            min='0'
                            className='text-5xl w-100 text-center font-bold placeholder:text-black foucs: outline-none' />
                        </div>

                        

                    </div>

                    {/* Repayment to Whom */}
                    <div
                    className='w-150 bg-white flex flex-col items-center justify-center'>

                        {/* Paid by Who Text */}
                        <span
                        className='text-sm w-7/10 mt-10'>
                            Repaying to whom?
                        </span>

                        <button
                        onBlur={()=>{setSettledrop(false)}}
                        onClick={()=>{setSettledrop(!settledrop)}}
                        className={`w-7/10 flex flex-col relative p-2 rounded-xl mt-2 ${settledrop ? "" : "text-xl font-bold underline underline-offset-6 decoration-[#2C9986]"} `}>
                            <span className={`${settledrop ? "text-[#2C9886] font-bold" : ""}`}>{paid}</span>

                        {settledrop && <div
                        className='flex flex-col absolute left-1/2 top-8.25 -translate-x-1/2 w-full bg-white border border-[#dddddd] p-2 rounded-xl mt-2'>
                            {members.map( (user) => {
                                if(user.uid === operator.uid) return
                                return (
                                    <span
                                    key={user.uid}
                                    onClick={()=>{handleSettledrop(user.fullName)}}
                                    className='flex items-center justify-center gap-3'>
                                        <img src="/person.svg" alt="" />
                                        {user.fullName}
                                    </span>
                                )
                            } )}
                        </div>  }           
                        
                        </button>

                    </div>

                    {/* Save Section */}
                    <div
                    className='rounded-2xl rounded-t-none bg-white w-150 flex items-center justify-center p-3'>
                        <button
                        onClick={settleExpense}
                        className='bg-[#2C9986] w-8/10 p-3 font-bold text-white rounded-2xl hover:bg-[#1e7f6f] cursor-pointer mt-5'>
                            Settle Up
                        </button>
                    </div>

                </div>

            </>
        )
    }

    if(inviteFriend) {
        return (
            <>
            <div
            className='flex flex-col h-full w-full p-7'>
                {
                        displayInvite.map ( (user) => {
                            return (
                                <div
                                key={`${user.uid} container`}
                                className='p-2 flex items-center gap-2'>
                                    
                                    {/* Image */}
                                    <img
                                    key={`${user.uid} pfp image`}
                                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s" alt=""
                                    className='w-18 h-18 rounded-full' />

                                    {/* User Details */}
                                    <div
                                    key={`${user.uid} user details`}
                                    className='flex flex-col flex-1 gap-0.5'>

                                        {/* User Name */}
                                        <span
                                        key={`${user.uid} user name`}
                                        className='font-bold'>
                                            {user.fullName}
                                        </span>

                                        {/* Trust Score */}
                                        <span
                                        key={`${user.uid} user score`}
                                        className='font-bold text-[#2C9986] text-sm text-center bg-[#D4EBE7] w-25 rounded-full'>
                                            TRUST: {user.score}
                                        </span>
                                    </div>

                                    {/* Invite Button */}
                                    <button
                                    onClick={()=>{invite(user.uid)}}
                                    className='w-1/10 p-2 bg-[#D4EBE7] text-[#2C9986] font-bold rounded-full'>
                                        Invite
                                    </button>
                                </div>

                            )
                        })
                    }
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
                   {due(operator.fullName, group.dues) < 0 ? <span
                    className='text-red-500 font-bold'>&#x20B9;{-due(operator.fullName, group.dues)}
                    </span> : ""}

                    {due(operator.fullName, group.dues) > 0 ? <span
                    className='text-[#2C9986] font-bold'>&#x20B9; {due(operator.fullName, group.dues)}
                    </span> : ""}

                    {due(operator.fullName, group.dues) ===0 ? <span
                    className='text-[#68827E] font-bold italic'>Settled up
                    </span> : ""}
                    
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
            onClick={() => {setSettleup(true)}}
            className='flex items-center justify-center gap-3 bg-[#F1F4F3] px-3 rounded-full h-12'>
                <img src="/settle.svg" alt="" className='w-6' />
                Settle Up
            </button>
        </div>

        {/* Navbar */}
        <div
        className='w-8/10 border-b border-[#dddddd] p-2 flex gap-2 my-10'>

            {/* Transaction History Button Button */}
            <button
            onClick={()=>{setTransacTab(true); setBalanceTab(false); setSettingsTab(false)}}
            className={`${transacTab ? "text-[#2C9986] bg-[#D4EBE7]" : "text-[#68827E]"} font-bold cursor-pointer p-2 rounded-xl`}>
                Transactions
            </button>

            {/* Balances Button */}
            <button
            onClick={()=>{setTransacTab(false); setBalanceTab(true); setSettingsTab(false)}}
            className={`${balanceTab ? "text-[#2C9986] bg-[#D4EBE7]" : "text-[#68827E]"} font-bold cursor-pointer p-2 rounded-xl`}>
                Balances
            </button>

            {/* Settings Button */}
            <button
            onClick={()=>{setTransacTab(false); setBalanceTab(false); setSettingsTab(true)}}
            className={`${settingsTab ? "text-[#2C9986] bg-[#D4EBE7]" : "text-[#68827E]"} font-bold cursor-pointer p-2 rounded-xl`}>
                Settings
            </button>

        </div>

        {/* Transaction Tab */}
        <div 
        className={`${transacTab ? "" : "hidden"} w-8/10`}>

            {/* Displaying Previous Transaction */}
            <div
            className='w-full flex flex-col gap-10'>            
                {/* Recent Activity Heading */}
                <div
                className='flex gap-3 items-center'>

                    {/* Recent Arrow Image */}
                    <img src="/recent.gif" alt="" className='w-8' />

                    {/* Recent Text */}
                    <span
                    className='text-xl font-bold'>
                        Recent Activity
                    </span>
                </div>

                {/* Function to Show all the transactions */}
                {
                    group.transactions.map( pay => {
                        return (
                            <div
                            key={`${group.id} ${pay.id} 1`}
                            className='bg-white flex gap-3 items-center p-3 rounded-xl'>

                                {/* Title */}
                                <div
                                key={`${group.id} ${pay.title} 2`}
                                className='flex flex-col flex-1 gap-1'>
                                    <span
                                    key={`${group.id} ${pay.id} 3`}
                                    className='font-bold text-xl'>
                                        {pay.title}
                                    </span>
                                    <span
                                    key={`${group.id} ${pay.id} 4`}
                                    className='text-[#68827E] text-sm font-bold'>
                                        {pay["Paid by"]} paid &#x20B9; {pay.amount} for {arrToStr(pay["Split between"])} 
                                    </span>
                                </div>
                                
                                {/* Money */}
                                <span
                                key={`${group.id} ${pay.id} 5`}
                                className='flex gap-1 items-center text-[#68827E] font-bold'>
                                    <span
                                    key={`${group.id} ${pay.id} 6`}
                                    className='text-xl font-bold text-[#2C9986]'>
                                        &#x20B9; {pay.division} 
                                    </span>
                                    per head
                                </span>

                            </div>
                        )
                    })
                }

            </div>

        </div>

        {/* Balance Tab */}
        <div
        className={`${balanceTab ? "" : "hidden"} w-8/10`}>
            
            {/* Displaying Group Members */}
            <div
            className='w-full flex flex-col gap-3'>

                {/* Icon and Title */}
                <div
                className='flex items-center gap-3'>
                    <img src="/balance.gif" alt="" className='w-7 ' />
                    <span
                    className='font-bold text-xl'>
                        Account Balances
                    </span>
                </div>

                    { 
                        members.map ( (user) => {
                            return (
                                <div
                                key={`${user.uid} mega container`}
                                className='p-3 flex flex-col gap-2 bg-white rounded-xl'>

                                <div
                                key={`${user.uid} container`}
                                className='p-2 flex items-center gap-2'>
                                    
                                    {/* Image */}
                                    <img
                                    key={`${user.uid} pfp image`}
                                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s" alt=""
                                    className='w-18 h-18 rounded-full' />

                                    {/* User Details */}
                                    <div
                                    key={`${user.uid} user details`}
                                    className='flex flex-col flex-1 gap-0.5'>

                                        {/* User Name */}
                                        <span
                                        key={`${user.uid} user name`}
                                        className='font-bold'>
                                            {user.fullName}
                                        </span>

                                        {/* Trust Score */}
                                        <span
                                        key={`${user.uid} user score`}
                                        className='font-bold text-[#2C9986] text-sm text-center bg-[#D4EBE7] w-25 rounded-full'>
                                            TRUST: {user.score}
                                        </span>
                                    </div>

                                </div>
                                {group.dues[user.fullName]===!undefined ? Object.entries(group.dues[user.fullName]).map(([name, amount]) => {
                                    if(!name || amount === 0) return
                                    return (
                                        <div
                                        key={`${user.uid} payee`}
                                        className='ml-25 flex'>
                                            <span
                                            key={`${user.uid} payee name`}
                                            className='font-bold text-xl flex-1'>
                                                {name}
                                            </span>
                                            <span
                                            key={`${user.uid} owe print`}
                                            className={`${amount < 0 ? "" : "hidden"} text-red-500 font-bold text-xl`}>
                                                You owe &#8377; {-amount}
                                            </span>
                                            <span
                                            key={`${user.uid} lend   print`}
                                            className={`${amount > 0 ? "" : "hidden"} text-[#2C9986] font-bold text-xl`}>
                                                You are owed &#8377; {amount}
                                            </span>
                                        </div>
                                    )
                                })
                                 : ""}

                                </div>

                            )
                        })
                    }
                

            </div>
        </div>

        {/* Settings Tab */}
        <div
        className={`${settingsTab ? "" : "hidden"} w-8/10`}>
            
            {/* Displaying Group Members */}
            <div
            className='w-full flex flex-col gap-3'>

                <div
                className='flex items-center justify-end w-full gap-5'>
                    
                    {/* Add Friend */}
                    <div
                    onClick={()=>{setInviteFriend(true)}}
                    className='flex items-center p-3 gap-2 bg-[#D4EBE7] rounded-2xl text-[#2C9986] cursor-pointer'>
                        <img src="/addFriend_active.svg" alt="" className='w-6'/>
                        Invite a Friend
                    </div>

                    {/* Leave Group */}
                    <div
                    onClick={()=>{handleExit(operator.uid, group.id); setDeleting(true)}}
                    className='flex items-center p-3 gap-2 bg-red-500 rounded-2xl text-white cursor-pointer'>
                        <img src="/exit.svg" alt="" className='w-6'/>
                        Leave Group
                    </div>
                </div>

                {/* Icon and Title */}
                <div
                className='flex items-center gap-3'>
                    <img src="/group_active.svg" alt="" className='w-7 ' />
                    <span
                    className='font-bold text-xl'>
                        Group Members
                    </span>
                </div>

                    {
                        members.map ( (user) => {
                            const balance = due(user.fullName, group.dues)
                            return (
                                <div
                                key={`${user.uid} container`}
                                className='p-2 flex items-center gap-2'>
                                    
                                    {/* Image */}
                                    <img
                                    key={`${user.uid} pfp image`}
                                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s" alt=""
                                    className='w-18 h-18 rounded-full' />

                                    {/* User Details */}
                                    <div
                                    key={`${user.uid} user details`}
                                    className='flex flex-col flex-1 gap-0.5'>

                                        {/* User Name */}
                                        <span
                                        key={`${user.uid} user name`}
                                        className='font-bold'>
                                            {user.fullName}
                                        </span>

                                        {/* Trust Score */}
                                        <span
                                        key={`${user.uid} user score`}
                                        className='font-bold text-[#2C9986] text-sm text-center bg-[#D4EBE7] w-25 rounded-full'>
                                            TRUST: {user.score}
                                        </span>
                                    </div>

                                    {/* User Balance */}
                                    <div
                                    key={`${user.uid} user balance container`}
                                    className='flex flex-col flex-1 gap-0.5 items-center'>

                                        {/* Balance Text */}
                                        <span
                                        key={`${user.uid} title balance`}
                                        className='font-bold text-[#68827E] text-sm'>
                                            BALANCE
                                        </span>

                                        {/* Balance */}
                                        {/* settled up */}
                                        <span
                                        key={`${user.uid} settleup`}
                                        className={`${balance === 0 ? "" : "hidden"} italic font-bold text-[#68827E]`}>
                                            Settled Up
                                        </span>

                                        {/* you owe */}
                                        <span
                                        
                                        key={`${user.uid} owe`}
                                        className={`${balance < 0 ? "" : "hidden"} italic font-bold text-red-500`}>
                                            You owe &#8377; {-balance}
                                        </span>

                                        {/* you are owed */}
                                        <span
                                        
                                        key={`${user.uid} owed`}
                                        className={`${balance > 0 ? "" : "hidden"} italic font-bold text-[#2C9986]`}>
                                            You are owed &#8377; {balance}
                                        </span>


                                    </div>

                                </div>

                            )
                        })
                    }
                

            </div>
        </div>

    </div>
    </>
  )
}

export default GrpSetting
