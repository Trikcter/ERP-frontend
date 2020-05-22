<template>
  <div style="height: 100%;" class="fon-image">
    <v-container fluid class="pa-0 ma-0" style="height: 100%">
      <v-row
        class="pa-0 ma-0 d-flex flex-row justify-center align-center"
        style="height: 100%;"
      >
        <v-col
          cols="12"
          class="pa-0 ma-0 d-flex flex-row justify-center align-center"
        >
          <v-stepper style="width: 45vw;" v-model="e1">
            <v-stepper-header class="text-center">
              <v-stepper-step step="1" :complete="e1 > 1">
                Начало
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="2" :complete="e1 > 2">
                Данные
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3" :complete="e1 > 4">
                Продукция
                <small>Опционально</small>
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="4">
                Склады
                <small>Опционально</small>
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <RegistartionOrganizationHello @next="nextStep" />
              </v-stepper-content>

              <v-stepper-content step="2">
                <RegistartionOrganizationForm
                  @next="nextStep"
                  @back="backStep"
                />
              </v-stepper-content>

              <v-stepper-content step="3">
                <RegistrationOrganizationProducts
                  @next="nextStep"
                  @back="backStep"
                />
              </v-stepper-content>

              <v-stepper-content step="4">
                <RegistrationOrganizationWarehouse />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RegistartionOrganizationHello from "@/components/RegistrationOrganizationHello.vue";
import RegistartionOrganizationForm from "@/components/RegistrationOrganizationForm.vue";
import RegistrationOrganizationProducts from "@/components/RegistrationOrganizationProducts.vue";
import RegistrationOrganizationWarehouse from "@/components/RegistrationOrganizationWarehouses.vue";

export default {
  name: "RegistartionOrganization",
  components: {
    RegistartionOrganizationHello,
    RegistartionOrganizationForm,
    RegistrationOrganizationProducts,
    RegistrationOrganizationWarehouse
  },
  data() {
    return {
      e1: 1
    };
  },
  methods: {
    nextStep() {
      this.e1++;
    },

    backStep() {
      this.e1--;
    }
  }
};
</script>

<style scoped>
.fon-image {
  background: url("../assets/fon.jpg") no-repeat center center fixed;
  background-size: cover;
}
</style>
