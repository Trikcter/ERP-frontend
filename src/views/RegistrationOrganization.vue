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
                <v-card outlined class="mt-0 mb-5" color="white">
                  <v-card-title
                    class="d-flex flex-row justify-center align-center"
                  >
                    <p class="ma-0 pa-0 display-1">
                      Добро пожаловать!
                    </p>
                  </v-card-title>
                  <v-card-text>
                    <p class="ma-0 pa-0 body-1">
                      Добро пожаловать в систему, для завершения регистрации
                      необходимо заполнить основную информацию об организации и
                      выбрать логотип компании, если вы хотите видеть его в
                      системе. Здесь же вы можете добавить продукцию компании и
                      склады, на которых хранится ваша продукция. Вы можете
                      продолжить регистрацию в любое время. Для отмены нажмите
                      кнопку <b>"Отмена"</b>
                    </p>
                  </v-card-text>
                </v-card>
                <v-btn text class="mx-0 my-0" @click="cancel">
                  Отмена
                </v-btn>
                <v-btn @click="e1 = 2" text class="my-0">
                  Далее
                  <v-icon right class="mb-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-card outlined class="mt-0 mb-5" color="white">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text class="d-flex flex-column">
                      <image-input v-model="avatar" class="align-self-center">
                        <div slot="activator">
                          <v-avatar
                            size="120px"
                            v-ripple
                            v-if="!avatar"
                            class="grey lighten-3 mb-3"
                          >
                            <v-icon large>mdi-camera</v-icon>
                          </v-avatar>
                          <v-avatar size="120px" v-else class="mb-3">
                            <v-img :src="avatar.imageURL"></v-img>
                          </v-avatar>
                        </div>
                      </image-input>
                      <v-text-field
                        v-model="title"
                        :rules="[
                          v => !!v || 'Наименование не может быть пустым!'
                        ]"
                        label="Наименование организации"
                        placeholder="Введите наименование организации"
                      ></v-text-field>
                      <v-text-field
                        v-model="addressOrganization"
                        :rules="[
                          v => !!v || 'Адрес организации не может быть пустым!'
                        ]"
                        label="Адрес организации"
                        placeholder="Введите адрес"
                      ></v-text-field>
                      <v-text-field
                        v-model="inn"
                        :rules="[v => !!v || 'ИНН не может быть пустым!']"
                        label="ИНН"
                        placeholder="Введите ИНН"
                      ></v-text-field>
                      <v-text-field
                        v-model="kpp"
                        :rules="[v => !!v || 'КПП не может быть пустым!']"
                        label="КПП"
                        placeholder="Введите КПП"
                      ></v-text-field>
                      <v-text-field
                        v-model="ogrn"
                        :rules="[v => !!v || 'ОГРН не может быть пустым!']"
                        label="ОГРН"
                        placeholder="Введите ОГРН"
                      ></v-text-field>
                    </v-card-text>
                  </v-form>
                </v-card>
                <v-btn @click="e1 = 1" text class="ma-0">
                  <v-icon left class="mb-1">mdi-arrow-left</v-icon>
                  Назад
                </v-btn>
                <v-btn
                  @click="registration(false)"
                  text
                  class="ma-0"
                  :disabled="!valid"
                >
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
                <v-btn
                  @click="registration(true)"
                  text
                  class="ma-0"
                  :disabled="!valid"
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if="isLoading"
                  ></v-progress-circular>
                  <div v-if="!isLoading">
                    Завершить регистрацию
                  </div>
                </v-btn>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-card outlined class="mt-2 mb-5" color="white">
                  <v-form ref="form_p" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="product_title"
                      :rules="[
                        v => !!v || 'Название продукта не может быть пустым!'
                      ]"
                      label="Название продукта"
                      placeholder="Введите название"
                    ></v-text-field>
                    <v-text-field
                      v-model="code"
                      label="Код продукции"
                      placeholder="Введите код"
                    ></v-text-field>
                    <v-text-field
                      v-model="price"
                      :rules="priceRules"
                      label="Цена"
                      placeholder="Введите цену"
                    ></v-text-field>
                    <v-btn small text @click="addProduct" :disabled="!valid">
                      Добавить
                    </v-btn>
                  </v-form>
                  <v-simple-table fixed-header class="mt-3" height="200px">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Наименование</th>
                          <th class="text-left">Код</th>
                          <th class="text-left">Цена</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in products" :key="item.name">
                          <td>{{ item.title }}</td>
                          <td>{{ item.code }}</td>
                          <td>{{ item.price }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
                <v-btn @click="addProducts(true)" text class="ma-0">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if="isLoading"
                  ></v-progress-circular>
                  <div v-if="!isLoading">
                    Завершить регистрацию
                  </div>
                </v-btn>
                <v-btn @click="addProducts(false)" text class="ma-0">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if="isLoading"
                  ></v-progress-circular>
                  <div v-if="!isLoading">
                    Готово
                  </div>
                </v-btn>
                <v-btn @click="e1 = 4" text class="ma-0">
                  <div>
                    Пропустить
                    <v-icon right class="mb-1">mdi-arrow-right</v-icon>
                  </div>
                </v-btn>
              </v-stepper-content>
              <v-stepper-content step="4">
                <v-card outlined class="mt-2 mb-5" color="white">
                  <v-form ref="form_w" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="warehouse_title"
                      :rules="[
                        v => !!v || 'Название склада не может быть пустым!'
                      ]"
                      label="Название склада"
                      placeholder="Введите название"
                    ></v-text-field>
                    <v-text-field
                      v-model="address"
                      :rules="[
                        v => !!v || 'Адрес склада не может быть пустым!'
                      ]"
                      label="Адрес склада"
                      placeholder="Введите адрес"
                    ></v-text-field>
                    <v-text-field
                      v-model="volume"
                      :rules="volumeRules"
                      label="Вместительность"
                      placeholder="Введите вместительность"
                    ></v-text-field>
                    <v-btn small text @click="addWarehouse" :disabled="!valid">
                      Добавить
                    </v-btn>
                  </v-form>
                  <v-simple-table fixed-header class="mt-3" height="175px">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Наименование</th>
                          <th class="text-left">Адрес</th>
                          <th class="text-left">Вместительность</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in warehouses" :key="item.name">
                          <td>{{ item.title }}</td>
                          <td>{{ item.addressTitle }}</td>
                          <td>{{ item.volume }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
                <v-btn @click="addWarehouses" text class="ma-0">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if="isLoading"
                  ></v-progress-circular>
                  <div v-if="!isLoading">
                    Готово
                  </div>
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
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
import ImageInput from "@/components/ImageInput.vue";

export default {
  name: "RegistartionOrganization",
  components: {
    ImageInput
  },
  data() {
    return {
      e1: 1,
      avatar: null,
      title: "",
      kpp: "",
      inn: "",
      ogrn: "",
      message: "",
      isError: false,
      isLoading: false,
      timeout: 5000,
      product_title: "",
      code: "",
      price: 0,
      products: [],
      warehouses: [],
      warehouse_title: "",
      volume: 0,
      address: "",
      addressOrganization: "",
      valid: true,
      volumeRules: [
        v => !!v || "Вместительность склада не может быть пустой!",
        v => !isNaN(v) || "Вместительность - это число!",
        v =>
          Number.isInteger(parseInt(v, 10)) || "Вместительность - целое число!"
      ],
      priceRules: [
        v => !!v || "Цена не может быть пустой!",
        v =>
          (typeof v == "string" && !v.includes(",")) ||
          "Дробное число записывает через точку!",
        v => !isNaN(v) || "Цена может быть тольком числом!"
      ]
    };
  },
  methods: {
    cancel() {
      this.$router.push("/home");
    },
    getError(value) {
      this.$data.isLoading = false;
      this.$data.isError = true;
      this.$data.message = value;
    },
    addWarehouse() {
      this.$data.warehouses.push({
        title: this.$data.warehouse_title,
        organizationId: this.$store.getters.getOrganizationId,
        addressTitle: this.$data.address,
        volume: this.$data.volume
      });

      this.$refs.form_w.reset();
    },
    addProduct() {
      this.$data.products.push({
        title: this.$data.product_title,
        code: this.$data.code,
        price: this.$data.price,
        organizationId: this.$store.getters.getOrganizationId
      });

      this.$refs.form_p.reset();
    },
    addWarehouses() {
      if (this.$data.warehouses.length == 0) {
        this.$router.push("/home");
      }

      this.$data.isLoading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.post("/warehouse/all", this.$data.warehouses, {
        headers: header
      })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.$data.isLoading = false;

          this.$router.push("/home");
        })
        .catch(e => {
          this.$data.isError = true;
          this.getError(e.response.data.message);
        });
    },
    addProducts(path) {
      if (this.$data.products.length == 0) {
        this.$router.push("/home");
      }

      this.$data.isLoading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.post("/product/all", this.$data.products, {
        headers: header
      })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.$data.isLoading = false;

          if (path) {
            this.$router.push("/home");
          } else {
            this.$data.e1 = 4;
          }
        })
        .catch(e => {
          this.$data.isError = true;
          this.getError(e.response.data.message);
        });
    },
    registration(path) {
      this.$data.isLoading = true;
      const header = {
        Authorization: "Bearer " + this.$store.getters.getToken
      };

      AXIOS.post(
        "/organization",
        {
          title: this.$data.title,
          kpp: this.$data.kpp,
          inn: this.$data.inn,
          ogrn: this.$data.ogrn,
          addressTitle: this.$data.addressOrganization
        },
        {
          headers: header
        }
      )
        .then(response => {
          this.$store.dispatch("addOrganization", {
            id: response.data.id,
            title: response.data.title
          });

          AXIOS.post("/organization/file", this.$data.avatar.formData, {
            headers: header
          })
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              this.$data.isLoading = false;

              if (path) {
                this.$router.push("/home");
              } else {
                this.$data.e1 = 3;
              }
            })
            .catch(e => {
              this.$data.isError = true;
              this.getError(e.response.data.message);
            });
        })
        .catch(e => {
          this.$data.isError = true;
          this.getError(e.response.data.message);
        });
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
