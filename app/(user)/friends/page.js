"use client";
import serverData_User from "@/app/_data";
import PageLoading from "@/app/Loading";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Friends = () => {
  // Checks if page is loaded or not
  const [loading, setLoading] = useState(true)

  // Loads user session
  const {data:session, status} = useSession()

  // Stores user info
  const [myinfo, setMyinfo] = useState()
  const [myfriends, setMyfriends] = useState()
  // Stores friends info
  const [friendInfo, setFriendInfo] = useState({ doesExist: true });

  // Checks if entered UID is valid or not
  const [invalidUID, setInvalidUID] = useState(false);
  const [emptyInbox, setEmptyInbox] = useState(false);

  // Checks if data is fetched or not
  const [fetched, setFetched] = useState(false);

  // Function when search button is clicked
  const findFriend = () => {
    // Gets UID of friend from input box
    let userUID = document.getElementById("uidSearchBox").value;
    if (!userUID) userUID = document.getElementById("uidSearchBoxMobile").value;
    if(!userUID) {
      setEmptyInbox(true)
      setFetched(false)
      setTimeout(() => {
        setEmptyInbox(false)
      }, 1000);
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_MONGO_URI}/findFriend/${userUID}`)
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
      document.getElementById("uidSearchBox")?.value ||
      document.getElementById("uidSearchBoxMobile")?.value
    ) {
      setFetched(true);
    }
  }, [friendInfo]);

  useEffect(() => {
    const load = async () => {
      if(status==='authenticated'){
        try {
          const data = await serverData_User(session.user.email)
          setMyinfo(data)
          const friend = data.friends?.map((friendID) => {
            const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/findFriend/${friendID}`
            const data = fetch(url).then(res=>res.json())
            return data
          })
          await Promise.all(friend).then( value => setMyfriends(value))          
        }
        finally {
          setLoading(false)
        }
      }
    }
    load()
  }, [status])


  const addFriend = async () => {
    alert('Friend Added Successfully!')
    const myUserFriends = [...myinfo.friends, friendInfo.uid];
    const myFriendFriends = [...friendInfo.friends, myinfo.uid];
    const myUser = {
      ...myinfo,
      friends: myUserFriends,
    };
    setMyinfo(myUser)
    const friendUser = {
      ...friendInfo,
      friends: myFriendFriends,
    };
    await fetch(`${process.env.NEXT_PUBLIC_MONGO_URI}/addFriend`, {
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

  if(loading){
    return <><PageLoading/></>
  }

  return (
    <>
      {/* Laptop UI */}
      <div className="not-md:hidden flex flex-col h-full w-full items-center justify-center">
        <div className="bg-white w-8/10 flex flex-col gap-4 items-center justify-center mt-10 py-5 rounded-lg">
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
          <span className={`${emptyInbox ? "" : "hidden"} text-red-500`}>
          Inbox cannot be empty!
        </span>
        </div>
        <div
          className={`${fetched ? "" : "hidden"} w-8/10 flex flex-col gap-3 items-center justify-center bg-white py-5 px-10 rounded-lg`}
        >
          <img
            src="https://wallpapers.com/images/featured/pfp-pictures-ph6qxvz14p4uvj2j.jpg"
            alt=""
            className="w-30 rounded-full"
          />
          <span className="font-bold text-2xl">{friendInfo.fullName}</span>
          <span className="text-[#20B69D] text-sm bg-[#D4EBE7] px-3 py-0.5 rounded-full font-bold">
            TRUST: {friendInfo.score}
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

        {/* Displaying Friends */}
        <div
        className="bg-white w-8/10 p-3 rounded-xl flex flex-col gap-3">
          
          {/* Title and Icon */}
          <div
          className="flex gap-3 text-xl font-bold">
            <img src="/friends.svg" alt="" className="w-6"/>
            Friends
          </div>

          {
            myfriends?.map(friend => {
              return (
                <div
                key={`${friend.uid} container`}
                className="flex gap-3 items-center">
                  <div className="flex gap-4 mt-3 items-center">
              {/* Pfp Image */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s"
                alt=""
                className="w-20 rounded-full"
              />
              {/* Container storing Name, UID and Score */}
              <div className="flex flex-col flex-1 gap-2">
                <span className="font-bold text-xl">{friend.fullName}</span>
                <span className="font-bold text-[#2A9D89] bg-[#D4EBE7] w-32 text-center rounded-full text-sm">
                  TRUST: {friend.score}
                </span>
              </div>
            </div>
                </div>
              )
            })
          }
        </div>
      </div>

      {/* Mobile UI */}
      <div className="md:hidden flex flex-col gap-10 h-full w-full items-center justify-center">
        {/* Search Bar */}
       <div
       className="w-full flex flex-col items-center">
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
        <span className={`${emptyInbox ? "" : "hidden"} text-red-500`}>
          Inbox cannot be empty!
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
          <span className="text-[#20B69D] text-sm bg-[#D4EBE7] px-3 py-0.5 rounded-full font-bold">
            TRUST: {friendInfo.score}
          </span>
          <span className="text-gray-500 text-sm">UID: {friendInfo.uid}</span>
          <span
            onClick={addFriend}
            id="addFriendButtonMobile"
            className="bg-[#20B69D] mt-5 text-white py-1 px-3 rounded-full cursor-pointer hover:bg-[#1b9c87]"
          >
            Add Friend
          </span>
        </div></div> 

        {/* Displaying Friends */}
        <div
        className="w-9/10 p-3 rounded-xl flex flex-col gap-3">
          
          {/* Title and Icon */}
          <div
          className="flex gap-3 text-xl font-bold">
            <img src="/friends.svg" alt="" className="w-6"/>
            Friends
          </div>

          {
            myfriends?.map(friend => {
              return (
                <div
                key={`${friend.uid} container`}
                className="flex gap-3 items-center">
                  <div className="flex gap-4 mt-3 items-center">
              {/* Pfp Image */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s"
                alt=""
                className="w-15 h-15 rounded-full"
              />
              {/* Container storing Name, UID and Score */}
              <div className="flex flex-col flex-1 gap-2">
                <span className="font-bold">{friend.fullName}</span>
                <span className="font-bold text-[#2A9D89] bg-[#D4EBE7] w-32 text-center rounded-full text-sm">
                  TRUST: {friend.score}
                </span>
              </div>
            </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
};

export default Friends;
