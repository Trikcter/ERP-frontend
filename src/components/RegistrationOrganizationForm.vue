<template>
  <div>
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
            :rules="[v => !!v || 'Наименование не может быть пустым!']"
            label="Наименование организации"
            placeholder="Введите наименование организации"
          ></v-text-field>
          <v-text-field
            v-model="address"
            :rules="[v => !!v || 'Адрес организации не может быть пустым!']"
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
    <v-btn @click="back" text class="ma-0">
      <v-icon left class="mb-1">mdi-arrow-left</v-icon>
      Назад
    </v-btn>
    <v-btn
      @click="registration(false)"
      text
      class="ma-0"
      :disabled="!valid"
      :loading="loading"
    >
      Далее
      <v-icon right class="mb-1">mdi-arrow-right</v-icon>
    </v-btn>
    <v-btn
      @click="registration(true)"
      text
      class="ma-0"
      :disabled="!valid"
      :loading="loading"
    >
      Завершить регистрацию
    </v-btn>
  </div>
</template>

<script>
import ImageInput from "@/components/ImageInput.vue";
import { createOrganization, saveFile } from "@/API/organization.js";

export default {
  name: "RegistrationOrganizationForm",
  components: {
    ImageInput
  },
  data() {
    return {
      avatar: null,
      title: "",
      kpp: "",
      inn: "",
      ogrn: "",
      address: "",
      loading: false,
      valid: true
    };
  },
  methods: {
    selectPath(path) {
      if (path) {
        this.$router.push("/home");
      } else {
        this.$emit("next");
      }
    },

    back() {
      this.$emit("back");
    },

    async registration(path) {
      this.loading = true;

      try {
        let response = await createOrganization({
          title: this.title,
          inn: this.inn,
          kpp: this.kpp,
          ogrn: this.ogrn,
          addressTitle: this.address
        });

        this.$store.dispatch("addOrganization", {
          id: response.data.id,
          title: response.data.title
        });

        if (this.avatar != null) {
          response = await saveFile(
            this.avatar.formData,
            this.$store.getters.getOrganizationId
          );

          this.selectPath(path);
        } else {
          this.selectPath(path);
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

<style></style>
