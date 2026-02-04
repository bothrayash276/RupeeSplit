"use client";
import React from "react";
import { useSession } from "next-auth/react";
import {redirect, RedirectType} from "next/navigation"
import ShortUniqueId from "short-unique-id";

const Register = () => {
  // Loads User Session
  const { data: session, status } = useSession();

  // Generates User Unique Id (UID)
  const uid = new ShortUniqueId({length: 5})


  if (status == "authenticated") {
    // Template of New User
    const userEntry = {
      "fullName" : session.user.name,
      "email" : session.user.email,
      "uid" : uid.rnd(),
      "friends": [],
      "groups": [],
      "lend": 0,
      "owe": 0,
      "score": 70,
      "doesExist": true,
    };

    // Connecting to Backend to send new user's data via POST
    fetch(`${process.env.NEXT_PUBLIC_MONGO_URI}/register`, {
      'method': 'POST',
      'body': JSON.stringify(userEntry),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    
    // Redirects to Dashboard of User
    .then( redirect('/dashboard', RedirectType.replace) );
  }
  return <></>
};

export default Register;
