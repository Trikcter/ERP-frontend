<template>
  <div>
    <v-card-title class="text-center">
      <div class="mx-auto">Регистрация в системе</div>
    </v-card-title>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-text>
        <v-text-field
          v-model="fio"
          label="ФИО"
          :rules="nameRules"
          placeholder="Введите ФИО"
        ></v-text-field>
        <v-text-field
          v-model="username"
          label="Логин"
          :rules="[v => !!v || 'Логин не может быть пустым!']"
          placeholder="Введите логин"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required]"
          :type="show ? 'text' : 'password'"
          name="input-10-2"
          label="Пароль"
          placeholder="Введите пароль"
          @click:append="show = !show"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :loading="loading"
          :disabled="!valid"
          text
          block
          @click="registration"
        >
          Далее
          <v-icon right class="mb-1">mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import { createUser } from "@/API/auth.js";

export default {
  name: "TheFormRegistration",
  data() {
    return {
      username: "",
      password: "",
      fio: "",
      show: false,
      loading: false,
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
  methods: {
    async registration() {
      this.loading = true;

      try {
        const response = await createUser(
          this.username,
          this.password,
          this.fio
        );

        this.$store.dispatch("login", {
          token: response.data.accessToken,
          role: response.data.authorities,
          username: response.data.username,
          organization: response.data.organizationName,
          fio: response.data.fio
        });

        this.$router.push("/registration_organization");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
