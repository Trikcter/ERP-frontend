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
        <v-toolbar-title>Операции с финансами</v-toolbar-title>
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
import {
  getAll,
  editOperation,
  createOperation,
  deleteOperations
} from "@/API/financial-operation.js";

export default {
  name: "FinancialOperationForm",
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
      {
        text: "Описание",
        value: "description",
        sortable: false
      },
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
    options: {},
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

        const response = await getAll(params);

        this.operations = [];
        this.total = response.data.totalElements;

        response.data.content.forEach(el =>
          this.operations.push({
            id: el.id,
            name: el.name,
            description: el.description,
            delete: el.isDeleted
          })
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async deleted() {
      this.loading = true;

      try {
        await deleteOperations(this.deleteIds);
        this.initialize();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.selected = [];
        this.deleteEntity = false;
        this.deleteIds = [];
      }
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

    async post() {
      this.loading = true;

      try {
        const operation = {
          name: this.editedItem.name,
          description: this.editedItem.description,
          organizationId: this.$store.getters.getOrganizationId
        };

        await createOperation(operation);
        this.initialize();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async put() {
      this.loading = true;

      try {
        const operation = {
          id: this.editedItem.id,
          name: this.editedItem.name,
          description: this.editedItem.description,
          organizationId: this.$store.getters.getOrganizationId
        };

        await editOperation(operation);
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
