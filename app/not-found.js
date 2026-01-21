import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <div className="h-full w-full flex flex-col items-center gap-10">
        <img src="/page_not_found.png" alt="" className="w-50" />
        <div className="flex flex-col items-center justify-center">
          <span className="font-bold text-6xl text-[#A0DED4] mb-2">404</span>
          <span className="font-bold text-xl mb-2">Page Not Found</span>
          <span className="text-gray-500 text-sm">
            Oops! This page seems to have split away.
          </span>
          <span className="text-gray-500 text-sm">
            Lets get you back on track.
          </span>
        </div>
        <Link
          href={"/"}
          className="bg-[#20B69D] px-9 py-3 rounded-xl min-w-80 text-white flex gap-3 items-center justify-center font-bold absolute bottom-10"
        >
          <img src="/home.gif" alt="" className="w-6 h-6" />
          Return To Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
