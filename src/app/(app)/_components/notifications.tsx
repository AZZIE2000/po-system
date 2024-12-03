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

export const Notifications = () => {
  const router = useRouter();
  const { data: unreadNotifications, refetch } =
    api.notification.getUnseenCount.useQuery();

  const handleMarkAsViewed = (notificationId: string) => {
    api.notification.markAsViewed
      .useMutation({
        onSuccess: () => {
          router.push("/purchaseOrder/manage/" + notificationId);
        },
      })
      .mutate({ notificationId });
  };

  const handleMarkAllAsSeen = () => {
    api.notification.markAllAsSeen
      .useMutation({
        onSuccess: () => {
          refetch();
        },
      })
      .mutate();
  };
  const { data: notifications, refetch: refetchNotifications } =
    api.notification.getLastTen.useQuery();

  return (
    <Popover>
      <PopoverTrigger
        asChild
        onClick={() => {
          refetchNotifications();
          if (unreadNotifications && unreadNotifications > 0) {
            handleMarkAllAsSeen();
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
      <PopoverContent className="mr-5 max-h-[600px] w-80 overflow-y-auto">
        {notifications && notifications?.length > 0 ? (
          <>
            <p className="text-lg font-semibold">Notifications</p>
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`${notification.viewed ? "bg-slate-50" : "bg-slate-300"} flex cursor-pointer flex-col gap-2 p-5`}
                  onClick={() => {
                    handleMarkAsViewed(notification.notificationId);
                  }}
                >
                  <div className="flex justify-between">
                    <p>{notification.text}</p>
                    {!notification.viewed && <Dot size={28} />}
                  </div>
                  <p className="self-end text-xs text-gray-700">
                    {format(notification.createdAt, "h:mm a")}
                  </p>
                </div>
              ))}
              <Button variant={"outline"} className="w-full">
                View All Notifications
              </Button>
            </div>
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
