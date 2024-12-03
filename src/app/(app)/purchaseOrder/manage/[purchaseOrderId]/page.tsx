"use client";
import React from "react";
import { notFound, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PuchaseOrderView from "@/app/_components/puchaseOrderView";
import { useSession } from "next-auth/react";
import SimpleCard from "../../_components/simple-card";
import { useRouter } from "next/navigation";

const Page = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const router = useRouter();
  const {
    data: purchaseOrder,
    status: poStatus,
    isLoading,
    refetch: refetchPO,
  } = api.purchaseOrder.getOne.useQuery({
    purchaseOrderId,
  });
  const session = useSession();
  console.log(purchaseOrder);

  if (!purchaseOrder) return notFound();
  if (
    (purchaseOrder?.status !== "toReview" &&
      purchaseOrder?.status !== "toApprove") ||
    session.data?.user.id !== purchaseOrder.userReviewId ||
    session.data?.user.id !== purchaseOrder.userApproveId
  ) {
    router.push("/order/" + purchaseOrderId);
  }
  return (
    <div className="grid grid-cols-2 p-3">
      <div>
        <PuchaseOrderView flexable purchaseOrder={purchaseOrder as any} />
      </div>
      <SimpleCard
        title={
          purchaseOrder?.status === "toReview"
            ? "Review Purchase Order"
            : "Approve Purchase Order"
        }
      >
        asdasd
      </SimpleCard>
    </div>
  );
};

export default Page;
