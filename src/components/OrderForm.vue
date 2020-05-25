<template>
  <div>
    <v-card class="my-10 mx-2">
      <v-card-title>
        <span class="headline">
          Проведение продажи продукции
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="d-flex flex-row">
            <v-form
              style="width:100%"
              class="d-flex flex-column"
              ref="form"
              v-model="valid"
            >
              <v-autocomplete
                v-model="productSelect"
                :loading="loading"
                :items="productSelects"
                :rules="[v => !!v || 'Продукция не может быть пустой!']"
                flat
                class="mr-5"
                hide-no-data
                label="Продукция"
                placeholder="Выберите продукцию"
              ></v-autocomplete>
              <v-autocomplete
                v-model="warehouseSelect"
                :loading="loading"
                :items="warehouseSelects"
                :rules="[v => !!v || 'Склад не может быть пустым!']"
                flat
                class="mr-5"
                hide-no-data
                label="Склад"
                placeholder="Выберите склад"
              ></v-autocomplete>
              <v-text-field
                :loading="loading"
                v-model="count"
                :rules="countRules"
                placeholder="Количество товара"
                label="Введите количество товара"
                class="mr-10"
              ></v-text-field>
            </v-form>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          :loading="loading"
          :disabled="!valid"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { getAllActiveProducts } from "@/API/products.js";
import { create } from "@/API/order.js";
import { getAllActiveWarehouse } from "@/API/warehouse.js";

export default {
  name: "BankForm",
  data() {
    return {
      count: 0,
      loading: false,
      valid: true,
      countRules: [
        v => !!v || "Количество не может быть пустым!",
        v => !isNaN(v) || "Количество - это число!"
      ],
      productSelect: null,
      productSelects: [],
      products: [],
      warehouseSelect: null,
      warehouseSelects: [],
      warehouses: []
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.loading = false;

      try {
        const params = {
          organizationId: this.$store.getters.getOrganizationId
        };

        const responseProduct = await getAllActiveProducts(params);
        const responseWarehouse = await getAllActiveWarehouse(params);

        this.productSelects = [];
        this.warehouseSelects = [];

        this.products = [];
        this.warehouses = [];

        responseProduct.data.content.forEach(el => {
          this.products.push({
            id: el.id,
            title: el.title
          });

          this.productSelects.push(el.title);
        });

        responseWarehouse.data.content.forEach(el => {
          this.warehouses.push({
            id: el.id,
            title: el.title
          });

          this.warehouseSelects.push(el.title);
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    findElement(array, partElement) {
      return array.filter(el => el.title === partElement)[0];
    },

    async save() {
      this.loading = true;

      try {
        const product = this.findElement(this.products, this.productSelect);
        const warehouse = this.findElement(
          this.warehouses,
          this.warehouseSelect
        );

        const params = {
          organizationId: this.$store.getters.getOrganizationId,
          warehouseId: warehouse.id
        };

        const operation = {
          count: this.count,
          productId: product.id
        };

        await create(operation, params);
        this.initialize();
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
