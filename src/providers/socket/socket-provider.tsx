"use client";
import React, { useEffect } from "react";
import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { User } from "@prisma/client";
const client = new Ably.Realtime({
  key: "zP7ybw.wIV8IA:ayfGjijFL0A-syxr8SnzQ94Bf3HTRaky7-v_U2vQ5SE",
});
const SocketProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="notifications">{children}</ChannelProvider>
    </AblyProvider>
  );
};

export default SocketProvider;
