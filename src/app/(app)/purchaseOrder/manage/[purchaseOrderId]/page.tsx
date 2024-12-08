"use client";
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [form, setForm] = useState({ comment: "", status: "approve" });
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

  // if (!purchaseOrder) return notFound();
  // if (
  //   (purchaseOrder?.status !== "toReview" &&
  //     purchaseOrder?.status !== "toApprove") ||
  //   session.data?.user.id !== purchaseOrder.userReviewId ||
  //   session.data?.user.id !== purchaseOrder.userApproveId
  // ) {
  //   router.push("/order/" + purchaseOrderId);
  // }
  return (
    <div className="relative">
      <div className="grid justify-items-center p-3">
        <div>
          <PuchaseOrderView flexable purchaseOrder={purchaseOrder as any} />
        </div>
      </div>
      <div className="sticky flex w-full ring">
        <p>Review</p>
        <div>
          <Button>Approve</Button>
          <Button>Reject</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
