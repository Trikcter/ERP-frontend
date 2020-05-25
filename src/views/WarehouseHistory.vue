<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <WarehouseHistoryTable />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import WarehouseHistoryTable from "@/components/WarehouseHistoryTable.vue";

export default {
  name: "WarehouseHistory",
  components: {
    Navigation,
    WarehouseHistoryTable
  }
};
</script>
