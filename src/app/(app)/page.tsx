"use client";
import dynamic from "next/dynamic";
import { PoTable } from "./_components/po-table";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { Button } from "@/components/ui/button";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const session = useSession(); // to get the client auth

  redirect("/purchaseOrder");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="p aspect-video rounded-xl bg-muted/50"></div>
        <div className="aspect-video rounded-xl bg-muted/50"></div>
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Button
          onClick={() => {
            // channel.publish("first", "Here is my first message!");
          }}
        >
          send
        </Button>
      </div>
    </div>
  );
}
