<template>
  <div style="height: 100%;" class="fon-image">
    <v-container fluid class="pa-0 ma-0" style="height: 100%;">
      <v-row
        class="pa-0 ma-0 d-flex flex-row justify-center align-center"
        style="height: 100%;"
      >
        <v-col cols="12" class="pa-0 ma-0">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-tabs v-model="tab">
              <v-tab>Вход</v-tab>
              <v-tab>Регистрация</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <LoginForm />
              </v-tab-item>
              <v-tab-item>
                <RegistrationForm />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import RegistrationForm from "@/components/RegistrationForm.vue";

export default {
  name: "Start",
  components: {
    LoginForm,
    RegistrationForm
  },
  data() {
    return {
      tab: null
    };
  }
};
</script>

<style scoped>
.fon-image {
  background: url("../assets/fon.jpg") no-repeat center center fixed;
  background-size: cover;
}
</style>
