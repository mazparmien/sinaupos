import { apiFetch } from "../utils/apiFetch";

export const getTransactions = () => apiFetch("/transactions");
export const createTransaction = (data) =>
  apiFetch("/transactions", { method: "POST", body: data });
export const deleteTransaction = (id) =>
  apiFetch(`/transactions/${id}`, { method: "DELETE" });
