<template>
  <div>
    <v-card-title class="text-center">
      <div class="mx-auto">Вход в систему</div>
    </v-card-title>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-text>
        <v-text-field
          label="Логин"
          :rules="[v => !!v || 'Логин не может быть пустым']"
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
      </v-card-text>
      <v-card-actions>
        <v-btn text block v-on:click="login" :disabled="!valid">
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="isLoading"
          ></v-progress-circular>
          <div v-if="!isLoading">Вход</div>
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
  name: "LoginForm",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      show: false,
      message: "",
      isError: false,
      timeout: 5000,
      isLoading: false,
      valid: true,
      rules: {
        required: value => !!value || "Пароль не может быть пустым"
      }
    };
  },
  created() {
    this.$store.dispatch("logout");
  },
  methods: {
    login() {
      this.$refs.form.validate();
      this.$data.isLoading = true;

      AXIOS.post("/auth/sign-in", {
        username: this.$data.username,
        password: this.$data.password
      })
        .then(response => {
          this.$data.isLoading = false;

          this.$store.dispatch("login", {
            token: response.data.accessToken,
            role: response.data.authorities,
            username: response.data.username,
            organization: response.data.organizationName,
            organizationId: response.data.organizationId,
            fio: response.data.fio
          });

          if (
            response.data.organizationName == null ||
            response.data.organizationName === ""
          ) {
            this.$router.push("/registration_organization");
          } else {
            this.$router.push("/home");
          }
        })
        .catch(e => {
          this.$data.isError = true;
          this.isLoading = false;

          if (e.response != null) {
            this.getError(e.response.data.message);
          } else {
            this.getError(e.message);
          }
        });
    },
    getError(value) {
      this.$data.isError = true;
      this.$data.message = value;
    }
  }
};
</script>
