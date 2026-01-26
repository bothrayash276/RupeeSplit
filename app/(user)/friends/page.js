"use client";
import React, { useState, useEffect } from "react";

const Friends = () => {
  const [invalidUID, setInvalidUID] = useState(false);
  const findFriend = () => {
    const userUID = document.getElementById('uidSearchBox').value
    fetch(`http://localhost:8080/findFriend/${userUID}`)
    .then(res => res.json())
    .then(res => localStorage.setItem('addFriend', JSON.stringify(res)))
    
  }
  
  return (
    <>
      {/* Laptop UI */}
      <div className="not-md:hidden flex flex-col h-full w-full items-center justify-center">
        <div className="bg-white w-8/10 flex flex-col gap-4 items-center justify-center mt-10">
          <span className="text-2xl font-bold">Find your Friends</span>
          <span className="text-gray-500">
            Split bills instantly with people you trust. Search by UID
          </span>
          {/* Search Bar */}
          <div className="flex gap-2 border border-gray-200 bg-[#F5F7F8] rounded-lg min-w-2xl py-2 px-3">
            <img src="/search.gif" alt="" className="w-8" />
            <input
              type="text"
              id="uidSearchBox"
              placeholder="Enter the UID. Try 'abCdE' "
              className={`py-1 px-2 focus:outline-none flex-1`}
            />
            <button
              onClick={findFriend}
              className="bg-[#20B69D] text-white px-3 py-1 rounded-full"
            >
              Search
            </button>
          </div>
          <span className={`${invalidUID ? "" : "hidden"} text-red-500`}>
            User Not Found.... Unvalid UID!
          </span>
        </div>
      </div>
    </>
  );
};

export default Friends;
