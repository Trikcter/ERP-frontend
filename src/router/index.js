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
  },
  {
    path: "/banks",
    name: "Bank.vue",
    component: () => import("../views/Bank.vue")
  },
  {
    path: "/orders",
    name: "Order.vue",
    component: () => import("../views/Order.vue")
  },
  {
    path: "/bank_history",
    name: "BankHistory.vue",
    component: () => import("../views/BankHistory.vue")
  },
  {
    path: "/order_history",
    name: "OrderHistory.vue",
    component: () => import("../views/OrderHistory.vue")
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
