"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);

  const handleAvatar = () => {
    if (session) {
      setDropdown(true);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      {/* Header Container - Mobile UI */}
      <div className="lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4">
        {/* Logo and Website Name */}
        <Link href={"/"} className="flex items-center gap-1 cursor-pointer">
          <img src="/logo.png" alt="" className="w-8" />
          <span className="font-bold">RupeeSplit</span>
        </Link>
        {/* Dashboard Button */}
        <Link
          href={"/dashboard"}
          className={`${session ? "" : "hidden"} bg-[#299C89] text-white px-3 py-2 rounded-full flex gap-2`}
        >
          <img src="/dashboard.gif" className="w-6 h-6" alt="" />
          Dashboard
        </Link>
        {/* Avatar */}
        <div className="relative">
          <button
            onBlur={() => {
              setTimeout(() => {
                setDropdown(false);
              }, 300);
            }}
          >
            <img
              onClick={handleAvatar}
              className="w-8 cursor-pointer"
              src="/avatar.gif"
              alt=""
            />
          </button>
          {/* Dropdown */}
          <div
            id="dropdown"
            className={`z-10 ${dropdown ? "" : "hidden"} bg-slate-200 border border-slate-300 rounded-xl shadow-lg w-44 absolute right-0 top-12`}
          >
            <ul
              className="p-2 text-sm text-body font-medium"
              aria-labelledby="dropdownDefaultButton"
            >
              {/* Profile Button */}
              <li>
                <Link
                  href={"#"}
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Profile
                </Link>
              </li>
              {/* SignOut Button */}
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Header Container - Laptop UI */}
      <div className="not-lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between gap-10 px-4">
        {/* Logo and Website Name */}
        <Link
          href={"/"}
          className="flex items-center gap-1   flex-1 cursor-pointer"
        >
          <img src="/logo.png" alt="" className="w-8" />
          <span className="font-bold">RupeeSplit</span>
        </Link>
        {/* Dashboard Button */}
        <Link
          href={"/dashboard"}
          className={`${session ? "" : "hidden"} bg-[#299C89] text-white px-3 py-2 rounded-full flex gap-2`}
        >
          <img src="/dashboard.gif" className="w-6 h-6" alt="" />
          Dashboard
        </Link>
         {/* Avatar */}
        <div className="relative">
          <button
            onBlur={() => {
              setTimeout(() => {
                setDropdown(false);
              }, 300);
            }}
          >
            <img
              onClick={handleAvatar}
              className="w-8 cursor-pointer"
              src="/avatar.gif"
              alt=""
            />
          </button>
          {/* Dropdown */}
          <div
            id="dropdown"
            className={`z-10 ${dropdown ? "" : "hidden"} bg-slate-200 border border-slate-300 rounded-xl shadow-lg w-44 absolute right-0 top-12`}
          >
            <ul
              className="p-2 text-sm text-body font-medium"
              aria-labelledby="dropdownDefaultButton"
            >
              {/* Profile Button */}
              <li>
                <Link
                  href={"#"}
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Profile
                </Link>
              </li>
              {/* SignOut Button */}
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
