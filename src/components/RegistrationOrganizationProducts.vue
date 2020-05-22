<template>
  <div>
    <v-card outlined class="mt-2 mb-5" color="white">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="title"
          :rules="[v => !!v || 'Название продукта не может быть пустым!']"
          label="Название продукта"
          placeholder="Введите название"
        ></v-text-field>
        <v-text-field
          v-model="code"
          label="Код продукции"
          placeholder="Введите код"
        ></v-text-field>
        <v-text-field
          v-model="price"
          :rules="priceRules"
          label="Цена"
          placeholder="Введите цену"
        ></v-text-field>
        <v-btn small text @click="addProduct" :disabled="!valid">
          Добавить
        </v-btn>
      </v-form>
      <v-simple-table fixed-header class="mt-3" height="200px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Наименование</th>
              <th class="text-left">Код</th>
              <th class="text-left">Цена</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.name">
              <td>{{ item.title }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.price }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-btn @click="addProducts(true)" text class="ma-0" :loading="loading">
      Завершить регистрацию
    </v-btn>
    <v-btn @click="addProducts(false)" text class="ma-0" :loading="loading">
      Готово
    </v-btn>
    <v-btn @click="this.$emit('next')" text class="ma-0">
      <div>
        Пропустить
        <v-icon right class="mb-1">mdi-arrow-right</v-icon>
      </div>
    </v-btn>
  </div>
</template>

<script>
import { createProducts } from "@/API/products.js";

export default {
  name: "RegistrationOrganizationProducts",
  data() {
    return {
      title: "",
      code: "",
      price: 0,
      products: [],
      valid: true,
      loading: false,
      priceRules: [
        v => !!v || "Цена не может быть пустой!",
        v =>
          (typeof v == "string" && !v.includes(",")) ||
          "Дробное число записывает через точку!",
        v => !isNaN(v) || "Цена может быть тольком числом!"
      ]
    };
  },
  methods: {
    addProduct() {
      this.products.push({
        title: this.title,
        code: this.code,
        price: this.price,
        organizationId: this.$store.getters.getOrganizationId
      });

      this.$refs.form.reset();
    },

    async addProducts(path) {
      if (this.products.length == 0) {
        this.$router.push("/home");
      }

      this.loading = true;

      try {
        // eslint-disable-next-line no-unused-vars
        const response = await createProducts(this.products);
        if (path) {
          this.$router.push("/home");
        } else {
          this.$emit("next");
        }
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
