<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="warehouses"
    :loading="loading"
    :options.sync="options"
    :server-items-length="totalWarehouses"
    show-select
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2 elevation-1"
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
import { getAll, createWarehouse, deleteWarehouses } from "@/API/warehouse.js";

export default {
  name: "WarehouseTable",
  data: () => ({
    dialog: false,
    selected: [],
    deleteEntity: false,
    headers: [
      { text: "Наименование склада", value: "title", sortable: false },
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
    editedIndex: -1,
    options: {},
    totalWarehouses: 0,
    editedItem: {
      id: 0,
      title: "",
      address: "",
      volume: 0
    },
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
    async initialize() {
      this.loading = true;

      try {
        const pagination = {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0]
        };

        const response = await getAll(
          this.$store.getters.getOrganizationId,
          pagination
        );

        this.warehouses = [];
        this.totalWarehouses = response.data.totalElements;

        response.data.content.forEach(el =>
          this.warehouses.push({
            id: el.id,
            title: el.title,
            address: el.addressTitle,
            volume: el.volume,
            delete: el.isDeleted,
            congestion: el.congestion.toFixed(2)
          })
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
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

    async deleteItem() {
      this.deleteEntity = false;
      this.loading = true;

      try {
        let ids = this.selected.map(el => {
          return el.id;
        });

        await deleteWarehouses(ids);

        this.selected = [];
        this.initialize();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.post();
      this.close();
    },

    async post() {
      this.loading = true;

      try {
        const warehouse = {
          title: this.editedItem.title,
          addressTitle: this.editedItem.address,
          volume: this.editedItem.volume,
          organizationId: this.$store.getters.getOrganizationId
        };

        await createWarehouse(warehouse);
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
