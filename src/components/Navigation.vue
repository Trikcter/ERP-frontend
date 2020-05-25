<template>
  <v-navigation-drawer
    permanent
    :right="right"
    src="@/assets/fon.jpg"
    fixed
    app
    stateless
    dark
  >
    <v-list dense nav class="py-0">
      <v-list-item two-line class="px-0">
        <v-list-item-avatar size="62">
          <v-img :src="logo"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="subtitle-1 mb-2">
            {{ organization }}
          </v-list-item-title>
          <v-list-item-subtitle class="subtitle-2">
            {{ fio }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item to="/home" link>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="subtitle-2">
            Главная страница
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/products" link>
        <v-list-item-icon>
          <v-icon>mdi-basket</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="subtitle-2">
            Продукты
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        prepend-icon="mdi-store"
        v-ripple="{ class: 'white--text' }"
        active-class="active"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2">Склады</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item to="/warehouses" link class="ml-5" active-class="active">
          <v-list-item-icon>
            <v-icon>mdi-package-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              Состояние складов
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/warehouses_history"
          link
          class="ml-5"
          active-class="active"
        >
          <v-list-item-icon>
            <v-icon>mdi-history</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              История операций
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-item to="/workers" link>
        <v-list-item-icon>
          <v-icon>mdi-account-supervisor</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="subtitle-2">
            Работники
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        prepend-icon="mdi-bank"
        v-ripple="{ class: 'white--text' }"
        active-class="active"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2">Финансы</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item to="/banks" link class="ml-5" active-class="active">
          <v-list-item-icon>
            <v-icon>mdi-bank-transfer</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              Банковские операции
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/orders" link class="ml-5" active-class="active">
          <v-list-item-icon>
            <v-icon>mdi-cash-register</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              Продажа
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/bank_history" link class="ml-5" active-class="active">
          <v-list-item-icon>
            <v-icon>mdi-history</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              История банковских операций
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/order_history"
          link
          class="ml-5"
          active-class="active"
        >
          <v-list-item-icon>
            <v-icon>mdi-clock-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              История продаж
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group
        prepend-icon="mdi-bookshelf"
        v-ripple="{ class: 'white--text' }"
        active-class="active"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              Справочники
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          to="/warehouse_operation"
          link
          class="ml-5"
          active-class="active"
        >
          <v-list-item-icon>
            <v-icon>mdi-archive-arrow-down</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              Операции на складе
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/financial_operation"
          link
          class="ml-5"
          active-class="active"
        >
          <v-list-item-icon>
            <v-icon>mdi-cash-multiple</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              Финансовые операции
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <v-btn text class="mx-auto" block large v-on:click="logout">
        Выход
        <v-icon right large class="px-5">mdi-logout</v-icon>
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { logout } from "@/API/auth.js";

export default {
  name: "Navigation",
  data() {
    return {
      fio: this.$store.getters.getFio,
      organization: this.$store.getters.getOrganization,
      items: [
        { title: "Продукты", icon: "mdi-basket", to: "/products" },
        { title: "Склад", icon: "mdi-store", to: "/warehouses" },
        { title: "Работники", icon: "mdi-account-supervisor", to: "/workers" },
        { title: "Финансы", icon: "mdi-bank", to: "/financial" }
      ],
      right: false
    };
  },
  computed: {
    logo() {
      return (
        "http://localhost:8081/api/v1/organizations/file/" +
        this.$store.getters.getOrganizationId
      );
    }
  },
  methods: {
    async logout() {
      await logout();
      this.$router.push("/");
    }
  }
};
</script>

<style>
.active {
  color: white !important;
}
</style>
