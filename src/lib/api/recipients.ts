import { api } from "./client";

export type Recipient = {
  id?: number | string;
  uuid?: string;
  payer_uuid: string;
  file_type: "Individual" | "Business";
  name?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  recipient_tin?: string;
  tin_not_provided?: boolean;
  email?: string;
  phone_number?: string;
  address_one?: string;
  address_two?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  is_active?: boolean;
  is_foreign_address?: boolean;
  client_recipient_id?: string;
  [k: string]: unknown;
};

export type RecipientPayload = Partial<Recipient> & {
  payer_uuid: string;
  file_type: "Individual" | "Business";
  last_name: string;
};

export const recipientsApi = {
  list: (q?: { name?: string; email?: string; tax_id?: string; client_id?: string }) =>
    api<Recipient[]>("/recipients", { query: q }),
  create: (body: RecipientPayload) => api<Recipient>("/recipients", { method: "POST", body }),
  update: (id: number | string, body: Partial<RecipientPayload>) =>
    api<Recipient>(`/recipients/${id}`, { method: "PUT", body }),
  remove: (id: number | string) => api<unknown>(`/recipients/${id}`, { method: "DELETE" }),
  setStatus: (uuid: string, is_active: boolean) =>
    api<Recipient>(`/recipients/${uuid}/status`, { method: "PATCH", body: { is_active } }),
};