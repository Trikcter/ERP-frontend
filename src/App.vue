<template>
  <v-app>
    <v-system-bar app color="blue-grey" lights-out dark class="tile-bar">
      <v-icon>mdi-factory</v-icon>
      <span>ERP система</span>
      <v-spacer></v-spacer>
      <div class="system-button-group">
        <v-btn icon x-small @click="minimize">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn icon x-small @click="maximaze">
          <v-icon>mdi-checkbox-blank-outline</v-icon>
        </v-btn>
        <v-btn icon x-small @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-system-bar>
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
import { logout } from "@/API/auth.js";
import {
  closeWindows,
  minimizeWindows,
  maximazeWindows
} from "@/plugins/electron.js";

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
    },
    async close() {
      try {
        await logout();
        this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      } finally {
        closeWindows();
      }
    },
    minimize() {
      minimizeWindows();
    },
    maximaze() {
      maximazeWindows();
    }
  },
  created() {
    const getAuthToken = () => "Bearer " + localStorage.getItem("token");

    const authInterceptor = config => {
      config.headers["Authorization"] = getAuthToken();
      return config;
    };

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

        case 500:
          this.getError(error.response.data.message);
          break;

        default:
          this.getError("Непредвиденная ошибка");
      }
      return Promise.reject(error);
    };

    AXIOS.interceptors.response.use(undefined, errorInterceptor);
    AXIOS.interceptors.request.use(authInterceptor);
  }
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
.tile-bar {
  -webkit-app-region: drag;
}
.system-button-group {
  -webkit-app-region: no-drag;
}
</style>
