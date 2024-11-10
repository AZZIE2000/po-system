"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { getServerAuthSession } from "@/server/auth";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
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
      router.push("/");
    },
    onError: (e) => {
      const errArr = JSON.parse(e.message);
      for (const err of errArr) {
        toast(err.message, {
          type: "error",
          position: "bottom-right",
        });
      }
    },
  });

  const handleSubmit = async () => {
    signUp.mutate(form);
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your information below to register a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">User name</Label>
            <Input
              id="username"
              type="text"
              placeholder="john doe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Sign Up
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
