<template>
  <div style="width: max-content; display: inline-block" class="m-0 p-0">
    <b-button block :variant="variant" @click="showForm">
      <font-awesome-icon :icon="['fas', iconButton]" />
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            :id="`modal-lg-form-${form.id}`"
            :ref="`modal-lg-form-${form.id}`"
            size="lg"
            scrollable
            :title="title"
            @ok="handleOk"
            :class="input"
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-6">
                  <validation-provider
                    name="Numéro inicial"
                    :rules="{ required: true, min: 3 }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <b-form-input
                        id="form-start"
                        name="form-start"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Número Inicial"
                        v-model="form.start"
                        aria-describedby="form-start-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-start-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
                <div class="col-6" v-if="!form.id">
                  <b-form-group>
                    <b-form-input
                      id="form-end"
                      name="form-end"
                      type="text"
                      placeholder="Número Final"
                      v-model="form.end"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row" v-if="type != 'input'">
                <div class="col-12">
                  <autocomplete
                    :search="search"
                    :get-result-value="getResultValue"
                    @submit="handleSelect"
                    placeholder="Nome fantasia/CNES"
                    aria-label="Nome fantasia/CNES"
                  ></autocomplete>
                </div>
              </div>
              <div class="row justify-content-center align-items-center">
                <div class="col-4">
                  {{ healthUnit.cnes_code }}
                </div>
                <div class="col-8">
                  {{ healthUnit.alias_company_name }}
                </div>
              </div>
              <div class="row justify-content-center align-items-center">
                <div class="col-6">
                  {{ healthUnit.address }}
                </div>
                <div class="col-1">
                  {{ healthUnit.address_number }}
                </div>
                <div class="col-5">
                  {{ healthUnit.neighborhood }}
                </div>
              </div>
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
      form: {
        id: null,
        start: null,
        end: null,
        cnes_code: null
      },
      moves: [],
      show: false,
      user: this.$store.state.auth.user,
      groupOptions: [].length,
      healthUnit: {
        cnes_code: null,
        alias_company_name: null,
        address: null,
        address_number: null,
        neighborhood: null
      }
    };
  },
  props: {
    item: Object,
    url: String,
    iconButton: String,
    type: String,
    title: String,
    variant: String
  },
  created() {
    if (this.item) {
      this.form = Object.assign({}, this.item);
    }
  },
  mounted: async() => {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    showForm() {
      try {
        const modal = `modal-lg-form-${this.form.id}`;
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
      if (this.form.id) {
        this.updateForm();
      } else {
        this.createForm();
      }
      this.$nextTick(() => {
        this.$bvModal.hide(`modal-lg-form-${this.form.id}`);
      });
    },
    async createForm() {
      try {
        const response = await this.$axios.post(
          `${this.url}`,
          this.form
        );

        this.$emit('addForm', { addForm: response.data });
        this.show = false;
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
        this.show = false;
      }
    },
    async updateForm() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.service.id}`,
          this.form
        );

        this.$emit('addForm', { addForm: response.data });
        this.show = false;
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
        this.show = false;
      }
    },
    async search(input) {
      try {
        if (input.length < 3) {
          return [];
        }
        const result = await this.$axios.get(`health_unit/?search=${input}`);

        return result.data;
      } catch (e) {
        await this.$store.dispatch('alerts/error', e);
      }
    },
    getResultValue(result) {
      return result.alias_company_name;
    },
    async handleSelect(result) {
      try {
        const response = await this.$axios.get(
          `health_unit/?cnes_code=${result.cnes_code}`
        );
        this.healthUnit = response.data;
      } catch (e) {
        await this.$store.dispatch('alerts/error', e);
      }
      this.form.cnes_code = this.healthUnit.cnes_code;
    }
  }
};
</script>
<style lang="scss">
.autocomplete-result-list {
  background-color: rgba(248, 248, 248, 1);
  z-index: 1000 !important;
}

</style>
