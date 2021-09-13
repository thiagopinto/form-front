<template>
  <div>
    <b-button block v-b-modal.modal-xl-image variant="danger">
      Adicionar imagem
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            id="modal-xl-image"
            size="xl"
            scrollable
            :title="image.title"
            @ok="handleOk"
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-6">
                  <validation-provider
                    name="Título"
                    :rules="{ required: true, min: 3 }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <b-form-input
                        id="image-title"
                        name="image-title"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Descrição da Imagem"
                        v-model="image.title"
                        aria-describedby="image-title-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="image-title-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
              <div class="col-1">
                <b-button
                  variant="outline-primary"
                  block
                  @click="image.zoomIn()"
                  ><font-awesome-icon :icon="['fas', 'search-plus']" size="1x"
                /></b-button>
              </div>
              <div class="col-1">
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
                  :width="768"
                  :height="432"
                  :placeholder-font-size="18"
                  placeholder="Escolher sua imagem"
                >
                </croppa>
              </div>
              <div class="row justify-content-center align-items-center"></div>
              <div class="clearfix"></div>
            </form>
            <template v-slot:modal-footer="{ ok, cancel }">
              <button
                class="btn btn-success btn-sm"
                @click="ok()"
                :disabled="invalid"
              >
                Salvar
              </button>
              <b-button size="sm" variant="danger" @click="cancel()">
                Cancelar
              </b-button>
            </template>
          </b-modal>
        </ValidationObserver>
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
  props: ['item', 'url', 'type'],
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
      this.uploadCroppedImage();
      this.$nextTick(() => {
        this.$bvModal.hide('modal-xl-image');
      });
    },
    async uploadCroppedImage() {
      this.image.pathImages.generateBlob(async(blob) => {
        try {
          const data = new FormData();
          data.append('title', this.image.title);
          data.append('imagePath', blob, 'filename.jpg');
          data.append(this.type, this.item.id);
          data.append('user', this.user.id);
          data.append('group', this.item.group);
          await this.$axios.post(`${this.url}images/`, data, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`
            },
            timeout: 30000
          });
          this.image.title = null;
          this.$emit('addImage', { addImage: true });
          this.show = false;
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
