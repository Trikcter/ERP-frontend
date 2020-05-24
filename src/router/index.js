import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Start",
    component: () => import("../views/Start.vue")
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products.vue")
  },
  {
    path: "/warehouses",
    name: "Warehouses",
    component: () => import("../views/Warehouses.vue")
  },
  {
    path: "/warehouse/:id",
    component: () => import("../views/Warehouse.vue"),
    props: true
  },
  {
    path: "/warehouse_operation",
    component: () => import("../views/WarehouseOperation.vue")
  },
  {
    path: "/financial_operation",
    component: () => import("../views/FinancialOperation.vue")
  },
  {
    path: "/registration_organization",
    name: "RegistrationOrganization",
    component: () => import("../views/RegistrationOrganization.vue")
  },
  {
    path: "/warehouses_history",
    name: "WarehouseHistory",
    component: () => import("../views/WarehouseHistory.vue")
  },
  {
    path: "/workers",
    name: "Workers.vue",
    component: () => import("../views/Workers.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
