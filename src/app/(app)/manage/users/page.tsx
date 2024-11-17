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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CreateUserModal from "./components/create-user.modal";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Delete, Trash } from "lucide-react";
export default function Page() {
  const session = useSession().data;
  const { data: users, refetch } = api.user.getAll.useQuery();
  const { data: roles } = api.role.getAll.useQuery();
  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast("User Updated Successfully", {
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
  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      toast("User Deleted Successfully ", {
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
            Manage Users
            <CreateUserModal refetch={refetch} roles={roles || []} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>System Users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell
                    className="font-medium"
                    contentEditable
                    onBlur={(e) => {
                      console.log(e.target.innerText);
                      updateUser.mutate({
                        id: user.id,
                        username: e.target.innerText,
                      });
                    }}
                  >
                    {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      disabled={user.id === session?.user?.id}
                      value={user.role.roleId}
                      onValueChange={(value) => {
                        console.log(value);
                        updateUser.mutate({
                          id: user.id,
                          roleId: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          {roles?.map((role) => (
                            <SelectItem value={role.roleId}>
                              {role.role}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger
                        disabled={user.id === session?.user?.id}
                        asChild
                      >
                        <Button variant={"outline"}>
                          <Trash className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUser.mutate({ id: user.id })}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
