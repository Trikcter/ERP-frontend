import { AXIOS } from "./http-client.js";

const END_POINT = "/warehouses/conditions";
const END_POINT_CUT = "/warehouses/";

const getAll = (id, params) =>
  AXIOS.get(END_POINT_CUT + id + "/conditions", { params: params });

const createCondition = (condition, params) =>
  AXIOS.post(
    END_POINT,
    {
      count: condition.count,
      product: condition.product,
      warehouseId: condition.warehouseId
    },
    {
      params: params
    }
  );

export { getAll, createCondition };
