"use client";
import {
  Company,
  Currency,
  PaymentMethod,
  Project,
  PurchaseOrder,
  PurchaseOrderDetails,
  PurchaseOrderInstallment,
  PurchaseOrderItem,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import SelectCreate from "../../_components/select-create";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SimpleCard from "./simple-card";
import { Textarea } from "@/components/ui/textarea";
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
import { Button } from "@/components/ui/button";
import { Info, Plus, Trash } from "lucide-react";

import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const newItem = {
  date: new Date(),
  description: "",
  note: "",
  paid: false,
  priceNoTax: 0,
  priceTax: 0,
  purchaseOrderDetailId: "",
  purchaseOrderItemId: "",
  taxAmount: 0,
};

const PoForm = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();

  const { data: companies, refetch: refetchCompanies } =
    api.company.getAll.useQuery();
  const { data: users } = api.user.getAll.useQuery();
  const { data: projects, refetch: refetchProjects } =
    api.project.getAll.useQuery();
  const [po, setPo] = useState<
    Partial<Company & Project & PurchaseOrderDetails & PurchaseOrder>
  >({
    date: new Date(),
    projectId: "",
    companyId: "",
    companyName: "",
    cliq: "",
    description: "",
    contactName: "",
    contactNumber: "",
    currency: "JOD",
    iban: "",
    userApproveId: "",
    userPrepareId: "",
    userReviewId: "",
    status: "draft",
    installment: false,
    nameOnCheque: "",

    paymentMethod: "bankTransfer",
    // projectManagerId: "",
    totalAmount: 0,
  });
  const [items, setItems] = useState<Partial<PurchaseOrderItem>[]>([]);
  const [installments, setInstallments] = useState<
    Partial<PurchaseOrderInstallment>[]
  >([]);

  const createCompany = api.company.create.useMutation({
    onSuccess: (company) => {
      refetchCompanies();
      setPo({
        ...po,
        companyId: company.companyId,
        companyName: company.companyName,
      });
    },
  });
  const createProject = api.project.create.useMutation({
    onSuccess: (company) => {
      refetchProjects();
      setPo({
        ...po,
        projectId: company.projectId,
        projectName: company.projectName,
      });
    },
  });

  const taxAmount = useMemo(() => {
    return items.reduce((acc, v) => {
      if (v) {
        acc += (v.priceTax || 0) - (v.priceNoTax || 0);
      }
      return acc;
    }, 0);
  }, [items]);
  const totalAmount = useMemo(() => {
    const total = items.reduce((acc, v) => {
      if (v) {
        acc += v.priceTax || 0;
      }
      return acc;
    }, 0);
    setInstallments([
      ...installments.map((i) => {
        return {
          ...i,
          percentage: +(((i.amount || 0) / total) * 100).toFixed(2),
        };
      }),
    ]);
    return total;
  }, [items]);

  const updateItem = (index: number, newValue: any) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, ...newValue } : item,
      ),
    );
  };
  const updateInstallment = (index: number, newValue: any) => {
    setInstallments((prevInstallments) =>
      prevInstallments.map((installment, i) =>
        i === index ? { ...installment, ...newValue } : installment,
      ),
    );
  };

  const installmentError = useMemo(() => {
    if (!po.installment) return false;
    const total = installments.reduce((acc, v) => {
      if (v) {
        acc += v.amount || 0;
      }
      return acc;
    }, 0);
    return total !== totalAmount;
  }, [installments]);

  useEffect(() => {
    // log the date as yyyy mm dd only
    console.log(setItems);
  }, [items]);

  return (
    <div className="p-5">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="flex justify-between">
            Create Purchase Order
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-7 w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Keyboard shortcuts
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SimpleCard title="Info">
              <SelectCreate
                noOptionsMessage={({ inputValue }) =>
                  `Press Enter Create "${inputValue}"`
                }
                label="Select Project"
                placeholder="Select Project"
                value={{
                  value: po.projectId || "",
                  label: po.projectName || "",
                }}
                onChange={(c) => {
                  setPo({
                    ...po,
                    projectId: c?.value || "",
                    projectName: c?.label,
                  });
                }}
                create={(projectName) => {
                  createProject.mutate({
                    projectName,
                  });
                }}
                options={
                  projects?.map((project) => ({
                    value: project.projectId,
                    label: project.projectName,
                  })) || []
                }
              />
              <SelectCreate
                noOptionsMessage={({ inputValue }) =>
                  `Press Enter Create "${inputValue}"`
                }
                label="Select Company"
                placeholder="Select Company"
                value={{
                  value: po.companyId || "",
                  label: po.companyName || "",
                }}
                onChange={(c) => {
                  setPo({
                    ...po,
                    companyId: c?.value || "",
                    companyName: c?.label,
                  });
                }}
                create={(companyName) => {
                  createCompany.mutate({
                    companyName,
                  });
                }}
                options={
                  companies?.map((company) => ({
                    value: company.companyId,
                    label: company.companyName,
                  })) || []
                }
              />
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  onChange={(e) => {
                    setPo({ ...po, contactName: e.target.value });
                  }}
                  value={po.contactName || ""}
                  id="contactName"
                  type="text"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  onChange={(e) => {
                    setPo({ ...po, contactNumber: e.target.value });
                  }}
                  value={po.contactNumber || ""}
                  id="contactNumber"
                  type="text"
                />
              </div>
            </SimpleCard>

            <SimpleCard title="Payment Details">
              <div>
                <Label>Currency</Label>
                <Select
                  value={po.currency || undefined}
                  onValueChange={(v: Currency) => {
                    setPo({ ...po, currency: v });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select a Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Currency</SelectLabel>
                      <SelectItem value="JOD">JOD</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={po.paymentMethod || undefined}
                  onValueChange={(v: PaymentMethod) => {
                    setPo({ ...po, paymentMethod: v });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select a Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Payment Method</SelectLabel>

                      <SelectItem value="bankTransfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="CLIQ">CLIQ</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {po.paymentMethod === "bankTransfer" ? (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    onChange={(e) => {
                      setPo({ ...po, iban: e.target.value });
                    }}
                    value={po.iban || ""}
                    id="iban"
                    type="text"
                  />
                </div>
              ) : po.paymentMethod === "CLIQ" ? (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="cliq">
                    CLIQ <small> (Alias / number) </small>
                  </Label>
                  <Input
                    value={po.cliq || ""}
                    onChange={(e) => {
                      setPo({ ...po, cliq: e.target.value });
                    }}
                    id="cliq"
                    type="text"
                  />
                </div>
              ) : po.paymentMethod === "cheque" ? (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="nameOnCheque">Name On Cheque</Label>
                  <Input
                    value={po.nameOnCheque || ""}
                    onChange={(e) => {
                      setPo({ ...po, nameOnCheque: e.target.value });
                    }}
                    id="nameOnCheque"
                    type="text"
                  />
                </div>
              ) : null}
              {!po.installment && (
                <div className="grid w-full items-center gap-1.5">
                  <Label className="flex items-center gap-2">
                    Due Date{" "}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info size={15} />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p>
                          If you have installments the due date will be dynamic
                          based on your payments date.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </Label>
                  <DatePicker
                    date={po?.date || undefined}
                    onSelect={(date) => {
                      setPo({ ...po, date });
                    }}
                  />
                </div>
              )}
            </SimpleCard>
            <div className="col-span-2">
              <SimpleCard title="Extra Details">
                <Textarea placeholder="Write notes about your purchase order" />
              </SimpleCard>
            </div>
            <div className="col-span-2">
              <SimpleCard title="Items">
                <div className="flex w-full justify-end">
                  <Button
                    onClick={() => setItems([...items, newItem])}
                    className="flex items-center gap-1"
                  >
                    Add Item
                    <Plus className="mr-2 h-4 w-4" />
                  </Button>
                </div>
                <Table>
                  <TableCaption>A list of your PO Items</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-fit">Amount</TableHead>
                      <TableHead>Tax Amount</TableHead>
                      <TableHead className="w-fit">Total</TableHead>

                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="w-[300px] font-medium">
                          <Input
                            className="w-[300px]"
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => {
                              const newItem = { ...item };
                              if (!newItem) return;
                              newItem.description = e.target.value;
                              updateItem(i, newItem);
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            // onFocus={(e) => {
                            //   setTimeout(() => {
                            //     e.target.select();
                            //   }, 10);
                            // }}
                            type="number"
                            className="w-fit"
                            value={item.priceNoTax}
                            onChange={(e) => {
                              const value = +e.target.value;
                              if (value >= 0) {
                                const newItem = { ...item };
                                const taxAmount = newItem.taxAmount || 0;
                                newItem.priceNoTax = +value.toFixed(3);
                                newItem.priceTax = +(
                                  value * (taxAmount / 100) +
                                  value
                                ).toFixed(3);
                                updateItem(i, newItem);
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Select
                            value={item.taxAmount?.toString()}
                            onValueChange={(v) => {
                              const newItem = { ...item };
                              if (!newItem) return;
                              newItem.taxAmount = Number(v);
                              updateItem(i, newItem);
                            }}
                          >
                            <SelectTrigger className="w-fit">
                              <SelectValue placeholder="Select Tax" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="7">7%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="16">16%</SelectItem>
                              <SelectItem value="26">26%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="w-fit">
                          <Input
                            type="number"
                            className="w-fit"
                            value={item.priceTax}
                            onChange={(e) => {
                              const value = +e.target.value;
                              if (value >= 0) {
                                const newItem = { ...item };
                                const taxAmount = newItem.taxAmount || 0;
                                newItem.priceTax = +value.toFixed(3);
                                newItem.priceNoTax = +(
                                  value -
                                  value * (taxAmount / 100)
                                ).toFixed(3);
                                updateItem(i, newItem);
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell className="">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              onClick={() => {
                                setItems(
                                  items.filter((item, index) => index !== i),
                                );
                              }}
                              variant="destructive"
                            >
                              <Trash size={20} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    {taxAmount > 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>Tax</TableCell>
                        <TableCell>{taxAmount.toFixed(3)}</TableCell>
                      </TableRow>
                    )}
                    {totalAmount > 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell>{totalAmount.toFixed(3)}</TableCell>
                      </TableRow>
                    )}
                  </TableFooter>
                </Table>
              </SimpleCard>
            </div>
            <div className="col-span-2">
              <SimpleCard
                title="Installments"
                description={
                  installmentError ? (
                    <p className="text-red-500">
                      Warning: Your installments and the total amount are not
                      the same
                    </p>
                  ) : (
                    ""
                  )
                }
              >
                <div className="mt-3 flex items-center space-x-2">
                  <Label htmlFor="Installments">Installments?</Label>
                  <Switch
                    id="Installments"
                    checked={po.installment}
                    onCheckedChange={(v) => {
                      console.log(v);

                      if (!v) {
                        setInstallments([]);
                        setPo({ ...po, installment: v, date: new Date() });
                      } else {
                        if (!items.length)
                          return toast("Please add items first", {
                            type: "error",
                            position: "bottom-right",
                          });
                        setPo({ ...po, installment: v, date: undefined });
                        setInstallments([
                          {
                            date: new Date(),
                            amount: 0,
                            percentage: 0,
                            paid: false,
                            description: `Installment ${installments.length + 1}`,
                          },
                        ]);
                      }
                    }}
                  />
                </div>
                {po.installment && (
                  <>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={() =>
                          setInstallments([
                            ...installments,
                            {
                              date: new Date(),
                              amount: 0,
                              percentage: 0,
                              description: `Installment ${installments.length + 1}`,
                            },
                          ])
                        }
                        className="flex items-center gap-1"
                      >
                        Add Installment
                        <Plus className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                    <Table>
                      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                      <TableHeader>
                        <TableRow>
                          {/* <TableHead className="w-[100px]">description</TableHead> */}
                          <TableHead>Description</TableHead>
                          <TableHead>amount</TableHead>
                          <TableHead>percentage</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {installments.map((installment, i) => (
                          <TableRow key={i}>
                            <TableCell className="w-[300px] font-medium">
                              <Input
                                className="w-[300px]"
                                type="text"
                                value={installment.description || ""}
                                onChange={(e) => {
                                  const newInstallment = { ...installment };
                                  if (!newInstallment) return;
                                  newInstallment.description = e.target.value;
                                  updateInstallment(i, newInstallment);
                                }}
                              />
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                className="w-fit"
                                value={installment.amount}
                                onChange={(e) => {
                                  const value = +e.target.value;
                                  console.log(value, "+++");
                                  if (value >= 0) {
                                    const totalInsAmount = installments
                                      .filter((ins, index) => index != i)
                                      .reduce(
                                        (a, b) => a + (b?.amount || 0),
                                        0,
                                      );
                                    console.log(totalInsAmount, totalAmount);

                                    if (totalInsAmount + value <= totalAmount) {
                                      const newInstallment = { ...installment };

                                      newInstallment.amount = value;
                                      newInstallment.percentage = +(
                                        (value / totalAmount) *
                                        100
                                      ).toFixed(2);

                                      updateInstallment(i, newInstallment);
                                    }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="w-fit">
                              {/* <Input
                          type="number"
                          className="w-fit"
                          value={installment.percentage}
                          onChange={(e) => {
                            const value = +e.target.value;
                            if (value > 0) {
                              const newInstallment = { ...installment };

                              newInstallment.percentage = value;

                              updateInstallment(i, newInstallment);
                            }
                          }}
                        /> */}
                              {installment.percentage}
                            </TableCell>

                            <TableCell>
                              <DatePicker
                                date={installment.date}
                                onSelect={(date) => {
                                  const newItem = { ...installment };
                                  if (date && newItem) {
                                    newItem.date = date;
                                    updateInstallment(i, newItem);
                                  }
                                }}
                              />
                            </TableCell>

                            <TableCell className="">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  onClick={() => {
                                    setInstallments(
                                      installments.filter(
                                        (item, index) => index !== i,
                                      ),
                                    );
                                  }}
                                  variant="destructive"
                                >
                                  <Trash size={20} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </SimpleCard>
            </div>

            <SimpleCard title="Approval stages">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="grid w-full items-center gap-1.5">
                  <Label>Review Person</Label>
                  <Select
                    value={po.userReviewId || undefined}
                    onValueChange={(v: string) => {
                      setPo({ ...po, userReviewId: v });
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select Review Person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users
                          ?.filter(
                            (u) =>
                              u.role.role == "manager" ||
                              u.role.role == "projectManager",
                          )
                          .map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.username || u.email || ""}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label>Approve Person</Label>
                  <Select
                    value={po.userApproveId || undefined}
                    onValueChange={(v: string) => {
                      setPo({ ...po, userApproveId: v });
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select Approve Person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users
                          ?.filter((u) => u.role.role == "ceo")
                          .map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.username || u.email || ""}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SimpleCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoForm;
