"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { getServerAuthSession } from "@/server/auth";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  // const session = await getServerAuthSession();
  const [form, setForm] = useState({
    email: "dudu@mo.com",
    password: "1234",
  });
  const signUp = api.user.register.useMutation({
    onSuccess: (d) => {
      console.log("DONNEEE", d);
    },
    onError: (e) => {
      console.log("ERROR AZZIE", e);
    },
  });

  const handleSubmit = async () => {
    signIn("credentials", { ...form, callbackUrl: "/register" });
  };

  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">
      <div>
        <label htmlFor="name">email</label>
        <div>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            placeholder="email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="name">password</label>
        <div>
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            placeholder="**"
          />
        </div>
      </div>

      <button
        type="submit"
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default LoginForm;
