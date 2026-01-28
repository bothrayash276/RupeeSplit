"use client";
import React from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect, RedirectType } from "next/navigation"


const Login = () => {
  // Loads user session
  const {data:session, status} = useSession()

  // As user log's in, redirect him to register page.
  if(status === 'authenticated'){
    redirect('/register', RedirectType.replace)
  }


  return (
    <>
      <div className="h-full w-full flex flex-col justify-evenly items-center">
        <div className="flex flex-col gap-4 items-center justify-center">
          <img src="/logo.png" className="w-15" alt="" />
          <span className="font-bold text-3xl">RupeeSplit</span>
        </div>
        <div className="flex flex-col gap-10 h-80 justify-center">
          {/* Session Providers */}
          <div
            onClick={() => {
              signIn("google");
            }}
            className="flex gap-4 items-center justify-center border border-slate-300 py-2 px-12 bg-slate-200 rounded-2xl cursor-pointer hover:bg-slate-300"
          >
            <img src="/google.png" className="w-8" alt="" />
            <span>Continue to Google</span>
          </div>

          <div
            onClick={() => {
              signIn("github");
            }}
            className="flex gap-4 items-center justify-center border border-slate-300 py-2 px-12 bg-slate-200 rounded-2xl cursor-pointer hover:bg-slate-300 q "
          >
            <img src="/github.png" className="w-8" alt="" />
            <span>Continue to GitHub</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
