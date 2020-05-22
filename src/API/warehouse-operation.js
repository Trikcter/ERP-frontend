import { AXIOS } from "./http-client.js";

const END_POINT = "/warehouse_operations";

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

const getAll = (id, params) =>
  AXIOS.get(END_POINT + "/all/" + id, { params: params });

const getAllActive = id => AXIOS.get(END_POINT + "/active/" + id);

export {
  getAll,
  createOperation,
  editOperation,
  deleteOperations,
  getAllActive
};
