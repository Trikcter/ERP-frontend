<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <WorkerTable />
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import WorkerTable from "@/components/WorkerTable.vue";

export default {
  name: "Products",
  components: {
    Navigation,
    WorkerTable
  }
};
</script>
