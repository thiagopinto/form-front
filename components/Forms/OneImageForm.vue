<template>
  <div>
    <b-button
      block
      v-b-modal.modal-xl-image-category
      variant="danger"
      class="m-1"
      size="sm"
    >
      Adicionar imagem
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <b-modal
          id="modal-xl-image-category"
          :size="size"
          scrollable
          :title="image.title"
          @ok="handleOk"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <div class="row justify-content-center align-items-center m-1">
              <div class="col-6">
                <b-button
                  variant="outline-primary"
                  block
                  @click="image.zoomIn()"
                  ><font-awesome-icon :icon="['fas', 'search-plus']" size="1x"
                /></b-button>
              </div>
              <div class="col-6">
                <b-button
                  variant="outline-primary"
                  block
                  @click="image.zoomOut()"
                  ><font-awesome-icon :icon="['fas', 'search-minus']" size="1x"
                /></b-button>
              </div>
            </div>
            <div class="row justify-content-center align-items-center">
              <croppa
                class="col-8"
                v-model="image.pathImages"
                :width="width"
                :height="height"
                :placeholder-font-size="18"
                placeholder="Escolher sua imagem"
              >
              </croppa>
            </div>
            <div class="row justify-content-center align-items-center"></div>
            <div class="clearfix"></div>
          </form>
          <template v-slot:modal-footer="{ ok, cancel }">
            <b-button size="sm" variant="success" @click="ok()">
              Salvar
            </b-button>
            <b-button size="sm" variant="danger" @click="cancel()">
              Cancelar
            </b-button>
          </template>
        </b-modal>
      </div>
    </b-overlay>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      image: {
        title: null,
        pathImages: null
      },
      show: false,
      user: this.$store.state.auth.user,
      groupOptions: []
    };
  },
  props: {
    item: null,
    url: null,
    type: null,
    width: null,
    height: null,
    size: {
      Type: String,
      Default: 'lx'
    }
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.show = true;

      this.uploadCroppedImage();
      this.$nextTick(() => {
        this.$bvModal.hide('modal-xl-image-category');
      });
    },
    async uploadCroppedImage() {
      this.image.pathImages.generateBlob(async(blob) => {
        try {
          const data = new FormData();
          data.append('imagePath', blob, 'filename.jpg');
          await this.$axios.patch(`${this.url}${this.item.id}/`, data, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`
            },
            timeout: 30000
          });

          this.show = false;
          this.$emit('addImage', { addImage: true });
        } catch (error) {
          const message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          console.log(message);
          this.$emit('addImage', { addImage: false });
          this.show = false;
        }
      }, 'image/jpeg');
    }
  }
};
</script>
<style></style>
