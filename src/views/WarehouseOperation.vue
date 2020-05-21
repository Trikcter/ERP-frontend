<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <WarehouseOperationForm />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import WarehouseOperationForm from "@/components/WarehouseOperationForm.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    WarehouseOperationForm
  }
};
</script>
