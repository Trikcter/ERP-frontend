<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="products"
    :loading="loading"
    :options.sync="options"
    :server-items-length="totalProducts"
    show-select
    :footer-props="{
      itemsPerPageText: 'Отображать по:'
    }"
    class="my-10 mx-2 elevation-1"
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
          @click="isDelete = true"
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
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="editedItem.title"
                      :rules="[
                        v => !!v || 'Название продукта не может быть пустым!'
                      ]"
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
                      :rules="priceRules"
                      placeholder="Цена"
                      label="Введите цену"
                    ></v-text-field>
                  </v-form>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="close">Отмена</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
                :disabled="!valid"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
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
import {
  getAll,
  createProduct,
  editProduct,
  deleteProducts
} from "@/API/products.js";

export default {
  name: "ProductTable",
  data: () => ({
    dialog: false,
    selected: [],
    isDelete: false,
    headers: [
      { text: "Наименование продукции", value: "title", sortable: false },
      { text: "Код продукции", value: "code", sortable: false },
      { text: "Цена (Рубли)", value: "price", sortable: false }
    ],
    products: [],
    loading: false,
    valid: false,
    priceRules: [
      v => !!v || "Цена не может быть пустой!",
      v =>
        (typeof v == "string" && !v.includes(",")) ||
        "Дробное число записывает через точку!",
      v => !isNaN(v) || "Цена может быть тольком числом!"
    ],
    editedIndex: -1,
    options: {},
    totalProducts: 0,
    editedItem: {
      id: 0,
      title: "",
      code: "",
      price: 0
    },
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

        this.products = [];
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
      this.editedIndex = this.products.indexOf(item);
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

        await deleteProducts(ids);
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
        const product = {
          title: this.editedItem.title,
          code: this.editedItem.code,
          price: this.editedItem.price,
          organizationId: this.$store.getters.getOrganizationId
        };

        await createProduct(product);
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
        const product = {
          id: this.editedItem.id,
          title: this.editedItem.title,
          code: this.editedItem.code,
          price: this.editedItem.price,
          organizationId: this.$store.getters.getOrganizationId
        };

        await editProduct(product);
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
