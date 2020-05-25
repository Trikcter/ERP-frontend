<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <BankForm />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import BankForm from "@/components/BankForm.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    BankForm
  }
};
</script>
