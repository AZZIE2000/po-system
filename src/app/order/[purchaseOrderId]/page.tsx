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
      <div className="min-h-[297mm] w-[210mm] space-y-5 border p-5">
        <div className="flex items-center justify-between">
          <Image src="/logo.png" alt="logo" width={100} height={300} />
          <div>
            <small>{purchaseOrder?.purchaseOrderId}</small>
            <div>{purchaseOrder?.createdAt.toDateString()}</div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-2">
          <div className="col-span-1 space-y-2">
            <p>
              <span className="font-bold">Company: </span>
              {purchaseOrder?.PurchaseOrderDetails?.company.companyName}
            </p>
            <p>
              <span className="font-bold">Project: </span>
              {purchaseOrder?.PurchaseOrderDetails?.project.projectName}
            </p>
            <p>
              <span className="font-bold">Contact Person: </span>
              {purchaseOrder?.PurchaseOrderDetails?.contactName}
            </p>
            <p>
              <span className="font-bold">Contact Phone: </span>
              {purchaseOrder?.PurchaseOrderDetails?.contactNumber}
            </p>
          </div>
          <div className="col-span-1 space-y-2">
            <p>
              <span className="font-bold">Payment Method: </span>
              {purchaseOrder?.PurchaseOrderDetails?.paymentMethod?.toLowerCase()}
            </p>
            <p>
              <span className="font-bold">Payment Info: </span>
              {purchaseOrder?.PurchaseOrderDetails?.paymentMethod === "CLIQ"
                ? purchaseOrder?.PurchaseOrderDetails.cliq
                : purchaseOrder?.PurchaseOrderDetails?.paymentMethod ===
                    "bankTransfer"
                  ? purchaseOrder?.PurchaseOrderDetails.iban
                  : purchaseOrder?.PurchaseOrderDetails?.paymentMethod ===
                      "cheque"
                    ? purchaseOrder?.PurchaseOrderDetails.nameOnCheque
                    : ""}
            </p>
          </div>
        </div>
        <hr className="my-4" />
        {purchaseOrder?.PurchaseOrderDetails?.description && (
          <div>
            Notes:
            <br />
            {purchaseOrder?.PurchaseOrderDetails?.description}
          </div>
        )}
        <hr />
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Tax Ammount</TableHead>
                <TableHead className="w-fit">Pretax</TableHead>
                <TableHead className="w-fit">Taxed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrder?.PurchaseOrderDetails?.PurchaseOrderItems.map(
                (item, i) => (
                  <TableRow key={i}>
                    <TableCell className="w-[300px] font-medium">
                      {item.description}
                    </TableCell>
                    <TableCell>{item.taxAmmount}</TableCell>
                    <TableCell>{item.priceNoTax}</TableCell>
                    <TableCell>{item.priceTax}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Tax</TableCell>
                <TableCell>{0}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>
                  {purchaseOrder?.PurchaseOrderDetails?.totalAmount}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
