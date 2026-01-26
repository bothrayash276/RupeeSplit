"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const [user, setUser] = useState({ score: 0 });
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      async function getData() {
        fetch(`http://localhost:8080/find/${session.user.email}`)
          .then((res) => res.json())
          .then((res) => setUser(res));
      }
      getData();
    }
  }, [status]);

  const scoreBorder = () => {
    if (user.score <= 400) {
      return "border-red-500/50";
    } else if (user.score >= 400 && user.score <= 700) {
      return "border-yellow-500/50";
    } else {
      return "border-greeb-600/50";
    }
  };

  const scoreReview = () => {
    if (user.score <= 400) {
      return "Critical Score";
    } else if (user.score >= 400 && user.score <= 700) {
      return "Average Score";
    } else {
      return "Great Score";
    }
  };

  return (
    <>
      {/* Mobile UI */}
      <div className="flex flex-col gap-5 md:hidden h-full w-full items-center">
        {/* Score */}
        <div className="flex flex-col items-center justify-center">
          <span
            className={`border-10 font-bold text-3xl ${scoreBorder()} w-35 h-35 rounded-full flex items-center justify-center `}
          >
            {user.score}
          </span>
          <span className="text-xl font-bold mt-10">{scoreReview()}</span>
        </div>
        {/* Owed and Lend Container */}
        <div className="flex gap-3 w-full px-5">
          <div className="bg-white rounded-lg flex flex-col flex-1 p-2 px-6">
              <img src="/increase.gif" alt="" className="w-5" />
              <span className="text-gray-500 text-sm font-bold mt-1">YOU ARE OWED</span>
              <span className="text-green-500 font-bold text-2xl mt-4">&#8377; {user.lend}</span>
          </div>
          <div className="bg-white rounded-lg flex flex-col flex-1 p-2 px-6">
              <img src="/decrease.gif" alt="" className="w-5" />
              <span className="text-gray-500 text-sm font-bold mt-1">YOU OWE</span>
              <span className="text-red-500 font-bold text-2xl mt-4">&#8377; {user.owe}</span>
          </div>
        </div>
      </div>

    </>
  );
};

export default Dashboard;
