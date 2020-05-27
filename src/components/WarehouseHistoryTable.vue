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
        <v-toolbar-title>История операций со складом</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="selectWarehouse"
          :loading="loading"
          :items="warehousesSelect"
          flat
          class="mt-8"
          hide-no-data
          @change="initialize"
          label="Склад"
          placeholder="Выберите склад"
        ></v-autocomplete>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { getAllWarehouses } from "@/API/history.js";
import { getAllActiveWarehouse } from "@/API/warehouse.js";

export default {
  name: "WarehouseHistoryTable",
  data() {
    return {
      headers: [
        {
          text: "Наименование склада",
          value: "warehouseTitle",
          sortable: false
        },
        {
          text: "Наименование продукции",
          value: "productTitle",
          sortable: false
        },
        { text: "Наименование операции", value: "typeTitle", sortable: false },
        { text: "Дата операции", value: "date", sortable: false },
        { text: "Количество", value: "count", sortable: false }
      ],
      histories: [],
      total: 0,
      options: {},
      loading: false,
      warehouses: [],
      selectWarehouse: null,
      warehousesSelect: []
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

      const warehouse = this.findElement(this.warehouses, this.selectWarehouse);

      try {
        const params = {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0],
          warehouseId: warehouse == null ? "" : warehouse.id,
          organizationId: this.$store.getters.getOrganizationId
        };

        const response = await getAllWarehouses(params);

        this.histories = [];
        this.total = 0;

        response.data.content.forEach(el => {
          this.histories.push({
            warehouseTitle: el.warehouseTitle,
            productTitle: el.productTitle,
            typeTitle: el.typeTitle,
            date: el.date,
            count: el.count
          });
        });

        this.total = response.data.totalElements;

        this.initializeWarehouses();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async initializeWarehouses() {
      this.loading = true;

      try {
        const params = {
          organizationId: this.$store.getters.getOrganizationId
        };

        const response = await getAllActiveWarehouse(params);

        this.warehouses = [];
        this.warehousesSelect = [];

        response.data.content.forEach(el => {
          if (el.id != this.warehouseId) {
            this.warehouses.push({
              id: el.id,
              title: el.title
            });

            this.warehousesSelect.push(el.title);
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    findElement(array, partElement) {
      return array.filter(el => el.title === partElement)[0];
    }
  }
};
</script>

<style></style>
