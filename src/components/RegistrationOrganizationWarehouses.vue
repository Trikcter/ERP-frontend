<template>
  <div>
    <v-card outlined class="mt-2 mb-5" color="white">
      <v-form ref="form_w" v-model="valid" lazy-validation>
        <v-text-field
          v-model="warehouse_title"
          :rules="[v => !!v || 'Название склада не может быть пустым!']"
          label="Название склада"
          placeholder="Введите название"
        ></v-text-field>
        <v-text-field
          v-model="address"
          :rules="[v => !!v || 'Адрес склада не может быть пустым!']"
          label="Адрес склада"
          placeholder="Введите адрес"
        ></v-text-field>
        <v-text-field
          v-model="volume"
          :rules="volumeRules"
          label="Вместительность"
          placeholder="Введите вместительность"
        ></v-text-field>
        <v-btn small text @click="addWarehouse" :disabled="!valid">
          Добавить
        </v-btn>
      </v-form>
      <v-simple-table fixed-header class="mt-3" height="175px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Наименование</th>
              <th class="text-left">Адрес</th>
              <th class="text-left">Вместительность</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in warehouses" :key="item.name">
              <td>{{ item.title }}</td>
              <td>{{ item.addressTitle }}</td>
              <td>{{ item.volume }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-btn @click="addWarehouses" text class="ma-0" :loading="loading">
      Готово
    </v-btn>
  </div>
</template>

<script>
import { createWarehouses } from "@/API/warehouse.js";

export default {
  name: "RegistrationOrganizationWarehouses",
  data() {
    return {
      warehouses: [],
      warehouse_title: "",
      volume: 0,
      address: "",
      addressOrganization: "",
      valid: true,
      loading: false,
      volumeRules: [
        v => !!v || "Вместительность склада не может быть пустой!",
        v => !isNaN(v) || "Вместительность - это число!",
        v =>
          Number.isInteger(parseInt(v, 10)) || "Вместительность - целое число!"
      ]
    };
  },
  methods: {
    addWarehouse() {
      this.warehouses.push({
        title: this.warehouse_title,
        organizationId: this.$store.getters.getOrganizationId,
        addressTitle: this.address,
        volume: this.volume
      });

      this.$refs.form_w.reset();
    },

    async addWarehouses() {
      if (this.warehouses.length == 0) {
        this.$router.push("/home");
      }

      this.loading = true;

      try {
        // eslint-disable-next-line no-unused-vars
        const response = await createWarehouses(this.warehouses);

        this.$router.push("/home");
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
