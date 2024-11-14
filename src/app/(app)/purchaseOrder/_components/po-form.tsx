"use client";
import {
  Company,
  Currency,
  PaymentMethod,
  Project,
  PurchaseOrderDetails,
  PurchaseOrderInstallment,
  PurchaseOrderItem,
  User,
} from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { createCompany } from "@/server/queries";
import SelectCreate from "../../_components/select-create";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

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
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
const newItem = {
  date: new Date(),
  description: "",
  note: "",
  paid: false,
  priceNoTax: 0,
  priceTax: 0,
  purchaseOrderDetailId: "",
  purchaseOrderItemId: "",
  taxAmmount: 0,
};
interface PoFormI {
  users: User[];
}
const PoForm = ({ users }: PoFormI) => {
  const { data: companies, refetch: refetchCompanies } =
    api.company.getAll.useQuery();
  const { data: projects, refetch: refetchProjects } =
    api.project.getAll.useQuery();
  const [po, setPo] = useState<
    Partial<Company & Project & PurchaseOrderDetails>
  >({
    projectId: "",
    companyId: "",
    companyName: "",
    cliq: "",
    comment: "",
    contactName: "",
    contactNumber: "",
    currency: "JOD",
    iban: "",
    installment: false,
    nameOnCheque: "",
    paymentMethod: "bankTransfer",
    projectManagerId: "",
    totalAmout: 0,
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
    return items.reduce((acc, v) => {
      if (v) {
        acc += v.priceTax || 0;
      }
      return acc;
    }, 0);
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

  useEffect(() => {
    // log the date as yyyy mm dd only
    console.log(setItems);
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <SimpleCard title="Info">
        <SelectCreate
          label="Select Project"
          placeholder="Select Project"
          value={{ value: po.projectId || "", label: po.projectName || "" }}
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
          label="Select Company"
          placeholder="Select Company"
          value={{ value: po.companyId || "", label: po.companyName || "" }}
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
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

                <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="CLIQ">CLIQ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {po.paymentMethod === "bankTransfer" ? (
          <div className="grid w-full max-w-sm items-center gap-1.5">
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
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
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">description</TableHead> */}
                <TableHead>Description</TableHead>
                <TableHead>Tax Ammount</TableHead>
                <TableHead className="w-fit">Pretax</TableHead>
                <TableHead className="w-fit">Taxed</TableHead>
                {/* <TableHead>Due Date</TableHead> */}
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
                    <Select
                      value={item.taxAmmount?.toString()}
                      onValueChange={(v) => {
                        const newItem = { ...item };
                        if (!newItem) return;
                        newItem.taxAmmount = Number(v);
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
                  <TableCell>
                    <Input
                      type="number"
                      className="w-fit"
                      value={item.priceNoTax}
                      onChange={(e) => {
                        const value = +e.target.value;
                        if (value > 0) {
                          const newItem = { ...item };
                          const taxAmount = newItem.taxAmmount || 0;
                          newItem.priceNoTax = value;
                          newItem.priceTax = value * (taxAmount / 100) + value;
                          updateItem(i, newItem);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="w-fit">
                    <Input
                      type="number"
                      className="w-fit"
                      value={item.priceTax}
                      onChange={(e) => {
                        const value = +e.target.value;
                        if (value > 0) {
                          const newItem = { ...item };
                          const taxAmount = newItem.taxAmmount || 0;
                          newItem.priceTax = value;
                          newItem.priceNoTax =
                            value - value * (taxAmount / 100);
                          updateItem(i, newItem);
                        }
                      }}
                    />
                  </TableCell>

                  {/* <TableCell>
                    <DatePicker
                      date={item.date}
                      onSelect={(date) => {
                        const newItem = { ...item };
                        if (date && newItem) {
                          newItem.date = date;
                          updateItem(i, newItem);
                        }
                      }}
                    />
                  </TableCell> */}

                  <TableCell className="">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => {
                          setItems(items.filter((item, index) => index !== i));
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
              <TableRow>
                <TableCell colSpan={3}>Tax</TableCell>
                <TableCell>{taxAmount.toFixed(3)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>{totalAmount.toFixed(3)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </SimpleCard>
      </div>
      <div className="col-span-2">
        <SimpleCard title="Installments">
          <div className="mt-3 flex items-center space-x-2">
            <Label htmlFor="Installments">Installments?</Label>
            <Switch
              id="Installments"
              checked={po.installment}
              onCheckedChange={(v) => {
                console.log(v);

                setPo({ ...po, installment: v });
                if (!v) {
                  setInstallments([]);
                } else {
                  setInstallments([
                    {
                      date: new Date(),
                      amount: 0,
                      percentage: 0,
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
                            if (value > 0) {
                              const newItem = { ...installment };

                              newItem.amount = value;

                              updateItem(i, newItem);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="w-fit">
                        <Input
                          type="number"
                          className="w-fit"
                          value={installment.percentage}
                          onChange={(e) => {
                            const value = +e.target.value;
                            if (value > 0) {
                              const newItem = { ...installment };

                              newItem.percentage = value;

                              updateItem(i, newItem);
                            }
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <DatePicker
                          date={installment.date}
                          onSelect={(date) => {
                            const newItem = { ...installment };
                            if (date && newItem) {
                              newItem.date = date;
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
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Tax</TableCell>
                    <TableCell>{taxAmount.toFixed(3)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>{totalAmount.toFixed(3)}</TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </>
          )}
        </SimpleCard>
      </div>
    </div>
  );
};

export default PoForm;
