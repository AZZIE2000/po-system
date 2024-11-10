import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
