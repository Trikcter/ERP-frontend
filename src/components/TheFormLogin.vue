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
        <v-btn text block @click="login" :disabled="!valid" :loading="loading">
          Вход
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import { login } from "@/API/auth.js";

export default {
  name: "TheFormLogin",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      show: false,
      loading: false,
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
    async login() {
      this.loading = true;

      try {
        const response = await login(this.username, this.password);
        this.$store.dispatch("login", {
          token: response.data.accessToken,
          role: response.data.authorities[0].authority,
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
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
