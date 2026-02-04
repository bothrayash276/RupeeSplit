"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PageLoading from "@/app/Loading";
import Link from "next/link";

const Dashboard = () => {
  const [user, setUser] = useState();
  const { data: session, status } = useSession();

  // Loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      async function getData() {
      try {
          const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/find/${session.user.email}`
          const data = await fetch(url).then(res => res.json())
          setUser(data)
        }
       finally {
        setLoading(false)
      }
    }
      getData();
    }
  }, [status]);

  if(loading) {
    return <><PageLoading/></>
  }

  return (
    <>
      {/* Laptop UI */}
      <div
      className="w-full h-full not-lg:hidden flex flex-col gap-3 p-8">

        {/* Account Insight */}
        <div
        className="w-full flex gap-5">

          {/* Trust Score Display Container */}
          <div
          className="flex flex-col max-w-100 h-120 bg-while gap-10 items-center rounded-xl shadow-md p-7">

            {/* Heading */}
            <div
            className="flex w-full items-center gap-3">
              
              {/* Text - Trust Score */}
              <span
              className="text-xl font-bold flex-1">
                Trust Score
              </span>

              <span
              className={`${user.score >= 70} "" : "hidden" text-[#2C9986] font-bold px-2 bg-[#D4EBE7] rounded-xl text-sm` }>
                EXCELLENT
              </span>
              
            </div>

            {/* Color Coding Based on Score */}
              <div
              className="flex-1">
                
                {/* IF Score is greater than 70 */}
                <span
              className={`${user.score >= 70 ? "" : "hidden"} flex flex-col items-center justify-center h-40 w-40 rounded-full border-15 border-[#D4EBE7]`}>  
                <p className="text-4xl font-bold text-[#2C9986]">{user.score}</p>
                <p className="text-[#68827E] font-bold">out of 100</p>
              </span>

              {/* If Score lies between 40 and 70 */}
              <span
              className={`${user.score >= 40 && user.score < 70 ? "" : "hidden"} flex flex-col items-center justify-center h-40 w-40 rounded-full border-15 border-[#dfdfc6]`}>  
                <p className="text-4xl font-bold text-[#cad800]">{user.score}</p>
                <p className="text-[#68827E] font-bold">out of 100</p>
              </span>

              {/* If score is less than 40 */}
              <span
              className={`${user.score < 40 ? "" : "hidden"} flex flex-col items-center justify-center h-40 w-40 rounded-full border-15 border-[#ebd4d4]`}>  
                <p className="text-4xl font-bold text-red-500">{user.score}</p>
                <p className="text-[#68827E] font-bold">out of 100</p>
              </span>

              </div>

            {/* Text */}
            <span
            className="text-center w-7/10 h-3/10 text-[#68827E] text-sm">
              Your score is based on the timely <span className="font-bold text-black">resettlements</span>. Rebalancing is done <span className="font-bold text-black">every week</span>
            </span>

          </div>

        {/* Total Net Balance */}
          <div 
          className={`${(user.lend + user.owe) >=0 ? "bg-[#2C9986]" : "bg-red-500"} lg:flex-1 flex flex-col justify-center items-center gap-3 rounded-xl shadow-md py-7  my-20`}>
            
            {/* Text - Total Net Balance */}
            <span
            className="text-neutral-100 text-sm">
              TOTAL NET BALANCE
            </span>

            {/* Net Balance */}
            <span
            className="lg:text-6xl md:text-4x6 font-bold text-white flex-1 flex items-center">
             &#x20B9; {user.lend + user.owe}
            </span>

            {/* View Button */}
            <Link
            href={'/groups'}
            className={`${user.lend + user.owe >=0 ? "text-[#2C9986]" : "text-red-500"} px-3 py-1 bg-white rounded-full w-30 font-bold text-center`}>
              View
            </Link>
          </div>

        {/* Account Balance */}
          <div
          className="lg:flex-1 flex flex-col gap-5 my-8">

            {/* Lend */}
            <div
            className={`w-full shadow-md flex flex-col gap-3 bg-white py-7 rounded-xl flex-1 ${innerWidth >= 1400 ? "px-7" : "px-2"}`}>

              {/* Image and You are Owed */}
              <div
              className="flex gap-3 items-center">
                <img src="/increase.gif" alt="" className="w-10 rounded-full bg-[#D4EBE7] p-2" />
                <span
                className="text-[#68827E] font-bold">
                  You are owed
                </span>


              </div>

              {/* Amount */}
              <span
              className={`text-6xl font-bold ${user.lend ? "text-[#2C9986]" : "text-black"}`}>
                <span className={`${user.lend ? "":"hidden"}`}>&#x2b;</span> &#x20B9; {user.lend}
              </span>
            </div>

            {/* Owe */}
            <div
            className={`w-full shadow-md flex flex-col gap-3 bg-white py-7 rounded-xl flex-1 ${innerWidth >= 1400 ? "px-7" : "px-2"}`}>

              {/* Image and You Owe */}
              <div
              className="flex gap-3 items-center">
                <img src="/decrease.gif" alt="" className="w-10 rounded-full bg-[#ebd4d4] p-2" />
                <span
                className="text-[#68827E] font-bold">
                  You owe
                </span>


              </div>

              {/* Amount */}
              <span
              className={`text-6xl font-bold ${user.owe ? "text-red-500" : "text-black"}`}>
                <span className={`${user.owe ? "":"hidden"}`}>&#x2212;</span> &#x20B9; {-user.owe}
              </span>
            </div>

          </div>

        </div>
        

        

      </div>

    </>
  );
};

export default Dashboard;
