import "server-only";
import { api } from "@/trpc/server";

export const createCompany = async (companyName: string) => {
  return await api.company.create({ companyName });
};
