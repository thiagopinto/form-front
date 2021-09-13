<template>
  <div style="width: max-content; display: inline-block" class="m-1">
    <b-button block size="sm" variant="info" @click="getServices">
      <i class="far fa-edit"></i>
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <b-modal
          :id="`modal-lg-service-${item.id}`"
          :ref="`modal-lg-service-${item.id}`"
          size="lg"
          scrollable
          :title="service.title"
          @ok="handleOk"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <div class="row">
              <div class="col-12">
                <b-form-group>
                  <b-form-input
                    id="service-title"
                    name="service-title"
                    type="text"
                    :state="validateState('service-title')"
                    placeholder="Titulo do service"
                    v-model="service.title"
                    v-validate="{ required: true, min: 3 }"
                    aria-describedby="service-title-feedback"
                    data-vv-as="Título"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback id="service-title-feedback">{{
                    veeErrors.first('service-title')
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <b-form-group>
                  <b-form-textarea
                    id="service-description"
                    name="service-description"
                    placeholder="description do service"
                    v-model="service.description"
                  >
                  </b-form-textarea>
                </b-form-group>
              </div>
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
      service: {
        title: null,
        description: null,
        category: null
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
    async getServices() {
      try {
        const response = await this.$axios.get(`${this.url}${this.item.id}/`);
        this.service = response.data;
        const modal = `modal-lg-service-${this.item.id}`;
        this.$refs[modal].show();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteMove(id) {
      try {
        await this.$axios.delete(`${this.url}${id}/`);
        this.getServices();
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
      this.updateService();
      this.$nextTick(() => {
        // this.$bvModal.hide("modal-lg-service");
      });
    },
    async updateService() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.service.id}/`,
          this.service
        );

        this.$emit('addService', { addService: response.data });
        this.getServices();
        this.show = false;
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
        this.$emit('addService', { addService: false });
        this.show = false;
      }
    }
  }
};
</script>
<style></style>
