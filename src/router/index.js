import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Start",
    component: () => import("../views/Start.vue")
  },
  // {
  //   path: "/",
  //   name: "RegistrationOrganization",
  //   component: () => import("../views/RegistrationOrganization.vue")
  // },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/registration_organization",
    name: "RegistrationOrganization",
    component: () => import("../views/RegistrationOrganization.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
