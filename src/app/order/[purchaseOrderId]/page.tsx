"use client";
import React from "react";
import { useParams } from "next/navigation";
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

const Page = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const {
    data: purchaseOrder,
    status: poStatus,
    isLoading,
    refetch: refetchPO,
  } = api.purchaseOrder.getOne.useQuery({
    purchaseOrderId,
  });
  return (
    <div className="flex w-full items-center justify-center p-5">
      <PuchaseOrderView purchaseOrder={purchaseOrder as any} />
    </div>
  );
};

export default Page;
