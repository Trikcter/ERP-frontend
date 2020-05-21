<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="products"
    :search="search"
    :loading="loading"
    :options.sync="options"
    :server-items-length="totalProducts"
    show-select
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2"
    loading-text="Подождите, данные загружаются"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Продукция компании</v-toolbar-title>
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
          Удалить продукцию
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark text class="mb-2" v-on="on">
              Добавить продукцию
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="d-flex flex-column">
                  <v-text-field
                    v-model="editedItem.title"
                    placeholder="Наименование продукции"
                    label="Введите наименование"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.code"
                    placeholder="Код продукции"
                    label="Введите код"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.price"
                    placeholder="Цена"
                    label="Введите цену"
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
      Нет данных
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
  </v-data-table>
</template>

<script>
import { AXIOS } from "../plugins/http-commons.js";

export default {
  name: "ProductTable",
  data: () => ({
    dialog: false,
    selected: [],
    deleteEntity: false,
    headers: [
      {
        text: "Наименование продукции",
        value: "title",
        sortable: false
      },
      { text: "Код продукции", value: "code", sortable: false },
      { text: "Цена (Рубли)", value: "price", sortable: false }
    ],
    products: [],
    loading: false,
    isError: false,
    message: "",
    search: "",
    editedIndex: -1,
    timeout: 5000,
    options: {},
    totalProducts: 0,
    editedItem: {
      id: 0,
      title: "",
      code: "",
      price: 0
    },
    snackbarColor: "red",
    defaultItem: {
      title: "",
      code: "",
      price: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Новая продукция"
        : "Редактирование продукции";
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

      AXIOS.get("product/all/" + this.$store.getters.getOrganizationId, {
        headers: header,
        params: {
          size: this.options.itemsPerPage,
          direction: this.options.sortDesc[0],
          page: this.options.page - 1,
          sortBy: this.options.sortBy[0]
        }
      })
        .then(response => {
          this.products = [];
          this.loading = false;
          this.totalProducts = response.data.totalElements;

          response.data.content.forEach(el =>
            this.products.push({
              id: el.id,
              title: el.title,
              code: el.code,
              price: el.price,
              delete: el.isDeleted
            })
          );
        })
        .catch(e => {
          this.loading = false;
          this.getError(e.response.data);
        });
    },

    getColor(deleted) {
      if (deleted) {
        return "red";
      } else {
        return "green";
      }
    },

    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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

      AXIOS.delete("/product", { headers: header, data: ids })
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
        "/product",
        {
          title: this.editedItem.title,
          code: this.editedItem.code,
          price: this.editedItem.price,
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
          this.getError(e.response.data);
        });
    },

    put() {
      this.loading = true;

      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.put(
        "/product",
        {
          id: this.editedItem.id,
          title: this.editedItem.title,
          code: this.editedItem.code,
          price: this.editedItem.price,
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
          this.getError(e.response.data);
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
