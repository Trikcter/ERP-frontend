<template>
  <v-navigation-drawer
    v-model="drawer"
    :right="right"
    src="@/assets/fon.jpg"
    absolute
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

      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="subtitle-2">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
export default {
  name: "Navigation",
  data() {
    return {
      fio: "Тестовый Т.Т",
      organization: this.$store.getters.getOrganization,
      drawer: true,
      items: [
        { title: "Продукты", icon: "mdi-basket" },
        { title: "Склад", icon: "mdi-store" },
        { title: "Работники", icon: "mdi-account-supervisor" },
        { title: "Финансы", icon: "mdi-bank" }
      ],
      right: false
    };
  },
  computed: {
    logo() {
      return (
        "http://localhost:8081/api/v1/organization/file/" +
        this.$store.getters.getOrganizationId
      );
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>
