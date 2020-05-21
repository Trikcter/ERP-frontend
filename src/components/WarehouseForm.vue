<template>
  <div>
    <v-card class="my-10 mx-2">
      <v-card-title>
        <span class="headline">
          Состояние склада #{{ this.$props.warehouseId }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="d-flex flex-row">
            <v-form style="width:100%" class="d-flex flex-row">
              <v-text-field
                :loading="loading"
                v-model="title"
                placeholder="Наименование склада"
                label="Введите наименование"
                class="mr-10"
                @change="editable"
              ></v-text-field>
              <v-text-field
                :loading="loading"
                v-model="addressTitle"
                placeholder="Адрес склада"
                label="Введите адрес"
                class="mr-10"
                @change="editable"
              ></v-text-field>
              <v-text-field
                :loading="loading"
                v-model="volume"
                placeholder="Вместительность"
                label="Введите вместительность склада"
                class="mr-10"
                @change="editable"
              ></v-text-field>
            </v-form>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="back" text class="ma-0">
          <v-icon left class="mb-1">mdi-arrow-left</v-icon>
          Назад
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          :loading="loadingData"
          :disabled="loadingData"
          v-if="edit"
          @click="save"
        >
          Сохранить
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </template>
        </v-btn>
      </v-card-actions>
      <v-data-table
        :headers="headers"
        :items="conditions"
        :loading="loading"
        :options.sync="options"
        :server-items-length="totalCondition"
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
              <v-card>
                <v-card-title>
                  <span class="headline">Изменение состояние склада</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row class="d-flex flex-row">
                      <v-col cols="6" class="pa-0 ma-0">
                        <v-autocomplete
                          v-model="select"
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
                    :loading="loadingData"
                    :disabled="loadingData"
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
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          Нет данных
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar
      v-model="isError"
      bottom
      color="red"
      multi-line
      right
      :timeout="timeout"
    >
      <v-icon dark class="mr-5">mdi-alert</v-icon>
      {{ message }}
      <v-btn dark icon @click="isError = false">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { AXIOS } from "../plugins/http-commons.js";

