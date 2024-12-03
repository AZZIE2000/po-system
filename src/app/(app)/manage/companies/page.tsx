"use client";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";

export default function Page() {
  const { data: companies, refetch, isLoading } = api.company.getAll.useQuery();
  const updateCompany = api.company.update.useMutation({
    onSuccess: () => {
      toast("Company Updated Successfully", {
        type: "success",
        position: "bottom-right",
      });
      refetch();
    },
    onError: () => {
      toast("Something went wrong!", {
        type: "error",
        position: "bottom-right",
      });
    },
  });

  return (
    <div className="p-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            Manage Companies
          </CardTitle>
          <CardDescription>
            Update the company by clicking on the name and changing it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>System Companies</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>company name</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.map((com) => (
                <TableRow key={com.companyId}>
                  <TableCell
                    className="font-medium"
                    contentEditable
                    onBlur={(e) => {
                      if (e.target.innerText !== com.companyName)
                        updateCompany.mutate({
                          companyId: com.companyId,
                          companyName: e.target.innerText,
                        });
                    }}
                  >
                    {com.companyName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {com.createdAt.toDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {(isLoading || !companies?.length) && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    {isLoading ? "Loading..." : "No companies found"}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
