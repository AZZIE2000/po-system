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
import {
  Company,
  Project,
  PurchaseOrder,
  PurchaseOrderDetails,
  PurchaseOrderItem,
} from "@prisma/client";
const PuchaseOrderView = ({
  purchaseOrder,
  flexable = false,
}: {
  purchaseOrder: PurchaseOrder & {
    PurchaseOrderDetails: {
      company: Company;
      project: Project;
      PurchaseOrderItems: PurchaseOrderItem[];
    } & PurchaseOrderDetails;
  };
  flexable?: boolean;
}) => {

  return (
    <div
      className={`${flexable ? "h-full w-[210mm]" : "min-h-[297mm] w-[210mm]"} space-y-5 border p-5`}
    >
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
            {purchaseOrder?.PurchaseOrderDetails?.paymentMethod === "CLIQ" ? (
              <p>
                <span className="font-bold">
                  CLIQ <small>(Alias / number): </small>
                </span>
                {purchaseOrder?.PurchaseOrderDetails.cliq}
              </p>
            ) : purchaseOrder?.PurchaseOrderDetails?.paymentMethod ===
              "bankTransfer" ? (
              <p>
                <span className="font-bold">IBAN: </span>
                {purchaseOrder?.PurchaseOrderDetails.iban}
              </p>
            ) : purchaseOrder?.PurchaseOrderDetails?.paymentMethod ===
              "cheque" ? (
              <p>
                <span className="font-bold">Name On Cheque: </span>
                {purchaseOrder?.PurchaseOrderDetails.nameOnCheque}
              </p>
            ) : (
              ""
            )}
          </p>
          {!purchaseOrder?.PurchaseOrderDetails.installment &&
            purchaseOrder?.PurchaseOrderDetails?.date && (
              <p>
                <span className="font-bold">Payment Date: </span>
                {purchaseOrder?.PurchaseOrderDetails?.date.toDateString()}
              </p>
            )}
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
          <TableCaption>Purchase Order Items</TableCaption>
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
              (item: any, i: number) => (
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
              <TableCell>
                {purchaseOrder?.PurchaseOrderDetails?.PurchaseOrderItems.reduce(
                  (acc: number, item: any) =>
                    acc + item.priceTax - item.priceNoTax,
                  0,
                ).toFixed(3)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                {purchaseOrder?.PurchaseOrderDetails?.totalAmount.toFixed(3)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default PuchaseOrderView;
