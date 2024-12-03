import dynamic from "next/dynamic";
import { PoTable } from "../_components/po-table";
import { db } from "@/server/db";
import SimpleCard from "./_components/simple-card";

export default async function Page() {
  const pos = await db.purchaseOrder.findMany({
    include: {
      PurchaseOrderDetails: {
        include: {
          company: true,
          project: true,
          PurchaseOrderItems: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <SimpleCard title="Purchase Orders">
          <PoTable purchaseOrders={pos as any} />
        </SimpleCard>
      </div>
    </div>
  );
}
