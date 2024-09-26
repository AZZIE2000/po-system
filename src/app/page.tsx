import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { getServerAuthSession } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { signOut, useSession } from "next-auth/react";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex h-screen items-center justify-center">
        {session?.user.username}
        <button
          onClick={() => {
            signOut({ callbackUrl: "/login" });
          }}
          className="bg-red-300 p-4 text-center text-white"
        >
          Sign out
        </button>
      </main>
    </HydrateClient>
  );
}
