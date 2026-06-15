import { api } from "./client";

export type Payer = {
  uuid: string;
  file_type: "Individual" | "Business";
  name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  id_type?: "SSN" | "EIN";
  id_number?: string;
  email?: string;
  phone_number?: string;
  address_one?: string;
  address_two?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  is_foreign_address?: boolean;
  is_active?: boolean;
  trade_name?: string;
  client_payer_id?: string;
  [k: string]: unknown;
};

export type PayerPayload = Partial<Payer> & {
  file_type: "Individual" | "Business";
  last_name: string;
  id_type: "SSN" | "EIN";
  id_number: string;
  phone_number: string;
  address_one: string;
  city: string;
  country: string;
  zip_code: string;
};

export const payersApi = {
  list: (q?: { name?: string; email?: string }) => api<Payer[]>("/payers", { query: q }),
  get: (uuid: string) => api<Payer>(`/payers/${uuid}`),
  create: (body: PayerPayload) => api<Payer>("/payers", { method: "POST", body }),
  update: (uuid: string, body: Partial<PayerPayload>) => api<Payer>(`/payers/${uuid}`, { method: "PUT", body }),
  remove: (uuid: string) => api<unknown>(`/payers/${uuid}`, { method: "DELETE" }),
  setStatus: (uuid: string, is_active: boolean) =>
    api<Payer>(`/payers/${uuid}/status`, { method: "PATCH", body: { is_active } }),
};