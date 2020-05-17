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
        <v-btn text block v-on:click="registration" :disabled="!valid">
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="isLoading"
          ></v-progress-circular>
          <div v-if="!isLoading">
            Далее
            <v-icon right class="mb-1">mdi-arrow-right</v-icon>
          </div>
        </v-btn>
      </v-card-actions>
    </v-form>
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
  </div>
</template>

<script>
import { AXIOS } from "../plugins/http-commons";

export default {
  name: "RegistrationForm",
  data() {
    return {
      username: "",
      password: "",
      fio: "",
      show: false,
      message: "",
      isError: false,
      timeout: 5000,
      isLoading: false,
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
    getError(value) {
      this.$data.isError = true;
      this.$data.message = value;
    },
    registration() {
      this.$refs.form.validate();
      this.$data.isLoading = true;

      AXIOS.post("/auth/sign-up", {
        username: this.$data.username,
        password: this.$data.password,
        fio: this.$data.fio
      })
        .then(response => {
          this.$data.isLoading = false;

          this.$store.dispatch("login", {
            token: response.data.accessToken,
            role: response.data.authorities,
            username: response.data.username,
            organization: response.data.organizationName,
            fio: response.data.fio
          });

          this.$router.push("/registration_organization");
        })
        .catch(e => {
          this.$data.isLoading = false;
          this.$data.isError = true;
          this.getError(e.response.data.message);
        });
    }
  }
};
</script>
