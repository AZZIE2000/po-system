import { getServerAuthSession } from "@/server/auth";
import { notFound } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerAuthSession();

  if (!session || session.user.role.role !== "admin") {
    return notFound();
  }
  return <>{children};</>;
};

export default Layout;
