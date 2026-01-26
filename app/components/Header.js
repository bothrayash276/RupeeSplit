"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams, usePathname } from "next/navigation";

const Header = () => {
  const path = usePathname();
  const { data: session, status } = useSession();
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
          <img src="/logo.png" alt="" className="w-10" />
          <span className="font-bold">RupeeSplit</span>
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
              className="w-10 cursor-pointer"
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
                {/* Dashboard */}
              <li>
          <Link
            href={"/dashboard"}
            className={`${path == "/dashboard" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/dashboard"
                  ? "/dashboard_active.svg"
                  : "/dashboard_inactive.svg"
              }
              alt=""
              className="w-5 h-5"
            />
            Dashboard
          </Link>
              </li>
                {/* Groups */}
              <li>
          <Link
            href={"/groups"}
            className={`${path == "/groups" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/groups"
                  ? "/group_active.svg"
                  : "/group_inactive.svg"
              }
              alt=""
              className="w-5 h-5"
            />
            Groups
          </Link>
              </li>
                {/* Friends */}
              <li>
          <Link
            href={"/friends"}
            className={`${path == "/friends" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/friends"
                  ? "/addFriend_active.svg"
                  : "/addFriend_inactive.svg"
              }
              alt=""
              className="w-5 h-5"
            />
            Friends
          </Link>
              </li>
                {/* Settings */}
              <li>
          <Link
            href={"/settings"}
            className={`${path == "/settings" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/settings"
                  ? "/settings_active.gif"
                  : "/settings_inactive.gif"
              }
              alt=""
              className="w-5 h-5"
            />
            Settings
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
      <div className="not-lg:hidden h-18 border border-b border-slate-200 flex items-center justify-between gap-10 px-4">
        {/* Logo and Website Name */}
        <Link
          href={"/"}
          className="flex items-center gap-1 mr-10 cursor-pointer"
        >
          <img src="/logo.png" alt="" className="w-10" />
          <span className="font-bold">RupeeSplit</span>
        </Link>
        {/* Navigating Elements */}
        <div className={` ${session ? "" : "hidden"} flex-1 flex gap-10 justify-start`}>
          {/* Dashboard */}
          <Link
            href={"/dashboard"}
            className={`${path == "/dashboard" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/dashboard"
                  ? "/dashboard_active.svg"
                  : "/dashboard_inactive.svg"
              }
              alt=""
              className="w-5 h-5"
            />
            Dashboard
          </Link>
          {/* Groups */}
          <Link
            href={"/groups"}
            className={`${path == "/groups" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/groups"
                  ? "/group_active.svg"
                  : "/group_inactive.svg"
              }
              alt=""
              className="w-5 h-5"
            />
            Groups
          </Link>
          {/* Friends */}
          <Link
            href={"/friends"}
            className={`${path == "/friends" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/friends"
                  ? "/addFriend_active.svg"
                  : "/addFriend_inactive.svg"
              }
              alt=""
              className="w-5 h-5"
            />
            Friends
          </Link>
          {/* Settings */}
          <Link
            href={"/settings"}
            className={`${path == "/settings" ? "text-[#279B88] font-bold bg-[#D4EBE7]" : "text-[#67837F]"} flex gap-2 items-center justify-center py-2 px-4 rounded-full`}
          >
            <img
              src={
                path == "/settings"
                  ? "/settings_active.gif"
                  : "/settings_inactive.gif"
              }
              alt=""
              className="w-5 h-5"
            />
            Settings
          </Link>
        </div>
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
              className="w-10 cursor-pointer"
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
              {/* SignOut Button */}
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
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
