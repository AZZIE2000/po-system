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

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import { Info } from "lucide-react";
export default function Page() {
  const {
    data: projects,
    refetch,
    isLoading,
  } = api.project.getDashboard.useQuery();
  const updateCompany = api.project.update.useMutation({
    onSuccess: () => {
      toast("Project Updated Successfully", {
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
            Manage Projects
          </CardTitle>
          <CardDescription>
            Update the project by clicking on the name and changing it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>System Projects</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Project name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">
                  <HoverCard>
                    <HoverCardTrigger className="flex items-center justify-center gap-2">
                      status <Info size={10} />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <small>
                        This indicates if you can create more purchase orders
                        with this project or not
                      </small>
                    </HoverCardContent>
                  </HoverCard>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((pro) => (
                <TableRow key={pro.projectId}>
                  <TableCell
                    className="font-medium"
                    contentEditable
                    onBlur={(e) => {
                      if (e.target.innerText !== pro.projectName)
                        updateCompany.mutate({
                          projectId: pro.projectId,
                          projectName: e.target.innerText,
                          closed: pro.closed,
                        });
                    }}
                  >
                    {pro.projectName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {pro.createdAt.toDateString()}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      updateCompany.mutate({
                        projectId: pro.projectId,
                        projectName: pro.projectName,
                        closed: !pro.closed,
                      });
                    }}
                    className="cursor-pointer text-center font-medium"
                  >
                    <Button
                      className="w-full"
                      variant={pro.closed ? "destructive" : "secondary"}
                      size={"sm"}
                    >
                      {pro.closed ? "closed" : "open"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {(isLoading || !projects?.length) && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    {isLoading ? "Loading..." : "No projects found"}
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
