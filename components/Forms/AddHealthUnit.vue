<template>
  <div style="width: max-content; display: inline-block;" class="m-0 p-0">
    <b-button block :variant="variant" @click="showForm">
      <font-awesome-icon :icon="['fas', iconButton]" />
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            :id="`modal-lg-form-${healthUnit.id}`"
            :ref="`modal-lg-form-${healthUnit.id}`"
            size="lg"
            scrollable
            :title="title"
            @ok="handleOk"
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Código da unidade:">
                    <b-form-input
                      id="unit_code"
                      name="unit_code"
                      type="text"
                      disabled
                      placeholder="Código da unidade"
                      v-model="healthUnit.unit_code"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-6">
                  <ValidationProvider
                    name="CNES:"
                    :rules="{ required: true, min: 7 }"
                    v-slot="validationContext"
                  >
                    <b-form-group label="CNES">
                      <b-form-input
                        id="cnes_code"
                        name="cnes_code"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="CNES"
                        v-model="healthUnit.cnes_code"
                        aria-describedby="form-start-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-start-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="CNPJ do Mantenedor:">
                    <input
                      class="form-control"
                      id="cnpj_maintainer_code"
                      name="cnpj_maintainer_code"
                      type="text"
                      placeholder="CNPJ do Mantenedor"
                      v-model="healthUnit.cnpj_maintainer_code"
                      v-mask="'##.###.###/####-##'"
                    />
                  </b-form-group>
                </div>
                <div class="col-6">
                  <b-form-group label="Nome do Mantenedor:">
                    <b-form-input
                      id="company_name"
                      name="company_name"
                      type="text"
                      placeholder="Nome do Mantenedor"
                      v-model="healthUnit.company_name"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <ValidationProvider
                    name="Nome:"
                    :rules="{ required: true, min: 7 }"
                    v-slot="validationContext"
                  >
                    <b-form-group label="Nome">
                      <b-form-input
                        id="alias_company_name"
                        name="alias_company_name"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Nome"
                        v-model="healthUnit.alias_company_name"
                        aria-describedby="form-start-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-start-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Endereço:">
                    <b-form-input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Endereço"
                      v-model="healthUnit.address"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-2">
                  <b-form-group label="Número:">
                    <b-form-input
                      id="address_number"
                      name="address_number"
                      type="text"
                      placeholder="Número"
                      v-model="healthUnit.address_number"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-4">
                  <b-form-group label="Complemento:">
                    <b-form-input
                      id="address_complement"
                      name="address_complement"
                      type="text"
                      placeholder="Complemento"
                      v-model="healthUnit.address_complement"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Bairro:">
                    <b-form-input
                      id="neighborhood"
                      name="neighborhood"
                      type="text"
                      placeholder="Bairro"
                      v-model="healthUnit.neighborhood"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-6">
                  <b-form-group label="CEP:">
                    <b-form-input
                      id="cep_code"
                      name="cep_code"
                      type="text"
                      placeholder="CEP"
                      v-model="healthUnit.cep_code"
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
  name: 'FormsAddHealthUnit',
  components: {},
  data() {
    return {
      healthUnit: {
        id: null,
        unit_code: null,
        cnes_code: null,
        cnpj_maintainer_code: null,
        company_name: null,
        alias_company_name: null,
        company_type: null,
        ibge_state_id: 22,
        ibge_city_id: 221100,
        address: null,
        address_number: null,
        address_complement: null,
        neighborhood: null,
        cep_code: null,
      },
      quant: null,
      moves: [],
      show: false,
      user: this.$store.state.auth.user,
      groupOptions: [].length,
    };
  },
  props: {
    item: Object,
    url: String,
    iconButton: String,
    type: String,
    title: String,
    variant: String,
  },
  created() {
    if (this.item) {
      this.healthUnit = Object.assign({}, this.item);
    }
  },
  asyncmounted() {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    showForm() {
      try {
        const modal = `modal-lg-form-${this.healthUnit.id}`;
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
      this.healthUnit.cnpj_maintainer_code = this.healthUnit.cnpj_maintainer_code.replace(
        /[^\d]+/g,
        ''
      );
      if (this.healthUnit.id === null) {
        this.createForm();
      } else {
        this.updateForm();
      }

      this.$nextTick(() => {
        this.$bvModal.hide(`modal-lg-form-${this.healthUnit.id}`);
      });
    },
    async createForm() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.healthUnit);

        this.$emit('addForm', { addForm: response.data });
        this.notifyVue('top', 'center', 'Criado!', 'success');
        this.show = false;
        this.healthUnit = {
          id: null,
          unit_code: null,
          cnes_code: null,
          cnpj_maintainer_code: null,
          company_name: null,
          alias_company_name: null,
          company_type: null,
          ibge_state_id: 22,
          ibge_city_id: 221100,
          address: null,
          address_number: null,
          address_complement: null,
          neighborhood: null,
          cep_code: null,
        };
        this.quant = null;
      } catch (error) {
        this.notifyVue('top', 'center', error.response.data.message, 'danger');
        console.log(error.response.data.message);
        this.show = false;
      }
    },
    async updateForm() {
      try {
        const response = await this.$axios.put(`${this.url}`, this.healthUnit);

        this.$emit('addForm', { addForm: response.data });
        this.notifyVue('top', 'center', 'Criado!', 'success');
        this.show = false;
        this.healthUnit = {
          id: null,
          unit_code: null,
          cnes_code: null,
          cnpj_maintainer_code: null,
          company_name: null,
          alias_company_name: null,
          company_type: null,
          ibge_state_id: 22,
          ibge_city_id: 221100,
          address: null,
          address_number: null,
          address_complement: null,
          neighborhood: null,
          cep_code: null,
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
        type: type,
      });
    },
  },
  watch: {
    'healthUnit.cnes_code'(val) {
      this.healthUnit.unit_code = `221100${val}`;
    },
  },
};
</script>
<style lang="scss"></style>
