"use client";
import React from "react";
import { useState, useEffect } from "react";

const Settings = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    setUser(data);
  }, []);

  const handleSaveMobile = async () => {
    const name = document.getElementById(
      "fullNameBox-Mobile").value;
    const newData = {
      ...user,
      fullName: name,
    };
    setUser(newData);
    localStorage.setItem("userData", JSON.stringify(newData));
    console.log(newData);
    await fetch("http://localhost:8080/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    alert("Changes saved Successfully");
  };
  const handleSaveLaptop = async () => {
    const name = document.getElementById(
      "fullNameBox-Laptop").value;
    const newData = {
      ...user,
      fullName: name,
    };
    setUser(newData);
    localStorage.setItem("userData", JSON.stringify(newData));
    console.log(newData);
    await fetch("http://localhost:8080/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    alert("Changes saved Successfully");
  };
  if (!user) {
    return <>Please Wait</>;
  }
  return (
    <>
      {/* Laptop UI */}
      <div className="not-md:hidden w-full h-full">
        <div className="flex flex-col px-5 mt-5">
          <span className="font-bold text-3xl">Settings</span>
          <div className="flex items-center">
            <span className="text-gray-500 flex-1">
              Customize your profile, manage groups and friends
            </span>
            <span
              onClick={handleSaveLaptop}
              className="text-white bg-[#2A9D89] px-5 py-3 rounded-full cursor-pointer hover:bg-[#258b7a]"
            >
              Save Changes
            </span>
          </div>
        </div>
        <div className="h-full w-full p-3 mt-5 flex items-center justify-center">
          {/* White Container */}
          <div className="flex flex-col gap-10 bg-white w-8/10 p-5 rounded-xl">
            {/* Text - Profile Information */}
            <span className="font-bold">Profile Information</span>
            {/* Container Storing Profile Information */}
            <div className="flex gap-4 mt-3 items-center">
              {/* Pfp Image */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s"
                alt=""
                className="w-20 rounded-full"
              />
              {/* Container storing Name, UID and Score */}
              <div className="flex flex-col flex-1 ">
                <span className="font-bold text-xl">{user.fullName}</span>
                <span className="font-bold text-gray-500 text-sm mb-2">UID: {user.uid}</span>
                <span className="font-bold text-[#2A9D89] bg-[#D4EBE7] w-15 text-center rounded-full text-sm">
                  {user.score}
                </span>
              </div>
            </div>
            {/* Editing Inputs */}
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col">
                <span className="font-bold text-sm">Full Name</span>
                <input
                  type="text"
                  id="fullNameBox-Laptop"
                  defaultValue={user.fullName}
                  className="w-full border border-gray-200 px-3 py-2 rounded-2xl"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="font-bold text-sm">Email Address</span>
                <span className="w-full border border-gray-200 px-3 py-2 rounded-2xl text-gray-400 focus:outline-none">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile UI */}
      <div className="md:hidden w-full h-full mt-10">
        {/* Profile Information */}
        <div className="flex flex-col items-center justify-center">
          {/* Pfp Image */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyCG3jGw_PZPj17ttBPAPxdgPdpLO020L9g&s"
            alt=""
            className="w-25 rounded-full"
          />
          {/* Score */}
          <span className="font-bold text-[#2A9D89] bg-[#D4EBE7] w-15 text-center rounded-full text-sm mt-3">
            {user.score}
          </span>
          
          {/* Full Name */}
          <div className="flex items-center mt-5">
            <input
              type="text"
              id="fullNameBox-Mobile"
              defaultValue={user.fullName}
              className="px-3 py-2 rounded-2xl focus:outline-none text-center text-xl font-bold"
            />
            <img src="/edit.svg" alt="" />
          </div>
          {/* Email */}
          <span className="text-gray-500 text-sm">{user.email}</span>
          {/* UID */}
          
          <span className="text-gray-500 text-sm mb-7 font-bold">UID: {user.uid}</span>
          {/* Save Changes Button */}
          <span
            onClick={handleSaveMobile}
            className="text-white bg-[#2A9D89] px-5 py-2 rounded-full cursor-pointer hover:bg-[#258b7a]"
          >
            Save Changes
          </span>
        </div>
      </div>
    </>
  );
};

export default Settings;
