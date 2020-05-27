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
            <v-form
              style="width:100%"
              class="d-flex flex-row"
              ref="form"
              v-model="valid"
            >
              <v-text-field
                :loading="loading"
                v-model="title"
                :rules="[v => !!v || 'Название склада не может быть пустым!']"
                placeholder="Наименование склада"
                label="Введите наименование"
                class="mr-10"
                @change="editable"
              ></v-text-field>
              <v-text-field
                :loading="loading"
                v-model="addressTitle"
                :rules="[v => !!v || 'Адрес склада не может быть пустым!']"
                placeholder="Адрес склада"
                label="Введите адрес"
                class="mr-10"
                @change="editable"
              ></v-text-field>
              <v-text-field
                :loading="loading"
                v-model="volume"
                :rules="volumeRules"
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
          :loading="loading"
          :disabled="!valid"
          v-if="edit"
          @click="editWarehouse"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
      <WarehouseFormTable :warehouseId="warehouseId" @save="save" />
    </v-card>
  </div>
</template>

<script>
import { editWarehouse, getWarehouse } from "@/API/warehouse.js";
import WarehouseFormTable from "@/components/WarehouseFormTable";

export default {
  name: "WarehouseForm",
  props: ["warehouseId"],
  components: {
    WarehouseFormTable
  },
  data() {
    return {
      title: "",
      addressTitle: "",
      volume: 0,
      loading: false,
      valid: false,
      edit: false,
      volumeRules: [
        v => !!v || "Вместительность склада не может быть пустой!",
        v => !isNaN(v) || "Вместительность - это число!",
        v =>
          Number.isInteger(parseInt(v, 10)) || "Вместительность - целое число!"
      ],
      headers: [
        {
          text: "Наименование продукции",
          value: "productTitle",
          sortable: false
        },
        { text: "Кол-во на складе", value: "count", sortable: false }
      ]
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    editable() {
      this.edit = true;
    },

    async initialize() {
      this.loading = true;

      try {
        const response = await getWarehouse(this.$props.warehouseId);

        this.title = response.data.title;
        this.volume = response.data.volume;
        this.addressTitle = response.data.addressTitle;

        this.edit = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    back() {
      this.$router.push("/warehouses");
    },

    save() {
      if (this.edit) {
        this.editWarehouse();
      }
    },

    async editWarehouse() {
      this.loading = true;

      try {
        const warehouse = {
          id: this.warehouseId,
          title: this.title,
          addressTitle: this.addressTitle,
          volume: this.volume,
          organizationId: this.$store.getters.getOrganizationId
        };

        await editWarehouse(warehouse);
        this.$refs.form.resetValidation();

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
