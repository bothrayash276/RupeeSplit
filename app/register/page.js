"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {redirect, RedirectType} from "next/navigation"

const Register = () => {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    const userEntry = {
      "fullName" : session.user.name,
      "email" : session.user.email,
      "friends": [],
      "groups": [],
      "lend": 0,
      "owe": 0,
      "score": 500,
      "doesExist": true,
    };
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
