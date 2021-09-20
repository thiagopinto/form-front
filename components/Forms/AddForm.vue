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
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-6">
                  <validation-provider
                    name="Numéro inicial"
                    :rules="{ required: true, min: 3 }"
                    v-slot="validationContext"
                  >
                    <b-form-group label="Numéro inicial:">
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
                <div class="col-6">
                  <b-form-group label="Quantidade:">
                    <b-form-input
                      id="quant"
                      name="quant"
                      type="text"
                      placeholder="Quantidade"
                      v-model="quant"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Numéro final:">
                    <b-form-input
                      id="form-end"
                      name="form-end"
                      type="text"
                      placeholder="Número Final"
                      v-model="form.end"
                      :disabled="true"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
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
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';
export default {
  components: {},
  data() {
    return {
      form: {
        id: null,
        number: null,
        name: null,
        start: null,
        end: null,
        event_date: null,
        range_number_start: null,
        range_number_end: null,
        cnes_code: null,
        cnes_code_devolution: null
      },
      quant: null,
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
      this.createForm();
      this.$nextTick(() => {
        this.$bvModal.hide(`modal-lg-form-${this.form.id}`);
      });
    },
    async createForm() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.form);

        this.$emit('addForm', { addForm: response.data });
        this.notifyVue('top', 'center', 'Criado!', 'success');
        this.show = false;
        this.form = {
          id: null,
          number: null,
          name: null,
          start: null,
          end: null,
          event_date: null,
          range_number_start: null,
          range_number_end: null,
          cnes_code: null,
          cnes_code_devolution: null
        };
        this.quant = null;
      } catch (error) {
        this.notifyVue('top', 'center', error.response.data.message, 'danger');
        console.log(error.response.data.message);
        this.show = false;
      }
    },
    notifyVue(verticalAlign, horizontalAlign, message, type) {
      this.$notify({
        component: NotificationTemplate,
        icon: 'fas fa-exclamation-circle',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        message: message,
        timeout: 10000,
        type: type
      });
    }
  },
  watch: {
    quant: function(val) {
      if (val > 1) {
        this.form.end = Number(this.form.start) + Number(val) - 1;
      } else {
        this.form.end = null;
      }
    }
  }
};
</script>
<style lang="scss"></style>
