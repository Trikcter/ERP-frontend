<template>
  <div>
    <v-card-title class="text-center">
      <div class="mx-auto">Вход в систему</div>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          label="Логин"
          placeholder="Введите логин"
          v-model="username"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          :rules="[rules.required]"
          name="input-10-2"
          label="Пароль"
          placeholder="Введите пароль"
          @click:append="show = !show"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text class="mx-auto" large block v-on:click="login">Вход</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { AXIOS } from "../plugins/http-commons";

export default {
  name: "LoginForm",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      show: false,
      rules: {
        required: value => !!value || "Пароль не может быть пустым"
      }
    };
  },
  methods: {
    login() {
      AXIOS.post("/auth/sign-in", {
        username: this.$data.username,
        password: this.$data.password
      }).then(response => {
        this.$store.dispatch("login", {
          token: response.data.accessToken,
          role: response.data.authorites,
          username: response.data.username,
          organization: response.data.organizationName
        });

        this.$router.push("/home");
      });
    }
  }
};
</script>
