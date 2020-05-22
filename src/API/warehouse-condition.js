import { AXIOS } from "./http-client.js";

const END_POINT = "/warehouses/conditions";

const getAll = (id, params) =>
  AXIOS.get(END_POINT + "/" + id, { params: params });

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
