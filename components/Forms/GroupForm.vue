<template>
  <div>
    <b-button
      v-b-modal="`modal-xl-${id}`"
      :variant="variant"
      v-html="textButton"
      @click="setGroup()"
    >
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="group.profile.name"
      >
        <b-overlay :show="show" rounded="sm">
          <form ref="form" @submit.stop.prevent>
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Sigal"
                      :rules="{ required: true, min: 3 }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Sigla"
                        label-for="group-sigla"
                        id="sigla-input-group"
                      >
                        <b-form-input
                          id="group-sigla"
                          name="group-sigla"
                          type="text"
                          label="Sigla"
                          :state="getValidationState(validationContext)"
                          placeholder="Sigla"
                          v-model="group.name"
                          aria-describedby="sigla-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback id="sigla-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Nome"
                      :rules="{ required: true, min: 3 }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Nome"
                        label-for="group-name"
                        id="name-input-group"
                      >
                        <b-form-input
                          id="group-name"
                          name="group-name"
                          type="text"
                          label="Nome"
                          :state="getValidationState(validationContext)"
                          placeholder="Nome"
                          v-model="group.profile.name"
                          aria-describedby="name-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback id="name-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Grupo"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Categoria"
                        label-for="group-category"
                        id="category-input-group"
                      >
                        <b-form-select
                          id="group-category"
                          name="group-category"
                          v-model="group.profile.category"
                          :options="categorys"
                          :state="getValidationState(validationContext)"
                          aria-describedby="group-category-live-feedback"
                        ></b-form-select>
                        <b-form-invalid-feedback
                          id="group-category-live-feedback"
                          >{{
                            validationContext.errors[0]
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </validation-provider>
                  </div>
                  <div class="col-12">
                    <div class="col-12 align-self-center">
                      <button
                        class="btn btn-success btn-sm"
                        @click="handleOk"
                        :disabled="invalid"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4" v-if="oldGroup.id" data-spy="scroll" data-offset="0">
                <b-form-group label="Coordenador">
                  <b-form-radio-group v-model="group.profile.admin">
                    <b-form-radio
                      v-for="user in group.profile.users"
                      :key="user.id"
                      name="some-radios"
                      :value="user.id"
                      >{{
                        (user.first_name + user.last_name) | truncate(30)
                      }}</b-form-radio
                    >
                  </b-form-radio-group>
                </b-form-group>
              </div>
              <div class="col-8">
                <validation-provider
                  name="Descrição Completa"
                  :rules="{ required: true, min: 6 }"
                  v-slot="validationContext"
                >
                  <b-form-group
                    label="Descrição"
                    label-for="group-description"
                    id="description-input-group"
                  >
                    <b-form-textarea
                      id="group-description"
                      name="group-description"
                      type="text"
                      label="Descrição"
                      :state="getValidationState(validationContext)"
                      placeholder="Descrição Completa"
                      v-model="group.profile.description"
                      rows="20"
                      aria-describedby="group-description-live-feedback"
                    >
                    </b-form-textarea>
                    <b-form-invalid-feedback
                      id="group-description-live-feedback"
                      >{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback
                    >
                  </b-form-group>
                </validation-provider>
              </div>
            </div>
            <div class="clearfix"></div>
          </form>
        </b-overlay>
        <template v-slot:modal-footer="{ cancel }">
          <b-button size="sm" variant="danger" @click="cancel()">
            Sair
          </b-button>
        </template>
      </b-modal>
    </ValidationObserver>
  </div>
</template>
<script>
import NotificationTemplate from '../../components/Notifications/NotificationTemplate';
export default {
  components: {},
  props: ['textButton', 'oldGroup', 'id', 'variant'],
  data() {
    return {
      user: this.$store.state.auth.user,
      show: false,
      url: 'groups/',
      users: [],
      group: {
        id: null,
        name: null,
        profile: {
          name: null,
          description: null,
          category: null,
          admin: null,
          users: []
        }
      },
      categorys: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    setGroup() {
      if (this.oldGroup !== 'null') {
        this.group = Object.assign({}, this.oldGroup);
      }
      this.getCategorysGroups();
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
    },
    async createGroup() {
      try {
        const response = await this.$axios.post(
          `${this.url}`,
          this.group
        );
        this.group = response.data;
        this.notifyVue('top', 'center', 'Cadastro efetuado', 'success');
        this.$emit('createGroup', await response.data);
        this.show = false;
      } catch (error) {
        if (error.response.data.password) {
          error.response.data.password.forEach((passwordErro) => {
            this.notifyVue('top', 'center', passwordErro, 'danger');
          });
          this.show = false;
        } else {
          this.notifyVue(
            'top',
            'center',
            JSON.stringify(error.response.data),
            'danger'
          );
          this.show = false;
        }
      }
    },
    async updateGroup() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.group.id}/`,
          this.group
        );
        this.group = response.data;
        this.notifyVue('top', 'center', 'Cadastro atualizado', 'success');
        this.$emit('updateGroup', await response.data);
        this.show = false;
      } catch (error) {
        this.notifyVue(
          'top',
          'center',
          JSON.stringify(error.response.data),
          'danger'
        );
        this.show = false;
      }
    },
    handleOk() {
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.group.id) {
        this.updateGroup();
      } else {
        this.createGroup();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
    },
    async getCategorysGroups() {
      const response = await this.$axios.get(
        'categorys-groups/?limit=100'
      );
      this.categorys = [];
      response.data.results.forEach((item) => {
        this.categorys.push({ value: item.id, text: item.name });
      });
    }
  }
};
</script>
<style></style>
