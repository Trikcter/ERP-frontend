<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <WarehouseForm :warehouseId="this.$props.id" />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import WarehouseForm from "@/components/WarehouseForm.vue";

export default {
  name: "Warehouse",
  components: {
    Navigation,
    WarehouseForm
  },
  props: ["id"]
};
</script>
