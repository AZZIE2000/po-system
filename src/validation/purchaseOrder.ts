import { Currency, PaymentMethod, Status } from "@prisma/client";
import z from "zod";

const itemSchema = z.object({
  purchaseOrderItemId: z.string().optional(),
  description: z.string().optional(),
  priceNoTax: z.number().min(0),
  priceTax: z.number().min(0),
  taxAmmount: z.number().min(0),
  purchaseOrderDetailId: z.string().optional(),
});
const installmentSchema = z.object({
  PurchaseOrderInstallmentId: z.string().optional(),
  description: z.string(),
  amount: z.number().min(0),
  percentage: z.number().min(0),
  date: z.date(),
  paid: z.boolean(),
  purchaseOrderDetailId: z.string().optional(),
});

export const createPOSchema = z.object({
  purchaseOrderDetailId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  date: z.date().optional().nullable(),
  projectId: z.string().optional(),
  companyId: z.string().optional(),
  cliq: z.string().optional().nullable(),
  description: z.string().optional().default("").nullable(),
  contactName: z.string().default("").nullable(),
  contactNumber: z.string().default("").nullable(),
  currency: z.enum([
    Currency.AED,
    Currency.EUR,
    Currency.GBP,
    Currency.JOD,
    Currency.USD,
  ]),

  iban: z.string().optional().nullable(),
  userApproveId: z.string(),
  userReviewId: z.string(),
  status: z.enum([
    Status.approved,
    Status.completed,
    Status.rejected,
    Status.paymnetInProgress,
    Status.toApprove,
    Status.toReview,
    Status.draft,
  ]),
  installment: z.boolean(),
  nameOnCheque: z.string().optional().nullable(),
  paymentMethod: z.enum([
    PaymentMethod.CLIQ,
    PaymentMethod.bankTransfer,
    PaymentMethod.cash,
    PaymentMethod.cheque,
  ]),
  totalAmount: z.number().min(0),
  paid: z.boolean(),
  items: z.array(itemSchema).optional().default([]),
  installments: z.array(installmentSchema).optional().default([]),
});

export type createI = z.infer<typeof createPOSchema>;
