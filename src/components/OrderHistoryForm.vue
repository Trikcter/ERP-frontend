<template>
  <v-data-table
    :headers="headers"
    :items="histories"
    :loading="loading"
    :options.sync="options"
    :server-items-length="total"
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2 elevation-1"
    loading-text="Подождите, данные загружаются"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>История банковских операций</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { getAllOrders } from "@/API/history.js";

export default {
  name: "WarehouseHistoryTable",
  data() {
    return {
      headers: [
        {
          text: "Наименование продукции",
          value: "productTitle",
          sortable: false
        },
        {
          text: "Количество продукции",
          value: "count",
          sortable: false
        },
        { text: "Дата операции", value: "date", sortable: false }
      ],
      histories: [],
      total: 0,
      options: {},
      loading: false
    };
  },
  watch: {
    options: {
      handler() {
        this.initialize();
      }
    }
  },
  methods: {
    async initialize() {
      this.loading = true;

      try {
        const params = {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0],
          organizationId: this.$store.getters.getOrganizationId
        };

        const response = await getAllOrders(params);

        this.histories = [];
        this.total = 0;

        response.data.content.forEach(el => {
          this.histories.push({
            count: el.count,
            productTitle: el.productTitle,
            date: el.date
          });
        });

        this.total = response.data.totalElements;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>
