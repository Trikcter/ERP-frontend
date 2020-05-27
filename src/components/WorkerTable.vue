<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="workers"
    :loading="loading"
    :options.sync="options"
    :server-items-length="total"
    show-select
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2 elevation-1"
    loading-text="Подождите, данные загружаются"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Сотрудники компании</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          v-if="deletedEntites"
          color="red"
          dark
          text
          class="mb-2"
          @click="isDelete = true"
        >
          Удалить пользователей
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark text class="mb-2" v-on="on">
              Добавить сотрудника
            </v-btn>
          </template>
          <WorkerTableForm
            :editedIndex="editedIndex"
            :worker="editedItem"
            @close="close"
            @refresh="refresh"
          />
        </v-dialog>
        <v-dialog v-model="isDelete" max-width="350px">
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
              <v-btn color="blue darken-1" text @click="isDelete = false">
                Отмена
              </v-btn>
              <v-btn color="red darken-1" text @click="deleteItems">Да</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      Нет данных
    </template>
    <template v-slot:item.fio="{ item }">
      <v-chip
        :disabled="item.delete"
        :color="getColor(item.delete)"
        link
        @click="editItem(item)"
        dark
      >
        {{ item.fio }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
import { getAllWorkers, deleteWorkers } from "@/API/worker.js";

import WorkerTableForm from "@/components/WorkerTableForm.vue";

export default {
  name: "ProductTable",
  components: {
    WorkerTableForm
  },
  data: () => ({
    dialog: false,
    selected: [],
    isDelete: false,
    headers: [
      { text: "ФИО", value: "fio", sortable: false },
      { text: "Должность", value: "roleDescription", sortable: false }
    ],
    workers: [],
    loading: false,
    editedIndex: -1,
    options: {},
    total: 0,
    editedItem: {
      id: 0,
      login: "",
      password: "",
      fio: "",
      role: null,
      roleDescription: ""
    },
    defaultItem: {
      id: 0,
      login: "",
      password: "",
      fio: "",
      role: null,
      roleDescription: ""
    }
  }),

  computed: {
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
        const params = {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0],
          organizationId: this.$store.getters.getOrganizationId
        };

        const response = await getAllWorkers(params);

        this.workers = [];
        this.total = response.data.totalElements;

        response.data.content.forEach(el => {
          if (el.login != this.$store.getters.getUsername) {
            this.workers.push({
              id: el.id,
              login: el.login,
              password: el.password,
              fio: el.fio,
              role: el.role,
              roleDescription: el.role.description,
              delete: el.isDeleted
            });
          }
        });
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

    editItem(item) {
      this.editedIndex = this.workers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItems() {
      this.isDelete = false;
      this.loading = true;

      try {
        let ids = this.selected.map(el => {
          return el.id;
        });

        await deleteWorkers(ids);
        this.selected = [];

        this.initialize();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    refresh() {
      this.initialize();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }
  }
};
</script>

<style></style>
