"use client";
import { getServerAuthSession } from "@/server/auth";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const SignOut = () => {
  const session = useSession(); // to get the client auth
  return (
    <div>
      <div>{JSON.stringify(session.data)}</div>
      <button
        onClick={() => {
          signOut({ callbackUrl: "/login" });
        }}
      >
        BYEEEE
      </button>
    </div>
  );
};

export default SignOut;
