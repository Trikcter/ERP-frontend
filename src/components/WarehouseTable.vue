<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="warehouses"
    :search="search"
    :loading="loading"
    :options.sync="options"
    :server-items-length="totalWarehouses"
    show-select
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2"
    loading-text="Подождите, данные загружаются"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Склады компании</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          v-if="deletedEntites"
          color="red"
          dark
          text
          class="mb-2"
          @click="deleteEntity = true"
        >
          Удалить склады
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark text class="mb-2" v-on="on">
              Добавить склад
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Добавить склад</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="d-flex flex-column">
                  <v-text-field
                    v-model="editedItem.title"
                    placeholder="Наименование склада"
                    label="Введите наименование"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.address"
                    placeholder="Адрес склада"
                    label="Введите адрес"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.volume"
                    placeholder="Вместительность"
                    label="Введите вместительность склада"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="close">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="deleteEntity" max-width="350px">
          <v-card>
            <v-card-title>
              <span class="headline">Удаление сущности</span>
            </v-card-title>
            <v-card-text>
              Вы точно хотите удалить данную сущность? Она останется в базе для
              предотвращения конфликтов при удалении
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteEntity = false">
                Отмена
              </v-btn>
              <v-btn color="red darken-1" text @click="deleteItem">Да</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" text @click="initialize">
        Перезагрузить данные
      </v-btn>
    </template>
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
    <template v-slot:item.title="{ item }">
      <v-chip
        :disabled="item.delete"
        :color="getColor(item.delete)"
        link
        @click="editItem(item)"
        dark
      >
        {{ item.title }}
      </v-chip>
    </template>
    <template v-slot:item.congestion="{ item }">
      <v-chip :color="getCongestionColor(item.congestion)" dark>
        {{ item.congestion }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
import { AXIOS } from "../plugins/http-commons.js";

export default {
  name: "WarehouseTable",
  data: () => ({
    dialog: false,
    selected: [],
    deleteEntity: false,
    headers: [
      {
        text: "Наименование склада",
        value: "title",
        sortable: false
      },
      { text: "Адрес склада", value: "address", sortable: false },
      { text: "Вместительность", value: "volume", sortable: false },
      {
        text: "Загруженность (%)",
        value: "congestion",
        sortable: false,
        align: "center"
      }
    ],
    warehouses: [],
    loading: false,
    isError: false,
    message: "",
    search: "",
    editedIndex: -1,
    timeout: 5000,
    options: {},
    totalWarehouses: 0,
    editedItem: {
      id: 0,
      title: "",
      code: "",
      price: 0
    },
    snackbarColor: "red",
    defaultItem: {
      title: "",
      address: "",
      volume: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Новый склад" : "Редактирование склада";
    },
    deletedEntites() {
      if (this.selected.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    options: {
      handler() {
        this.initialize();
      }
    }
  },

  methods: {
    initialize() {
      this.loading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.get("warehouse/all/" + this.$store.getters.getOrganizationId, {
        headers: header,
        params: {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0]
        }
      })
        .then(response => {
          this.warehouses = [];
          this.loading = false;
          this.totalWarehouses = response.data.totalElements;

          response.data.content.forEach(el =>
            this.warehouses.push({
              id: el.id,
              title: el.title,
              address: el.addressTitle,
              volume: el.volume,
              delete: el.isDeleted,
              congestion: this.calculateCongestion(el.volume, el.condition)
            })
          );
        })
        .catch(e => {
          this.loading = false;
          this.getError(e.response.data);
        });
    },

    calculateCongestion(volume, condition) {
      let countSum = condition.map(c => c.count).reduce((a, b) => a + b, 0);

      return ((countSum / volume) * 100).toFixed(2);
    },

    getColor(deleted) {
      if (deleted) {
        return "red";
      } else {
        return "green";
      }
    },

    getCongestionColor(value) {
      if (value == 0 || value <= 55) {
        return "green";
      } else {
        if (value > 55 && value <= 80) {
          return "orange";
        } else {
          return "red";
        }
      }
    },

    editItem(item) {
      this.$router.push("/warehouse/" + item.id);
    },

    deleteItem() {
      this.deleteEntity = false;
      let ids = this.selected.map(el => {
        return el.id;
      });

      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.delete("/warehouse", { headers: header, data: ids })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.loading = false;
          this.selected = [];

          this.initialize();
        })
        .catch(e => {
          this.loading = false;
          this.getError(e.response.data);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.put();
      } else {
        this.post();
      }
      this.close();
    },

    post() {
      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.post(
        "/warehouse",
        {
          title: this.editedItem.title,
          addressTitle: this.editedItem.address,
          volume: this.editedItem.volume,
          organizationId: this.$store.getters.getOrganizationId
        },
        {
          headers: header
        }
      )
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.loading = false;
          this.initialize();
        })
        .catch(e => {
          this.loading = false;
          this.getError(e.response.data.message);
        });
    },

    put() {
      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.put(
        "/warehouse",
        {
          id: this.editedItem.id,
          title: this.editedItem.title,
          address: this.editedItem.address,
          volume: this.editedItem.volume,
          organizationId: this.$store.getters.getOrganizationId
        },
        {
          headers: header
        }
      )
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.loading = false;
          this.initialize();
        })
        .catch(e => {
          this.loading = false;
          this.getError(e.response.data.message);
        });
    },

    getError(value) {
      this.$data.isError = true;
      this.$data.message = value;
    }
  }
};
</script>

<style></style>
