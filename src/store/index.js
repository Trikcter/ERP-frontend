import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    organization: localStorage.getItem("organization") || "",
    organizationId: localStorage.getItem("organizationId") || 0,
    role: localStorage.getItem("role") || ""
  },
  getters: {
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
    }
  },
  mutations: {
    auth_login: (state, user) => {
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.name);
      localStorage.setItem("role", user.role[0]);
      localStorage.setItem("organization", user.organization);
      state.token = user.token;
      state.username = user.username;
      state.role = user.role[0];
      state.organization = user.organization;
    },
    auth_logout: state => {
      state.token = "";
      state.role = "";
      state.username = "";
      state.organization = "";
      state.organizationId = "";
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
