import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    organization: localStorage.getItem("organization") || "",
    role: localStorage.getItem("role") || ""
  },
  getters: {
    getUsername: state => {
      return state.username;
    },
    getToken: state => {
      return state.token;
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
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("organizaation");
    }
  },
  actions: {
    login: (context, user) => {
      context.commit("auth_login", user);
    },
    logout: context => {
      context.commit("auth_logout");
    }
  }
});
