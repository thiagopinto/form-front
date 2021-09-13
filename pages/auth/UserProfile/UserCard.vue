<template>
  <b-card class="card-user">
    <div slot="image">
      <img src="@/assets/img/background.png" alt="..." />
    </div>
    <div>
      <div class="author">
        <img
          class="avatar border-white"
          :src="(pathImages, user.profile.imagePath)"
          alt="..."
        />
        <div>
          <b-button v-b-modal.change-avatar>Troque sua Foto</b-button>

          <b-modal
            id="change-avatar"
            size="lg"
            title="Troque sua Foto"
            @ok="handleOk"
          >
            <div class="row justify-content-md-center">
              <div class="col-6 p-0">
                <croppa
                  v-model="avatar"
                  :width="400"
                  :height="400"
                  :placeholder-font-size="18"
                  placeholder="Escolher sua imagem"
                >
                </croppa>
              </div>
            </div>
            <div class="row justify-content-md-center">
              <div class="col-3">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  @click="avatar.zoomIn()"
                >
                  <i class="fas fa-search-plus fa-3x"></i>
                </button>
              </div>
              <div class="col-3">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  @click="avatar.zoomOut()"
                >
                  <i class="fas fa-search-minus fa-3x"></i>
                </button>
              </div>
            </div>
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
        <h4 class="title">
          {{ user.first_name }} {{ user.last_name }}
          <br />
          <a href="#">
            <small>{{ user.email }}</small>
          </a>
        </h4>
      </div>
      <p class="description text-center">
        {{ user.profile.description_full }}
      </p>
    </div>
    <hr />
    <div class="text-center">
      <div class="row justify-content-md-center">
        <div class="col-4" v-if="user.profile.lattesPath">
          <nuxt-link :href="user.profile.lattesPath" target="_blank">
            Lattes
          </nuxt-link>
        </div>
        <div class="col-4" v-if="user.profile.orcidPath">
          <nuxt-link :href="user.profile.orcidPath" target="_blank">
            Orcid
          </nuxt-link>
        </div>
      </div>
    </div>
  </b-card>
</template>
<script>
export default {
  data() {
    return {
      avatar: {},
      user: {
        profile: {
          imagePath: null
        }
      }
    };
  },
  props: {
    userOld: Object
  },
  mounted: () => {
    this.user = Object.assign({}, this.userOld);
  },
  computed: {
    pathImages() {
      return this.$store.state.paths.pathImages;
    }
  },
  methods: {
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.uploadCroppedImage();
      this.$nextTick(() => {
        this.$bvModal.hide('change-avatar');
      });
    },
    uploadCroppedImage() {
      this.avatar.generateBlob(
        blob => {
          this.user.pathImages = blob;
          return this.$store.dispatch('auth/patchProfileImage', this.user).then(
            user => {
              // this.user = user.data;
              this.$emit('changeUser', user);
            },
            error => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        },
        'image/jpeg',
        0.8
      ); // 80% compressed jpeg file
    }
  }
};
</script>
<style></style>
