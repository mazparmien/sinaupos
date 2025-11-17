import { apiFetch } from "../utils/apiFetch";

export const getSalesReport = (startDate, endDate) =>
  apiFetch(`/reports/sales?start_date=${startDate}&end_date=${endDate}`);
