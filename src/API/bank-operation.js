import { AXIOS } from "./http-client.js";

const END_POINT = "/bank_operations";

const create = (operation, params) =>
  AXIOS.post(END_POINT, operation, { params: params });

export { create };
