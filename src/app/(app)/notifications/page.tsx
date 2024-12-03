import { api } from "@/trpc/react";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.notification.getAllInfinite.useInfiniteQuery(
      {
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [observerRef, hasNextPage, fetchNextPage]);

  const allData = data?.pages.flatMap((page) => page.notifications) ?? [];

  const handleMarkAsViewed = (notificationId: string) => {
    api.notification.markAsViewed
      .useMutation({
        onSuccess: () => {
          router.push("/purchaseOrder/manage/" + notificationId);
        },
      })
      .mutate({ notificationId });
  };

  return (
    <div className="flex w-[60%] flex-col items-center justify-center gap-2 px-20">
      {allData.map((notification) => (
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
      <div ref={observerRef}>
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Scroll down to load more"
            : "No more data"}
      </div>
    </div>
  );
}
