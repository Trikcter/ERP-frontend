<template>
  <v-data-table
    :headers="headers"
    :items="conditions"
    :loading="loading"
    :options.sync="options"
    :server-items-length="total"
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="mx-2"
    loading-text="Подождите, данные загружаются"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Состояние склада</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="650px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" fab small dark class="mb-2" v-on="on">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </template>
          <WarehouseFormCondition
            :warehouseId="warehouseId"
            @close="close"
            @save="save"
            @refresh="initialize"
          />
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import WarehouseFormCondition from "@/components/WarehouseFormCondition";

import { getAll } from "@/API/warehouse-condition.js";

export default {
  name: "WarehouseFormTable.vue",
  components: {
    WarehouseFormCondition
  },
  props: ["warehouseId"],
  data() {
    return {
      dialog: false,
      loading: false,
      options: {},
      conditions: [],
      total: 0,
      headers: [
        {
          text: "Наименование продукции",
          value: "productTitle",
          sortable: false
        },
        { text: "Кол-во на складе", value: "count", sortable: false }
      ]
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
        this.conditions = [];

        const pagination = {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0]
        };
        const response = await getAll(this.$props.warehouseId, pagination);

        this.total = response.data.content.length;
        response.data.content.forEach(el =>
          this.conditions.push({
            id: el.id,
            productTitle: el.product.title,
            count: el.count
          })
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    save() {
      this.$emit("save");
      this.close();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    }
  }
};
</script>

<style></style>
