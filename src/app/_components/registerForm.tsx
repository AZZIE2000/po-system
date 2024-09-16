"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });
  const router = useRouter();
  const signUp = api.user.register.useMutation({
    onSuccess: (d) => {
      console.log("DONNEEE", d);
      router.push("/login");
    },
    onError: (e) => {
      console.log("ERROR AZZIE", e);
    },
  });

  const handleSubmit = async () => {
    signUp.mutate(form);
  };

  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">
      <div>
        <label htmlFor="name">user name</label>
        <div>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            type="text"
            placeholder="azzie"
          />
        </div>
      </div>
      <div>
        <label htmlFor="name">email</label>
        <div>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="text"
            placeholder="asda@sadas.com"
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

export default RegisterForm;
