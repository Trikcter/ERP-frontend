import { AXIOS } from "./http-client.js";

const END_POINT = "/financial_operations";

const createOperation = operation =>
  AXIOS.post(END_POINT, {
    name: operation.name,
    description: operation.description,
    organizationId: operation.organizationId
  });

const editOperation = operation =>
  AXIOS.put(END_POINT, {
    id: operation.id,
    name: operation.name,
    description: operation.description,
    organizationId: operation.organizationId
  });

const deleteOperations = ids => AXIOS.delete(END_POINT, { data: ids });

const getAll = params => AXIOS.get(END_POINT + "/all", { params: params });
const getAllActive = params =>
  AXIOS.get(END_POINT + "/all/active", { params: params });

export {
  getAll,
  getAllActive,
  createOperation,
  editOperation,
  deleteOperations
};
