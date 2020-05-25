<template>
  <div>
    <v-card outlined class="mt-0 mb-5" color="white">
      <v-card-title class="d-flex flex-row justify-center align-center">
        <p class="ma-0 pa-0 display-1">
          Добро пожаловать!
        </p>
      </v-card-title>
      <v-card-text>
        <p class="ma-0 pa-0 body-1">
          Добро пожаловать в систему, для завершения регистрации необходимо
          заполнить основную информацию об организации и выбрать логотип
          компании, если вы хотите видеть его в системе. Здесь же вы можете
          добавить продукцию компании и склады, на которых хранится ваша
          продукция. Вы можете продолжить регистрацию в любое время. Для отмены
          нажмите кнопку
          <b>"Отмена"</b>
        </p>
      </v-card-text>
    </v-card>
    <v-btn text class="mx-0 my-0" @click="cancel">
      Отмена
    </v-btn>
    <v-btn @click="nextStep" text class="my-0">
      Далее
      <v-icon right class="mb-1">mdi-arrow-right</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "RegistrationOrganizationHello",
  methods: {
    cancel() {
      this.$router.push("/home");
    },

    nextStep() {
      this.$emit("next");
    }
  }
};
</script>

<style></style>
