<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <OrderForm />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import OrderForm from "@/components/OrderForm.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    OrderForm
  }
};
</script>
