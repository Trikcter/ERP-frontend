<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <OrderHistoryForm />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import OrderHistoryForm from "@/components/OrderHistoryForm.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    OrderHistoryForm
  }
};
</script>
