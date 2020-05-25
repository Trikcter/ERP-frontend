import { AXIOS } from "./http-client.js";

const END_POINT = "/chart";

const getWarehouseChart = params =>
  AXIOS.get(END_POINT + "/warehouse", { params: params });

const getBalanceChart = params =>
  AXIOS.get(END_POINT + "/balance", { params: params });

export { getBalanceChart, getWarehouseChart };
