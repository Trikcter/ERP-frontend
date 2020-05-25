<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <WarehouseTable />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import WarehouseTable from "@/components/WarehouseTable.vue";

export default {
  name: "Warehouses",
  components: {
    Navigation,
    WarehouseTable
  }
};
</script>
