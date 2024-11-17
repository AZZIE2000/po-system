"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { Role } from "@prisma/client";
import { Combobox } from "@/components/ui/compobox";
import SelectCreate from "@/app/(app)/_components/select-create";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

const CreateUserModal = ({
  roles,
  refetch,
}: {
  roles: Role[];
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",

    roleId: "",
  });

  const createUser = api.user.register.useMutation({
    onSuccess: (d) => {
      refetch();
      setOpen(false);
    },
    onError: (e) => {
      try {
        if (e.data?.httpStatus === 409 || e.message.includes("username")) {
          return toast(
            e.message.includes("username")
              ? "User name must be unique"
              : e.message,
            {
              type: "error",
              position: "bottom-right",
            },
          );
        }
        const errArr = JSON.parse(e.message);

        for (const err of errArr) {
          toast(err.message, {
            type: "error",
            position: "bottom-right",
          });
        }
      } catch (e) {
        toast("Something went wrong!", {
          type: "error",
          position: "bottom-right",
        });
      }
    },
  });

  const handleSubmit = async () => {
    createUser.mutate({ ...form });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User /> Create new User
          </DialogTitle>
          <hr className="my-4" />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">User name</Label>
              <Input
                id="username"
                type="text"
                placeholder="john doe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={form.roleId || undefined}
                onValueChange={(rid: string) => {
                  setForm({ ...form, roleId: rid });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select User Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Roles</SelectLabel> */}
                    {roles
                      .filter((role) => role.role !== "admin")
                      .map((role) => (
                        <SelectItem key={role.roleId} value={role.roleId}>
                          {role.role}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={createUser.isPending}
              type="submit"
              className="w-full"
              onClick={handleSubmit}
            >
              {createUser.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Register User"
              )}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
