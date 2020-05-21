<template>
  <v-data-table
    :headers="headers"
    :items="operations"
    :loading="loading"
    :server-items-length="total"
    :options.sync="options"
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2 elevation-1"
    loading-text="Подождите, данные загружаются"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Операции со складом</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" text v-on="on"
              >Добавить новую операцию</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row class="d-flex flex-column">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Название операции"
                    placeholder="Введите название"
                  ></v-text-field>
                  <v-textarea
                    v-model="editedItem.description"
                    label="Описание"
                    placeholder="Введите описание"
                  ></v-textarea>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Отменить</v-btn>
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
              <v-btn color="red darken-1" text @click="deleted">Да</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
    <template v-slot:item.name="{ item }">
      <v-chip
        :disabled="item.delete"
        :color="getColor(item.delete)"
        link
        @click="editItem(item)"
        dark
      >
        {{ item.name }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="red" small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
  </v-data-table>
</template>

<script>
import { AXIOS } from "../plugins/http-commons.js";

export default {
  name: "WarehouseOperationForm",
  data: () => ({
    dialog: false,
    deleteEntity: false,
    total: 0,
    headers: [
      {
        text: "Наименование",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Описание", value: "description", sortable: false },
      {
        text: "Удаление элемента",
        value: "actions",
        sortable: false,
        align: "center"
      }
    ],
    operations: [],
    deleteIds: [],
    editedIndex: -1,
    loading: false,
    isError: false,
    options: {},
    message: "",
    timeout: 5000,
    editedItem: {
      name: "",
      id: 0,
      description: ""
    },
    defaultItem: {
      name: "",
      description: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Новая операция"
        : "Редактирование операции";
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
    getColor(deleted) {
      if (deleted) {
        return "red";
      } else {
        return "green";
      }
    },

    getError(value) {
      this.loading = false;
      this.$data.isError = true;
      this.$data.message = value;
    },

    initialize() {
      this.loading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      const pagination = {
        size: this.options.itemsPerPage,
        direction: this.options.sortDesc[0],
        page: this.options.page - 1,
        sortBy: this.options.sortBy[0]
      };

      AXIOS.get(
        "warehouse_operation/all/" + this.$store.getters.getOrganizationId,
        {
          headers: header,
          params: pagination
        }
      )
        .then(response => {
          this.operations = [];
          this.loading = false;

          this.total = response.data.totalElements;

          response.data.content.forEach(el =>
            this.operations.push({
              id: el.id,
              name: el.name,
              description: el.description,
              delete: el.isDeleted
            })
          );
        })
        .catch(e => {
          this.getError(e.response.data);
        });
    },

    deleted() {
      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.delete("/warehouse_operation", {
        headers: header,
        data: this.deleteIds
      })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.loading = false;
          this.selected = [];
          this.deleteEntity = false;
          this.deleteIds = [];

          this.initialize();
        })
        .catch(e => {
          this.deleteEntity = false;
          this.deleteIds = [];

          this.getError(e.response.data);
        });
    },

    editItem(item) {
      this.editedIndex = this.operations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.deleteIds.push(item.id);
      this.deleteEntity = true;
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
        "/warehouse_operation",
        {
          name: this.editedItem.name,
          description: this.editedItem.description,
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
          this.getError(e.response.data);
        });
    },

    put() {
      this.loading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.put(
        "/warehouse_operation",
        {
          id: this.editedItem.id,
          name: this.editedItem.name,
          description: this.editedItem.description,
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
          this.getError(e.response.data);
        });
    }
  }
};
</script>

<style></style>
