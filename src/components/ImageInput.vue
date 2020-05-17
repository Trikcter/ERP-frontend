<template>
  <div>
    <div @click="launchFilePicker()">
      <slot name="activator"></slot>
    </div>
    <input
      type="file"
      ref="file"
      accept="image/png, image/jpeg, image/bmp, image/svg"
      :name="uploadFieldName"
      @change="onFileChange($event.target.name, $event.target.files)"
      style="display:none"
    />
    <v-snackbar
      v-model="isError"
      bottom
      color="red"
      multi-line
      right
      :timeout="timeout"
    >
      <v-icon dark class="mr-5">mdi-alert</v-icon>
      {{ errorText }}
      <v-btn dark icon @click="isError = false">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "image-input",
  data: () => ({
    isError: null,
    errorText: "",
    uploadFieldName: "file",
    timeout: 5000
  }),
  props: {
    value: Object
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    onFileChange(fieldName, file) {
      let imageFile = file[0];
      if (file.length > 0) {
        if (!imageFile.type.match("image.*")) {
          this.isError = true;
          this.errorText = "Выберите изображение!";
        } else {
          let formData = new FormData();
          let imageURL = URL.createObjectURL(imageFile);
          formData.append("file", imageFile, imageFile.name);
          this.$emit("input", { formData, imageURL });
        }
      }
    }
  }
};
</script>
