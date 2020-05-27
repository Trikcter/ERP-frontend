<template>
  <div>
    <v-card class="my-10 mx-2">
      <v-card-title>
        <span class="headline">
          Проведение и учет банковских операций
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="d-flex flex-row">
            <v-form
              style="width:100%"
              class="d-flex flex-column"
              ref="form"
              v-model="valid"
            >
              <v-autocomplete
                v-model="select"
                :loading="loading"
                :items="selects"
                :rules="[v => !!v || 'Операция не может быть пустой!']"
                flat
                class="mr-5"
                hide-no-data
                label="Тип операции"
                placeholder="Выберите причину перевода денег"
              ></v-autocomplete>
              <v-text-field
                :loading="loading"
                v-model="sum"
                :rules="sumRules"
                placeholder="Сумма перевода"
                label="Введите сумму перевода"
                class="mr-10"
              ></v-text-field>
              <v-textarea
                :loading="loading"
                v-model="comment"
                placeholder="Комментарий к операции"
                label="Введите комментарий"
                class="mr-10"
              ></v-textarea>
            </v-form>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          :loading="loading"
          :disabled="!valid"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { getAllActive } from "@/API/financial-operation.js";
import { create } from "@/API/bank-operation.js";

export default {
  name: "BankForm",
  data() {
    return {
      comment: "",
      sum: 0,
      loading: false,
      valid: true,
      sumRules: [
        v => !!v || "Сумма не может быть пустой!",
        v => !isNaN(v) || "Сумма - это число!"
      ],
      select: null,
      selects: [],
      operations: []
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.loading = false;

      try {
        const params = {
          organizationId: this.$store.getters.getOrganizationId
        };

        const response = await getAllActive(params);

        this.selects = [];
        this.operations = [];

        response.data.content.forEach(el => {
          this.operations.push({
            id: el.id,
            title: el.name
          });

          this.selects.push(el.name);
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    findElement(array, partElement) {
      return array.filter(el => el.title === partElement)[0];
    },

    async save() {
      this.loading = true;

      try {
        const type = this.findElement(this.operations, this.select);

        const params = {
          organizationId: this.$store.getters.getOrganizationId
        };

        const operation = {
          sum: this.sum,
          comment: this.comment,
          typeId: type.id
        };

        await create(operation, params);
        this.$refs.form.reset();

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
