<template>
  <div>
    <b-button
      block
      size="sm"
      v-b-modal.modal-xl-embed
      variant="success"
      @click="getEmbed"
    >
      Adicionar Embed Tableau
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            id="modal-xl-embed"
            size="xl"
            scrollable
            :url="embed.url"
            hide-footer
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-12">
                  <validation-provider
                    name="URL"
                    :rules="{ required: true, min: 3 }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <b-form-input
                        id="embed-url"
                        name="embed-url"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Link"
                        v-model="embed.url"
                        aria-describedby="embed-url-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="embed-url-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
              </div>
              <div class="row">
                <div class="col-5">
                  <validation-provider
                    name="Prefix"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <b-form-input
                        disabled
                        id="embed-prefix"
                        name="embed-prefix"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Prefix do embed"
                        v-model="embed.prefix"
                        aria-describedby="embed-prefix-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="embed-prefix-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>

                <div class="col-5">
                  <validation-provider
                    name="Resource"
                    :rules="{ required: true, min: 3 }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <b-form-input
                        disabled
                        id="embed-resource"
                        name="embed-resource"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="resource,"
                        v-model="embed.resource"
                        aria-describedby="embed-resource-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="embed-resource-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
                <div class="col-2">
                  <button
                    class="btn btn-success btn-sm"
                    @click="handleSubmit"
                    :disabled="invalid"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <div class="row">
                <div class="col-8">
                  <a href="#"
                    ><img
                      class="img-fluid"
                      :alt="`${embed.resource}`"
                      :src="`https://public.tableau.com/static/images/23/${embed.resource}/1_rss.png`"
                      style="border: none"
                  /></a>
                </div>
                <div
                  class="col-4 overflow-auto"
                  style="max-height: calc(50vh - 10.5rem)"
                >
                  <div class="row">
                    <div
                      class="col-12 mb-1"
                      v-for="embedImage in embeds"
                      :key="embedImage.id"
                    >
                      <a
                        v-on:click.stop.prevent="
                          () => {
                            embed.url = move.url;
                          }
                        "
                      >
                        <img
                          class="img-fluid"
                          :alt="`${embed.resource}`"
                          :src="`https://public.tableau.com/static/images/23/${embedImage.resource}/1_rss.png`"
                          style="border: none"
                        />
                      </a>
                      <b-button
                        variant="danger"
                        size="sm"
                        @click="deleteMove(embedImage.id)"
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
      embed: {
        url: null,
        prefix: null,
        resource: null
      },
      embeds: [],
      show: false,
      user: this.$store.state.auth.user,
      groupOptions: []
    };
  },
  watch: {
    'embed.url': function(val) {
      this.embed.resource = val.slice(val.indexOf('viz/') + 4, val.length);
      this.embed.prefix = this.embed.resource.slice(0, 2);
    }
  },
  props: ['item', 'url', 'type'],
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async getEmbed() {
      try {
        const response = await this.$axios.get(
          `${this.url}embeds/?news=${this.item.id}`
        );
        this.embeds = response.data.results;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteMove(id) {
      try {
        await this.$axios.delete(`${this.url}embeds/${id}/`);
        this.getEmbed();
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
      this.createembed();
      this.$nextTick(() => {
        // this.$bvModal.hide("modal-xl-embed");
      });
    },
    async createembed() {
      try {
        const data = new FormData();
        data.append('url', this.embed.url);
        data.append('prefix', this.embed.prefix);
        data.append('resource', this.embed.resource);
        data.append(this.type, this.item.id);
        data.append('user', this.user.id);
        data.append('group', this.item.group);
        await this.$axios.post(`${this.url}embeds/`, data, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          },
          timeout: 30000
        });

        this.$emit('addembed', { addembed: true });
        this.getEmbed();
        this.show = false;
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
        this.$emit('addembed', { addembed: false });
        this.show = false;
      }
    }
  }
};
</script>
<style></style>