export default {
  name: "WarehouseForm",
  props: ["warehouseId"],
  data: () => ({
    title: "",
    dialog: false,
    addressTitle: "",
    volume: 0,
    isError: false,
    timeout: 5000,
    message: "",
    loading: false,
    edit: false,
    search: null,
    select: null,
    selectWarehouse: null,
    selectOperation: null,
    options: {},
    into: false,
    loadingData: false,
    totalCondition: 0,
    conditions: [],
    count: 0,
    editedItem: {
      productTitle: "",
      count: 0
    },
    defaultItem: {
      productTitle: "",
      count: 0
    },
    editedIndex: -1,
    headers: [
      {
        text: "Наименование продукции",
        value: "productTitle",
        sortable: false
      },
      { text: "Кол-во на складе", value: "count", sortable: false }
    ],
    products: [],
    productsSelect: [],
    warehouses: [],
    warehousesSelect: [],
    operations: [],
    operationsSelect: []
  }),
  watch: {
    dialog(val) {
      if (val) {
        this.initializeProducts();
        this.initializeWarehouses();
        this.initializeOperations();
      }
      val || this.close();
    },
    options: {
      handler() {
        this.initialize();
      }
    }
  },
  methods: {
    editable() {
      this.edit = true;
    },

    initializeOperations() {
      this.loading = true;
      this.loadingData = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.get(
        "warehouse_operation/active/" + this.$store.getters.getOrganizationId,
        {
          headers: header
        }
      )
        .then(response => {
          this.operations = [];
          this.operationsSelect = [];
          this.loading = false;
          this.loadingData = false;
          this.totalProducts = response.data.totalElements;

          response.data.content.forEach(el => {
            if (el.id != this.warehouseId) {
              this.operations.push({
                id: el.id,
                title: el.name
              });

              this.operationsSelect.push(el.name);
            }
          });
        })
        .catch(e => {
          this.loading = false;
          this.loadingData = false;
          this.getError(e);
        });
    },

    initializeWarehouses() {
      this.loading = true;
      this.loadingData = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.get("warehouse/active/" + this.$store.getters.getOrganizationId, {
        headers: header
      })
        .then(response => {
          this.warehouses = [];
          this.warehousesSelect = [];
          this.loading = false;
          this.loadingData = false;

          response.data.content.forEach(el => {
            if (el.id != this.warehouseId) {
              this.warehouses.push({
                id: el.id,
                title: el.title
              });

              this.warehousesSelect.push(el.title);
            }
          });
        })
        .catch(e => {
          this.loading = false;
          this.loadingData = false;
          this.getError(e);
        });
    },

    initializeProducts() {
      this.loading = true;
      this.loadingData = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.get("product/active/" + this.$store.getters.getOrganizationId, {
        headers: header
      })
        .then(response => {
          this.products = [];
          this.productsSelect = [];
          this.loading = false;
          this.loadingData = false;

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
        })
        .catch(e => {
          this.loading = false;
          this.loadingData = false;
          this.getError(e);
        });
    },

    initialize() {
      this.loading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.get("warehouse/" + this.$props.warehouseId, {
        headers: header
      })
        .then(response => {
          this.loading = false;

          this.title = response.data.title;
          this.volume = response.data.volume;
          this.addressTitle = response.data.addressTitle;

          this.totalCondition = response.data.condition.length;
          response.data.condition.forEach(el =>
            this.conditions.push({
              id: el.id,
              productTitle: el.product.title,
              count: el.count
            })
          );

          this.edit = false;
        })
        .catch(e => {
          this.loading = false;
          this.getError(e);
        });
    },

    getError(value) {
      this.$data.isError = true;
      if (value.response == undefined) {
        this.$data.message = "Отсутствует соединение с сервером!";
      } else {
        this.$data.message = value.response.data.message;
      }
    },

    back() {
      this.$router.push("/warehouses");
    },

    saveCondition() {
      this.loadingData = true;
      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      if (this.edit) {
        AXIOS.put(
          "/warehouse",
          {
            id: this.warehouseId,
            title: this.title,
            addressTitle: this.addressTitle,
            volume: this.volume,
            organizationId: this.$store.getters.getOrganizationId
          },
          {
            headers: header
          }
        )
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            this.sendCondtion(header);
            this.loading = false;
            this.loadingData = false;

            this.initialize();
          })
          .catch(e => {
            this.loading = false;
            this.loadingData = false;
            this.getError(e);
          });
      } else {
        this.sendCondtion(header);
      }
    },

    sendCondtion(header) {
      let product = this.findElement(this.products, this.select);
      let warehouseSender = this.findElement(
        this.warehouses,
        this.selectWarehouse
      );
      AXIOS.post(
        "/warehouse/condition",
        {
          count: this.count,
          product: {
            id: product.id,
            title: product.title,
            code: product.code,
            price: product.price,
            delete: product.isDeleted
          },
          warehouseId: this.warehouseId
        },
        {
          headers: header,
          params: {
            typeOperation: this.findElement(
              this.operations,
              this.selectOperation
            ).id,
            warehouseId:
              warehouseSender == undefined ? null : warehouseSender.id
          }
        }
      )
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.loading = false;
          this.loadingData = false;

          this.initialize();
        })
        .catch(e => {
          this.loading = false;
          this.loadingData = false;
          this.getError(e);
        });
    },

    save() {
      this.loadingData = true;
      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.put(
        "/warehouse",
        {
          id: this.warehouseId,
          title: this.title,
          addressTitle: this.addressTitle,
          volume: this.volume,
          organizationId: this.$store.getters.getOrganizationId
        },
        {
          headers: header
        }
      )
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.loading = false;
          this.loadingData = false;

          this.initialize();
        })
        .catch(e => {
          this.loading = false;
          this.loadingData = false;
          this.getError(e);
        });
    },

    findElement(array, partElement) {
      return array.filter(el => el.title === partElement)[0];
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
