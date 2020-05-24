import { AXIOS } from "./http-client.js";

const END_POINT = "/auth";

const getAllRoles = () => AXIOS.get(END_POINT + "/roles");

export { getAllRoles };
