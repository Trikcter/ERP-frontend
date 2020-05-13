<template>
  <div>
    <v-card-title class="text-center">
      <div class="mx-auto">Регистрация в системе</div>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="fio"
          label="ФИО"
          placeholder="Введите ФИО"
        ></v-text-field>
        <v-text-field
          v-model="username"
          label="Логин"
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
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text class="mx-auto" block large v-on:click="registration">
        Далее
        <v-icon right large class="px-5">mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
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
      rules: {
        required: value => !!value || "Пароль не может быть пустым"
      }
    };
  },
  methods: {
    changeRegistrationType() {
      this.$data.isUserRegistration = !this.$data.isUserRegistration;
    },
    registration() {
      AXIOS.post("/auth/sign-up", {
        username: this.$data.username,
        password: this.$data.password,
        fio: this.$data.fio
      })
        .then(
          // eslint-disable-next-line no-unused-vars
          response => {
            this.$router.push("/new_organization");
          },
          error => {
            console.log(error.response.data.message);
          }
        )
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
