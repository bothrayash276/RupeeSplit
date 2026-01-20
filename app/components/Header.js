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
      <div className="lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4">
        <Link href={"/"} className="flex items-center gap-1 cursor-pointer">
          <img src="/logo.png" alt="" className="w-8" />
          <span className="font-bold">RupeeSplit</span>
        </Link>
        <div className="relative">
          <img
            onClick={handleAvatar}
            className="w-8 cursor-pointer"
            src="/avatar.gif"
            alt=""
          />
          <div
            onMouseLeave={() => {
              setDropdown(false);
            }}
            className={`${dropdown ? "" : "hidden"} absolute right-0`}
          >
            <Link href={"/dashboard"}>Dashboard</Link>
            <button
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="not-lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4">
        <Link href={"/"} className="flex items-center gap-1 cursor-pointer">
          <img src="/logo.png" alt="" className="w-8" />
          <span className="font-bold">RupeeSplit</span>
        </Link>
        <div className="relative">
          <img
            onClick={handleAvatar}
            className="w-8 cursor-pointer"
            src="/avatar.gif"
            alt=""
          />

          <div
            id="dropdown"
            onMouseLeave={()=>{setTimeout(() => {
              setDropdown(false)
            }, 300);}}
            className={`z-10 ${dropdown ? "": "hidden"} bg-slate-200 border border-slate-300 rounded-xl shadow-lg w-44 absolute right-0`}
          >
            <ul
              className="p-2 text-sm text-body font-medium"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={"#"}
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Profile
                </Link>
              </li>
              
              <li>
                <button
                  onClick={()=>{signOut()}}
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
