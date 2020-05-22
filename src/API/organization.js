import { AXIOS } from "./http-client.js";

const END_POINT = "/organizations";

const createOrganization = organization =>
  AXIOS.post(END_POINT, {
    title: organization.title,
    inn: organization.inn,
    kpp: organization.kpp,
    ogrn: organization.ogrn,
    addressTitle: organization.addressTitle
  });

const saveFile = (file, id) => AXIOS.post(END_POINT + "/file/" + id, file);
const getFile = id => AXIOS.get(END_POINT + "/file/" + id);

export { createOrganization, saveFile, getFile };
