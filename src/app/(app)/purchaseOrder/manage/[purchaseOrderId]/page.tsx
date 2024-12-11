"use client";
import React, { useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PuchaseOrderView from "@/app/_components/puchaseOrderView";
import { useSession } from "next-auth/react";
import SimpleCard from "../../_components/simple-card";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useChannel } from "ably/react";
import { toast } from "react-toastify";

const Page = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [form, setForm] = useState({ comment: "" });
  const router = useRouter();
  const {
    data: purchaseOrder,
    status: poStatus,
    isLoading,
    refetch: refetchPO,
  } = api.purchaseOrder.getOneReview.useQuery({
    purchaseOrderId,
  });
  const session = useSession();
  console.log(purchaseOrder);

  if (!purchaseOrder && !isLoading) return notFound();

  const { channel } = useChannel("notifications");
  const {
    mutate: updateStatus,
    isPending: updateStatusPending,
    data: updateStatusData,
  } = api.purchaseOrder.aproval.useMutation({
    onSuccess: (data) => {
      refetchPO();
      console.log("its working");

      console.log("po po po po", data);
      toast.success("Thank you for your review");
      data?.notifications?.forEach((notification) => {
        if (!Array.isArray(notification)) {
          channel.publish(
            "po-notifi",
            `${notification.userId}---${notification.text}`,
          );
        }
      });
    },
  });

  const canShow = useMemo(() => {
    const userId = session.data?.user.id;
    if (!purchaseOrder || !userId) return false;
    const { status, userApproveId, userReviewId, userPrepareId } =
      purchaseOrder;
    if (userApproveId === userId && status === "toApprove") return true;
    if (userReviewId === userId && status === "toReview") return true;
    return false;
  }, [purchaseOrder, session]);
  return (
    <div className="flex flex-col justify-between p-5">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <PuchaseOrderView flexable purchaseOrder={purchaseOrder as any} />
        {canShow && (
          <Card className="w-[210mm]">
            <CardHeader>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-black hover:bg-green-900">
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve purchase order</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this purchase order?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        console.log("to apppp");

                        updateStatus({
                          comment: "",
                          purchaseOrderId,
                          status: true,
                        });
                      }}
                      className="bg-green-800"
                    >
                      Approve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="border border-input bg-background text-black hover:bg-red-700 hover:text-white">
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject purchase order</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this purchase order?
                      <div className="mt-3 grid w-full gap-1.5">
                        <Label htmlFor="message" className="text-black">
                          Rejection reason
                        </Label>
                        <Textarea
                          onChange={(e) => {
                            setForm({ ...form, comment: e.target.value });
                          }}
                          placeholder="Type your message here."
                          id="message"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        updateStatus({
                          comment: form.comment,
                          purchaseOrderId,
                          status: false,
                        });
                      }}
                      className="bg-red-600"
                    >
                      Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
