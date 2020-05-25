import { AXIOS } from "./http-client.js";

const END_POINT = "/organizations/workers";

const getAllWorkers = params => AXIOS.get(END_POINT, { params: params });

const createWorker = (worker, params) =>
  AXIOS.post(
    END_POINT,
    {
      login: worker.login,
      password: worker.password,
      fio: worker.fio,
      role: worker.role
    },
    {
      params: params
    }
  );

const editWorker = (worker, params) =>
  AXIOS.put(
    END_POINT,
    {
      id: worker.id,
      login: worker.login,
      password: worker.password,
      fio: worker.fio,
      role: worker.role
    },
    {
      organizationId: params.organizationId
    }
  );

const deleteProducts = ids => AXIOS.delete(END_POINT, { data: ids });

export { createWorker, getAllWorkers, editWorker, deleteProducts };
