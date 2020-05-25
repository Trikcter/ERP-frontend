<template>
  <v-container
    fluid
    color="grey lighten-3"
    style="height:100%; background-color: #ECEFF1"
  >
    <Navigation />
    <v-container>
      <v-row>
        <v-col cols="6">
          <WarehouseChart
            v-if="loaded"
            :chartData="warehouseData"
            :options="options"
          />
        </v-col>
        <v-col cols="6">
          <BalanceChart
            v-if="loaded"
            :chartData="balanceData"
            :options="options"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import WarehouseChart from "@/components/WarehouseChart.vue";
import BalanceChart from "@/components/BalanceChart.vue";

import { getBalanceChart, getWarehouseChart } from "@/API/chart.js";

export default {
  name: "Home",
  components: {
    Navigation,
    WarehouseChart,
    BalanceChart
  },
  data() {
    return {
      loaded: false,
      warehouseData: null,
      balanceData: null,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  created() {
    this.initailize();
  },
  methods: {
    async initailize() {
      const params = {
        organizationId: this.$store.getters.getOrganizationId
      };

      try {
        const warehouseChart = await getWarehouseChart(params);
        let warehouseLabels = warehouseChart.data.labels;
        let warehouseData = warehouseChart.data.values;

        this.warehouseData = {
          labels: warehouseLabels,
          datasets: [
            {
              label: "Заполненность складов",
              backgroundColor: "#B39DDB",
              data: warehouseData
            }
          ]
        };

        const balanceChart = await getBalanceChart(params);
        let balanceLabels = balanceChart.data.labels;
        let balanceData = balanceChart.data.labels;

        this.balanceData = {
          labels: balanceLabels,
          datasets: [
            {
              label: "Изменение баланса компании",
              backgroundColor: "#5C6BC0",
              data: balanceData
            }
          ]
        };

        this.loaded = true;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
