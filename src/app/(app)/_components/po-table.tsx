"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HoverInfo from "./hover-Info";
import { toast } from "react-toastify";
import {
  PurchaseOrder,
  PurchaseOrderDetails,
  Company,
  PurchaseOrderItem,
  Project,
} from "@prisma/client";
import { useRouter } from "next/navigation";
type PO = PurchaseOrder & {
  PurchaseOrderDetails: PurchaseOrderDetails & {
    company: Company;
    project: Project;
    PurchaseOrderItems: PurchaseOrderItem[];
  };
};
export function PoTable({ purchaseOrders }: { purchaseOrders: PO[] }) {
  const [searchInput, setSearchInput] = React.useState("");
  console.log(purchaseOrders);

  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              // key={"column.id"}
              className="capitalize"
              checked={true}
              onCheckedChange={
                (value) => {}
                // column.toggleVisibility(!!value)
              }
            >
              col
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders?.length ? (
              purchaseOrders.map((po) => {
                if (!po.PurchaseOrderDetails) return null;
                const id = po.purchaseOrderId,
                  description = po.PurchaseOrderDetails.description,
                  project = po.PurchaseOrderDetails.project.projectName,
                  amount = po.PurchaseOrderDetails.totalAmount,
                  currency = po.PurchaseOrderDetails.currency,
                  status = po.status,
                  items_count =
                    po.PurchaseOrderDetails.PurchaseOrderItems.length || 0,
                  company = po.PurchaseOrderDetails.company.companyName;
                return (
                  <TableRow key={po.purchaseOrderId}>
                    <TableCell>
                      <HoverInfo
                        button={
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(id);
                              toast.success("Copied to clipboard");
                            }}
                          >
                            {po.purchaseOrderId.slice(0, 10)}...
                          </span>
                        }
                      >
                        Copy to clipboard
                      </HoverInfo>
                    </TableCell>
                    <TableCell>
                      <HoverInfo
                        disabled={
                          !description || description.length < 10
                            ? false
                            : undefined
                        }
                        button={
                          <span className="">
                            {description
                              ? description.slice(0, 10) + "..."
                              : "N/A"}
                          </span>
                        }
                      >
                        {description || ""}
                      </HoverInfo>
                    </TableCell>
                    <TableCell>{company}</TableCell>
                    <TableCell>{project}</TableCell>
                    <TableCell>{items_count}</TableCell>
                    <TableCell>
                      {amount}
                      {currency}
                    </TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(id);
                              toast.success("Copied to clipboard");
                            }}
                          >
                            Copy payment ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`/order/${id}`);
                            }}
                          >
                            View Purchase Order
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(
                                `/purchaseOrder/${po.purchaseOrderId}`,
                              );
                            }}
                          >
                            Edit Purchase Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Select>
            <SelectTrigger
              disabled={!purchaseOrders?.length}
              className="max-w-sm"
            >
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            disabled={!purchaseOrders?.length}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            disabled={!purchaseOrders?.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
