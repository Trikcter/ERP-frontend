<template>
  <v-card>
    <v-card-title>
      <span class="headline">Изменение состояние склада</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row class="d-flex flex-row">
          <v-col cols="6" class="pa-0 ma-0">
            <v-autocomplete
              v-model="selectProduct"
              :loading="loading"
              :items="productsSelect"
              flat
              class="mr-5"
              hide-no-data
              label="Продукция"
              placeholder="Выберите продукцию"
            ></v-autocomplete>
          </v-col>
          <v-col cols="6" class="pa-0 ma-0">
            <v-text-field
              v-model="count"
              label="Количество"
              placeholder="Введите количество товара"
            ></v-text-field>
          </v-col>
          <v-checkbox
            v-model="into"
            label="Перемещения между складами организации?"
          ></v-checkbox>
          <v-autocomplete
            v-model="selectWarehouse"
            :loading="loading"
            :items="warehousesSelect"
            :disabled="!into"
            flat
            class="mr-5"
            hide-no-data
            label="Склад"
            placeholder="Выберите склад"
          ></v-autocomplete>
          <v-autocomplete
            v-model="selectOperation"
            :loading="loading"
            :items="operationsSelect"
            flat
            class="mr-5"
            hide-no-data
            label="Тип операции"
            placeholder="Выберите причину перевода товаров"
          ></v-autocomplete>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="close">Отмена</v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="saveCondition"
        :loading="loading"
        :disabled="loading"
      >
        Сохранить
        <template v-slot:loader>
          <span class="custom-loader">
            <v-icon light>mdi-cached</v-icon>
          </span>
        </template>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getAllActive } from "@/API/warehouse-operation.js";
import { getAllActiveWarehouse } from "@/API/warehouse.js";
import { getAllActiveProducts } from "@/API/products.js";
import { createCondition } from "@/API/warehouse-condition.js";

export default {
  name: "WarehouseFormCondition",
  props: ["warehouseId"],
  data() {
    return {
      count: 0,
      loading: false,
      edit: false,
      search: null,
      selectProduct: null,
      selectWarehouse: null,
      selectOperation: null,
      into: false,
      products: [],
      productsSelect: [],
      warehouses: [],
      warehousesSelect: [],
      operations: [],
      operationsSelect: []
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.initializeOperations();
      this.initializeWarehouses();
      this.initializeProducts();
    },

    async initializeOperations() {
      this.loading = true;

      try {
        const response = await getAllActive(
          this.$store.getters.getOrganizationId
        );

        this.operations = [];
        this.operationsSelect = [];

        response.data.content.forEach(el => {
          if (el.id != this.warehouseId) {
            this.operations.push({
              id: el.id,
              title: el.name
            });

            this.operationsSelect.push(el.name);
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async initializeWarehouses() {
      this.loading = true;

      try {
        // eslint-disable-next-line no-unused-vars
        const response = await getAllActiveWarehouse(
          this.$store.getters.getOrganizationId
        );

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

    async initializeProducts() {
      this.loading = true;

      try {
        const response = await getAllActiveProducts(
          this.$store.getters.getOrganizationId
        );

        this.products = [];
        this.productsSelect = [];

        response.data.content.forEach(el => {
          this.products.push({
            id: el.id,
            title: el.title,
            code: el.code,
            price: el.price,
            delete: el.isDeleted
          });

          this.productsSelect.push(el.title);
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async saveCondition() {
      this.loading = true;

      try {
        const product = this.findElement(this.products, this.selectProduct);
        const warehouseSender = this.findElement(
          this.warehouses,
          this.selectWarehouse
        );

        const condition = {
          count: this.count,
          product: {
            id: product.id,
            title: product.title,
            code: product.code,
            price: product.price,
            delete: product.isDeleted
          },
          warehouseId: this.$props.warehouseId
        };

        const params = {
          typeOperation: this.findElement(this.operations, this.selectOperation)
            .id,
          warehouseId: warehouseSender == undefined ? null : warehouseSender.id
        };

        this.$emit("save");

        await createCondition(condition, params);

        this.$emit("refresh");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    findElement(array, partElement) {
      return array.filter(el => el.title === partElement)[0];
    },

    close() {
      this.$emit("close");
    }
  }
};
</script>

<style></style>
