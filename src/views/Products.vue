<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <ProductTable />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import ProductTable from "@/components/ProductTable.vue";

export default {
  name: "Products",
  components: {
    Navigation,
    ProductTable
  }
};
</script>
