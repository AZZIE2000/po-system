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

const LoginForm = () => {
  // const session = await getServerAuthSession();
  const [form, setForm] = useState({
    email: "admin@po.com",
    password: "1P@ssw0rd",
  });
  // const signUp = api.user.register.useMutation({
  //   onSuccess: (d) => {
  //     console.log("DONNEEE", d);
  //   },
  //   onError: (e) => {
  //     console.log("ERROR AZZIE", e);
  //   },
  // });

  const handleSubmit = async () => {
    signIn("credentials", {
      ...form,
      callbackUrl: "/purchaseOrder",
    });
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
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
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
