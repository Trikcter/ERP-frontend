import { AXIOS } from "./http-client.js";

const END_POINT = "/warehouses";

const createWarehouses = warehouses =>
  AXIOS.post(END_POINT + "/all", warehouses);

const createWarehouse = warehouse =>
  AXIOS.post(END_POINT, {
    title: warehouse.title,
    addressTitle: warehouse.addressTitle,
    volume: warehouse.volume,
    organizationId: warehouse.organizationId
  });

const editWarehouse = warehouse =>
  AXIOS.put(END_POINT, {
    id: warehouse.id,
    title: warehouse.title,
    addressTitle: warehouse.addressTitle,
    volume: warehouse.volume,
    organizationId: warehouse.organizationId
  });

const deleteWarehouses = ids => AXIOS.delete(END_POINT, { data: ids });

const getAll = (id, params) =>
  AXIOS.get(END_POINT + "/all/" + id, { params: params });

const getAllActiveWarehouse = id => AXIOS.get(END_POINT + "/active/" + id);

const getWarehouse = id => AXIOS.get(END_POINT + "/" + id);

export {
  createWarehouses,
  getAll,
  getAllActiveWarehouse,
  getWarehouse,
  editWarehouse,
  createWarehouse,
  deleteWarehouses
};
