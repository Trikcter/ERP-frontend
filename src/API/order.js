import { AXIOS } from "./http-client.js";

const END_POINT = "/orders";

const create = (operation, params) =>
  AXIOS.post(END_POINT, operation, { params: params });

export { create };
