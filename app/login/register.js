import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";

export async function isRegister(session) {
  let sessionInfo = await session.user

  const registerURL = "http://localhost:8080/register"
//   let userEntry = {
//     fullName: sessionInfo.name,
//     email: sessionInfo.email,
//     groups: [],
//     friends: [],
//     lend: 0,
//     borrow: 0,
//     score: 500,
//   };
let userEntry = {
    fullName: "Example Example",
    email: "example@example.com",
    groups: [],
    friends: [],
    lend: 0,
    borrow: 0,
    score: 500,
  };
  const sendData = await fetch(registerURL, {
    method: "POST",
    headers: {
      "Content-Type": "registeration/json",
    },
    body: JSON.stringify(userEntry),
  });
}
