<template>
  <div>
    <b-button
      block
      size="sm"
      v-b-modal.modal-xl-video
      variant="danger"
      @click="getMovies"
    >
      <i class="far fa-edit"></i>
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <b-modal
          id="modal-xl-video"
          size="xl"
          scrollable
          :title="video.title"
          hide-footer
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <div class="row">
              <div class="col-6">
                <b-form-group>
                  <b-form-input
                    id="video-title"
                    name="video-title"
                    type="text"
                    :state="validateState('video-title')"
                    placeholder="Titulo do video"
                    v-model="video.title"
                    v-validate="{ required: true, min: 3 }"
                    aria-describedby="video-title-feedback"
                    data-vv-as="Título"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback id="video-title-feedback">{{
                    veeErrors.first('video-title')
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </div>
              <div class="col-6">
                <b-form-group>
                  <b-form-input
                    id="video-url"
                    name="video-url"
                    type="text"
                    :state="validateState('video-url')"
                    placeholder="URL do video"
                    v-model="video.url"
                    v-validate="{ required: true, min: 3 }"
                    aria-describedby="video-url-feedback"
                    data-vv-as="Título"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback id="video-url-feedback">{{
                    veeErrors.first('video-url')
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-10">
                <b-form-group>
                  <b-form-input
                    id="video-tags"
                    name="video-tags"
                    type="text"
                    :state="validateState('video-tags')"
                    placeholder="Tags, #tag1 #tag2..."
                    v-model="video.tags"
                    v-validate="{ required: true, min: 3 }"
                    aria-describedby="video-tags-feedback"
                    data-vv-as="Título"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback id="video-tags-feedback">{{
                    veeErrors.first('video-tags')
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </div>
              <div class="col-2">
                <b-button variant="primary" type="submit">Adicionar</b-button>
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                <LazyYoutube :src="video.url" v-if="video.url" />
              </div>
              <div
                class="col-4 overflow-auto"
                style="max-height: calc(50vh - 10.5rem)"
              >
                <div class="row">
                  <div class="col-12 mb-1" v-for="move in moves" :key="move.id">
                    <a
                      v-on:click.stop.prevent="
                        () => {
                          video.url = move.url;
                        }
                      "
                    >
                      <LazyYoutube :src="move.url" />
                    </a>
                    <b-button
                      variant="danger"
                      size="sm"
                      @click="deleteMove(move.id)"
                      >Delete</b-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-content-center align-items-center"></div>
            <div class="clearfix"></div>
          </form>
        </b-modal>
      </div>
    </b-overlay>
  </div>
</template>
<script>
import { LazyYoutube } from 'vue-lazytube';

export default {
  components: { LazyYoutube },
  data() {
    return {
      video: {
        title: null,
        url: null,
        tags: null
      },
      moves: [],
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
    async getMovies() {
      try {
        const response = await this.$axios.get(
          `${this.url}videos/?news=${this.item.id}`
        );
        this.moves = response.data.results;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteMove(id) {
      try {
        await this.$axios.delete(`${this.url}videos/${id}/`);
        this.getMovies();
      } catch (error) {
        console.error(error);
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.createVideo();
      this.$nextTick(() => {
        // this.$bvModal.hide("modal-xl-video");
      });
    },
    async createVideo() {
      try {
        const data = new FormData();
        data.append('title', this.video.title);
        data.append('url', this.video.url);
        data.append('tags', this.video.tags);
        data.append(this.type, this.item.id);
        data.append('user', this.user.id);
        data.append('group', this.item.group);
        await this.$axios.post(`${this.url}videos/`, data, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          },
          timeout: 30000
        });

        this.$emit('addvideo', { addvideo: true });
        this.getMovies();
        this.show = false;
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
        this.$emit('addvideo', { addvideo: false });
        this.show = false;
      }
    }
  }
};
</script>
<style></style>
