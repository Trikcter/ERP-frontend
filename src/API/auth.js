import { AXIOS } from "./http-client.js";

const END_POINT = "/auth";

const createUser = (username, password, fio) =>
  AXIOS.post(END_POINT + "/sign-up", {
    username: username,
    password: password,
    fio: fio
  });

const login = (username, password) =>
  AXIOS.post(END_POINT + "/sign-in", {
    username: username,
    password: password
  });

export { createUser, login };
