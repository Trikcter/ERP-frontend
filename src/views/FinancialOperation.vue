<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <FinancialOperationForm />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import FinancialOperationForm from "@/components/FinancialOperationForm.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    FinancialOperationForm
  }
};
</script>
