import { AXIOS } from "./http-client.js";

const END_POINT = "/history";

const getAllWarehouses = params =>
  AXIOS.get(END_POINT + "/warehouses", {
    params: params
  });

export { getAllWarehouses };
