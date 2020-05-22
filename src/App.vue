<template>
  <v-app>
    <v-content>
      <v-snackbar
        v-model="error"
        bottom
        color="red"
        multi-line
        right
        :timeout="timeout"
      >
        <v-icon dark class="mr-5">mdi-alert</v-icon>
        {{ message }}
        <v-btn dark icon @click="error = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-snackbar>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { AXIOS } from "@/API/http-client.js";

export default {
  name: "App",
  data() {
    return {
      message: "",
      error: false,
      timeout: 5000
    };
  },
  methods: {
    getError(value) {
      this.error = true;
      this.message = value;
    }
  },
  created() {
    const errorInterceptor = error => {
      if (!error.response) {
        this.getError("Ошибка сервера/сети");
        return Promise.reject(error);
      }

      switch (error.response.status) {
        case 400:
          this.getError(error.response.data.message);
          break;

        case 401:
          this.getError(error.response.data.message);
          break;

        default:
          this.getError("Непредвиденная ошибка");
      }
      return Promise.reject(error);
    };

    AXIOS.interceptors.response.use(undefined, errorInterceptor);
  }
};
</script>
