"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Dot } from "lucide-react";
import { api } from "@/trpc/react";
import { NotificationSVG } from "@/components/icons/notifications";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Notification } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useChannel } from "ably/react";
import { useSession } from "next-auth/react";

export const Notifications = () => {
  const router = useRouter();
  const session = useSession();
  const { data: unreadNotifications, refetch } =
    api.notification.getUnseenCount.useQuery();

  const handleMarkAsOpened = api.notification.markAsOpened.useMutation({
    onSuccess: () => {
      // router.push("/purchaseOrder/manage/" + notificationId);
    },
  });

  // const handleMarkAsOpened = (notificationId: string) => {
  // };

  const handleMarkAllAsSeen = api.notification.markAllAsSeen.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const { channel } = useChannel("notifications", "po-notifi", (message) => {
    console.log(message);
    if (session.data?.user.id === message.data) refetch();
  });
  const { data: notifications, refetch: refetchNotifications } =
    api.notification.getLastTen.useQuery();

  return (
    <Popover>
      <PopoverTrigger
        asChild
        onClick={() => {
          refetchNotifications();
          if (unreadNotifications && unreadNotifications > 0) {
            handleMarkAllAsSeen.mutate();
          }
        }}
      >
        <div className="relative cursor-pointer">
          <Bell className="" />
          {unreadNotifications && unreadNotifications > 0 ? (
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadNotifications}
            </div>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-5 max-h-[600px] w-96 overflow-y-auto">
        {notifications && notifications?.length > 0 ? (
          <>
            <p className="text-lg font-semibold">Notifications</p>
            <div className="my-5 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`${notification.opened ? "" : "bg-blue-100/50"} flex cursor-pointer flex-col gap-2 rounded-md border p-3`}
                  onClick={() => {
                    handleMarkAsOpened.mutate({
                      notificationId: notification.notificationId,
                    });
                    router.push(
                      "/purchaseOrder/manage/" + notification.purchaseOrderId,
                    );
                  }}
                >
                  <div className="flex justify-between">
                    <small>{notification.text}</small>
                  </div>
                  <p className="self-end text-xs text-gray-700">
                    {format(notification.createdAt, "h:mm a")}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant={"outline"}
              className="w-full"
              onClick={() => router.push("/notifications")}
            >
              View All Notifications
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-10">
            <p className="">No Notifications Yet</p>
            <div className="w-[80%]">
              <NotificationSVG />
            </div>
            <p className="text-center text-xs capitalize text-gray-500">
              We will notify you when something happens
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
