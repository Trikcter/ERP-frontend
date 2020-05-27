<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ this.formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row class="d-flex flex-column">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="worker.login"
              :rules="[v => !!v || 'Логин не может быть пустым!']"
              placeholder="Логин сотрудника"
              label="Введите логин"
            ></v-text-field>
            <v-text-field
              v-model="worker.password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="show ? 'text' : 'password'"
              name="input-10-2"
              label="Пароль сотрудника"
              placeholder="Введите пароль сотрудника"
              @click:append="show = !show"
            ></v-text-field>
            <v-text-field
              v-model="worker.fio"
              :rules="nameRules"
              placeholder="ФИО сотрудника"
              label="Введите ФИО"
            ></v-text-field>
            <v-autocomplete
              v-model="select"
              :loading="loading"
              :items="rolesSelect"
              :rules="[v => !!v || 'Должность не может быть пустой!']"
              flat
              hide-no-data
              label="Должность"
              placeholder="Выберите должность сотрудника"
            ></v-autocomplete>
          </v-form>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="close">Отмена</v-btn>
      <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getAllRoles } from "@/API/role.js";
import { createWorker, editWorker } from "@/API/worker.js";

export default {
  name: "WorkerTableForm.vue",
  props: ["editedIndex", "worker"],
  data() {
    return {
      loading: false,
      rolesSelect: [],
      roles: [],
      select: null,
      show: false,
      valid: true,
      nameRules: [
        v => !!v || "ФИО не может быть пустым",
        v => v.split(" ").length >= 2 || "ФИО должно состоять из двух слов"
      ],
      rules: {
        required: value => !!value || "Пароль не может быть пустым"
      }
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Новый сотрудник"
        : "Редактирование данных сотрудника";
    }
  },
  methods: {
    async initialize() {
      this.loading = true;

      try {
        const response = await getAllRoles();

        this.roles = [];
        this.rolesSelect = [];

        response.data.forEach(el => {
          this.roles.push({
            name: el.name,
            description: el.description
          });

          this.rolesSelect.push(el.description);
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    findElement(array, partElement) {
      return array.filter(el => el.description === partElement)[0];
    },

    async post() {
      this.loading = true;

      try {
        const worker = {
          login: this.worker.login,
          password: this.worker.password,
          fio: this.worker.fio,
          role: this.findElement(this.roles, this.select)
        };

        const params = {
          organizationId: this.$store.getters.getOrganizationId
        };

        await createWorker(worker, params);

        this.select = null;
        this.$refs.form.resetValidation();

        this.$emit("refresh");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async put() {
      this.loading = true;

      try {
        const worker = {
          id: this.editedItem.id,
          title: this.editedItem.title,
          code: this.editedItem.code,
          price: this.editedItem.price,
          organizationId: this.$store.getters.getOrganizationId
        };

        const params = {
          organizationId: this.$store.getters.getOrganizationId
        };

        await editWorker(worker, params);

        this.select = null;
        this.$refs.form.resetValidation();

        this.$emit("refresh");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    save() {
      if (this.editedIndex > -1) {
        this.put();
      } else {
        this.post();
      }
      this.initialize();
      this.close();
    },

    close() {
      this.$emit("close");
    }
  }
};
</script>

<style></style>
