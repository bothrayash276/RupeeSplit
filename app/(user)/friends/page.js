"use client";
import React, { useEffect, useState } from "react";
import setArray from "./_setArray";

const Friends = () => {
  const [invalidUID, setInvalidUID] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [friendInfo, setFriendInfo] = useState({ doesExist: true });

  const findFriend = () => {
    let userUID = document.getElementById("uidSearchBox").value;
    if (!userUID) userUID = document.getElementById("uidSearchBoxMobile").value;
    fetch(`http://localhost:8080/findFriend/${userUID}`)
      .then((res) => res.json())
      .then((res) => setFriendInfo(res));
    if (!userUID) {
      setFetched(false);
    }
  };

  useEffect(() => {
    if (!friendInfo.doesExist) {
      document.getElementById("uidSearchBox").value = "";
      document.getElementById("uidSearchBoxMobile").value = "";
      setInvalidUID(true);
      setFetched(false);
      setTimeout(() => {
        setInvalidUID(false);
      }, 2000);
    } else if (
      document.getElementById("uidSearchBox").value ||
      document.getElementById("uidSearchBoxMobile").value
    ) {
      setFetched(true);
    }
  }, [friendInfo]);

  const addFriend = async () => {
    alert('Friend Added Successfully!')
    const myinfo = JSON.parse(localStorage.getItem("userData"));
    const myUserFriends = [...myinfo.friends, friendInfo.uid];
    const myFriendFriends = [...friendInfo.friends, myinfo.uid];
    const myUser = {
      ...myinfo,
      friends: setArray(myUserFriends),
    };
    localStorage.setItem("userData", JSON.stringify(myUser));
    const friendUser = {
      ...friendInfo,
      friends: setArray(myFriendFriends),
    };
    await fetch("http://localhost:8080/addFriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([myUser, friendUser]),
    });
  };

  const handleEnter = (e) => {
    if (e.key == "Enter") findFriend();
  };

  return (
    <>
      {/* Laptop UI */}
      <div className="not-md:hidden flex flex-col h-full w-full items-center justify-center">
        <div className="bg-white w-8/10 flex flex-col gap-4 items-center justify-center my-10 py-5 rounded-lg">
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
              onKeyDown={handleEnter}
              placeholder="Enter the UID. Try 'abCdE' "
              className={`py-1 px-2 focus:outline-none flex-1`}
            />
            <button
              onClick={findFriend}
              className="bg-[#20B69D] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#1b9c87]"
            >
              Search
            </button>
          </div>
          <span className={`${invalidUID ? "" : "hidden"} text-red-500`}>
            User Not Found.... Unvalid UID!
          </span>
        </div>
        <div
          className={`${fetched ? "" : "hidden"} flex flex-col gap-3 items-center justify-center bg-white py-5 px-10 rounded-lg`}
        >
          <img
            src="https://wallpapers.com/images/featured/pfp-pictures-ph6qxvz14p4uvj2j.jpg"
            alt=""
            className="w-30 rounded-full"
          />
          <span className="font-bold text-2xl">{friendInfo.fullName}</span>
          <span className="text-[#20B69D] text-sm bg-[#D4EBE7] px-3 py-0.5 rounded-full">
            {friendInfo.score}
          </span>
          <span className="text-gray-500 text-sm">UID: {friendInfo.uid}</span>
          <span
            onClick={addFriend}
            id="addFriendButton"
            className="bg-[#20B69D] mt-5 text-white py-1 px-3 rounded-full cursor-pointer hover:bg-[#1b9c87]"
          >
            Add Friend
          </span>
        </div>
      </div>

      {/* Mobile UI */}
      <div className="md:hidden flex flex-col h-full w-full items-center justify-center">
        {/* Search Bar */}
        <div className="w-9/10 flex gap-2 border border-gray-200 bg-gray-200 rounded-lg mt-10 py-2 px-3">
          <img src="/search.gif" alt="" className="w-8" />
          <input
            type="text"
            id="uidSearchBoxMobile"
            onKeyDown={handleEnter}
            placeholder="Enter the UID. Try 'abCdE'"
            className={`py-1 px-2 focus:outline-none flex-1`}
          />
        </div>
        <span className={`${invalidUID ? "" : "hidden"} text-red-500`}>
          User Not Found.... Unvalid UID!
        </span>
        <div
          className={`${fetched ? "" : "hidden"} flex flex-col gap-3 items-center justify-center py-5 px-10 rounded-lg`}
        >
          <img
            src="https://wallpapers.com/images/featured/pfp-pictures-ph6qxvz14p4uvj2j.jpg"
            alt=""
            className="w-30 rounded-full"
          />
          <span className="font-bold text-2xl">{friendInfo.fullName}</span>
          <span className="text-[#20B69D] text-sm bg-[#D4EBE7] px-3 py-0.5 rounded-full">
            {friendInfo.score}
          </span>
          <span className="text-gray-500 text-sm">UID: {friendInfo.uid}</span>
          <span
            onClick={addFriend}
            id="addFriendButtonMobile"
            className="bg-[#20B69D] mt-5 text-white py-1 px-3 rounded-full cursor-pointer hover:bg-[#1b9c87]"
          >
            Add Friend
          </span>
        </div>
      </div>
    </>
  );
};

export default Friends;
