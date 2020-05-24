<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <BankHistoryForm />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import BankHistoryForm from "@/components/BankHistoryForm.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    BankHistoryForm
  }
};
</script>
