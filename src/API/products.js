import { AXIOS } from "./http-client.js";

const END_POINT = "/products";

const createProducts = products => AXIOS.post(END_POINT + "/all", products);
const createProduct = product =>
  AXIOS.post(END_POINT, {
    title: product.title,
    code: product.code,
    price: product.price,
    organizationId: product.organizationId
  });

const editProduct = product =>
  AXIOS.put(END_POINT, {
    id: product.id,
    title: product.title,
    code: product.code,
    price: product.price,
    organizationId: product.organizationId
  });

const deleteProducts = ids => AXIOS.delete(END_POINT, { data: ids });

const getAll = (id, params) =>
  AXIOS.get(END_POINT + "/all/" + id, { params: params });

const getAllActiveProducts = id => AXIOS.get(END_POINT + "/active/" + id);

export {
  createProducts,
  getAll,
  getAllActiveProducts,
  createProduct,
  editProduct,
  deleteProducts
};
