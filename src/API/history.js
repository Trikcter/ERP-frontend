import { AXIOS } from "./http-client.js";

const END_POINT = "/history";

const getAllWarehouses = params =>
  AXIOS.get(END_POINT + "/warehouses", {
    params: params
  });

const getAllOrders = params =>
  AXIOS.get(END_POINT + "/orders", {
    params: params
  });

const getAllBanks = params =>
  AXIOS.get(END_POINT + "/banks", {
    params: params
  });

export { getAllWarehouses, getAllOrders, getAllBanks };
