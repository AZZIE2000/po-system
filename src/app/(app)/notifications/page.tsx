import { api } from "@/trpc/react";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(0);

  const { data, fetchNextPage } =
    api.notification.getAllInfinite.useInfiniteQuery(
      {
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const toShow = data?.pages[page]?.notifications;
  return (
    <div>
      {toShow?.map((notification) => (
        <div key={notification.notificationId}>
          <p>{notification.text}</p>
        </div>
      ))}
    </div>
  );
}
