import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    organization: localStorage.getItem("organization") || "",
    organizationId: localStorage.getItem("organizationId") || 0,
    role: localStorage.getItem("role") || "",
    fio: localStorage.getItem("fio") || ""
  },
  getters: {
    mainAuthorities: state => {
      if (state.role == "CEO" || state.role == "ADMIN" || state.role == "CFO") {
        return true;
      } else {
        false;
      }
    },
    warehouseAuthorities: state => {
      if (
        state.role == "CEO" ||
        state.role == "ADMIN" ||
        state.role == "CFO" ||
        state.role == "STOREKEEPER"
      ) {
        return true;
      } else {
        return false;
      }
    },
    workerAuthorities: state => {
      if (
        state.role == "CEO" ||
        state.role == "ADMIN" ||
        state.role == "CFO" ||
        state.role == "HR"
      ) {
        return true;
      } else {
        return false;
      }
    },
    orderAuthorities: state => {
      if (
        state.role == "CEO" ||
        state.role == "ADMIN" ||
        state.role == "CFO" ||
        state.role == "SELLER"
      ) {
        return true;
      } else {
        return false;
      }
    },
    getUsername: state => {
      return state.username;
    },
    getOrganization: state => {
      return state.organization;
    },
    getToken: state => {
      return state.token;
    },
    getOrganizationId: state => {
      return state.organizationId;
    },
    getFio: state => {
      return state.fio;
    }
  },
  mutations: {
    auth_login: (state, user) => {
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);
      localStorage.setItem("organization", user.organization);
      localStorage.setItem("fio", user.fio);
      localStorage.setItem("organizationId", user.organizationId);
      state.organizationId = user.organizationId;
      state.fio = user.fio;
      state.token = user.token;
      state.username = user.username;
      state.role = user.role;
      state.organization = user.organization;
    },
    auth_logout: state => {
      state.token = "";
      state.role = "";
      state.username = "";
      state.organization = "";
      state.organizationId = "";
      state.fio = "";
      localStorage.removeItem("fio");
      localStorage.removeItem("organizationId");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("organization");
    },
    reg_organization: (state, newOrganization) => {
      localStorage.setItem("organization", newOrganization.title);
      localStorage.setItem("organizationId", newOrganization.id);
      state.organization = newOrganization.title;
      state.organizationId = newOrganization.id;
    }
  },
  actions: {
    login: (context, user) => {
      context.commit("auth_login", user);
    },
    logout: context => {
      context.commit("auth_logout");
    },
    addOrganization: (context, organization) => {
      context.commit("reg_organization", organization);
    }
  }
});
