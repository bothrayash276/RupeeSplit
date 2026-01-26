"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {redirect, RedirectType} from "next/navigation"
import ShortUniqueId from "short-unique-id";

const Register = () => {
  const { data: session, status } = useSession();
  const uid = new ShortUniqueId({length: 5})

  if (status == "authenticated") {
    const userEntry = {
      "fullName" : session.user.name,
      "email" : session.user.email,
      "uid" : uid.rnd(),
      "friends": [],
      "groups": [],
      "lend": 0,
      "owe": 0,
      "score": 500,
      "doesExist": true,
    };
    localStorage.setItem('userData', JSON.stringify(userEntry))
    fetch("http://localhost:8080/register", {
      'method': 'POST',
      'body': JSON.stringify(userEntry),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then( redirect('/dashboard', RedirectType.replace));
  }
  return (
    <>

    </>
  );
};

export default Register;
