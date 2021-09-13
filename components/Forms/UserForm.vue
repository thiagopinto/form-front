<template>
  <div>
    <b-button
      v-b-modal="`modal-lg-${id}`"
      :variant="variant"
      v-html="textButton"
      @click="setMember()"
    >
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-lg-${id}`"
        scrollable
        :title="member.username"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <form ref="form" @submit.stop.prevent>
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Nome"
                      :rules="{ required: true, min: 3 }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Nome"
                        label-for="first_name-input"
                        id="first_name-input-group"
                      >
                        <b-form-input
                          id="first_name-input"
                          name="first_name-input"
                          type="text"
                          label="Nome"
                          :state="getValidationState(validationContext)"
                          placeholder="Nome"
                          v-model="member.name"
                          aria-describedby="first_name-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback
                          id="first_name-live-feedback"
                          >{{
                            validationContext.errors[0]
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Email"
                      :rules="{ required: true, email: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Email"
                        label-for="email-input"
                        id="email-select-group"
                      >
                        <b-form-input
                          id="email-input"
                          name="email-input"
                          type="email"
                          label="Email"
                          :state="getValidationState(validationContext)"
                          placeholder="Email"
                          v-model="member.email"
                          @blur="checkEmail"
                          aria-describedby="email-live-feedback"
                        >
                        </b-form-input>

                        <b-form-invalid-feedback id="email-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Telefone"
                      :rules="{ required: true, min: 3 }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Telefone"
                        label-for="fone-input"
                        id="fone-input-text"
                      >
                        <b-form-input
                          id="fone-input"
                          name="fone-input"
                          type="text"
                          label="Telefone"
                          :state="getValidationState(validationContext)"
                          placeholder="Telefone"
                          v-model="member.phone"
                          aria-describedby="fone-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback id="fone-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <b-form-group
                      label="Ocupação"
                      label-for="occupation-input"
                      id="occupation-input-group"
                    >
                      <b-form-input
                        id="occupation-input"
                        name="occupation-input"
                        type="text"
                        label="Nome"
                        placeholder="Ocupação"
                        v-model="member.occupation"
                      >
                      </b-form-input>
                    </b-form-group>
                  </div>
                </div>

                <div class="row" v-if="member.id !== null">
                  <b-button
                    class="m-2"
                    to="/auth/reset/password"
                    block
                    variant="danger"
                    >Recuparar Senha</b-button
                  >
                </div>
                <div class="row" v-else>
                  <div class="col-6">
                    <validation-provider
                      name="Senha"
                      :rules="{
                        regex: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
                        required: true
                      }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Senha"
                        label-for="password-input"
                        id="password-input-text"
                      >
                        <b-form-input
                          id="password-input"
                          name="password-input"
                          type="password"
                          label="Senha"
                          :state="getValidationState(validationContext)"
                          placeholder="Ex: Senha@123"
                          v-model="member.password"
                          aria-describedby="password-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback id="password-live-feedback">
                          {{ validationContext.errors[0] }}, a senha deve ter no
                          mínimo 8 caracteres 1 minúscula 1 maiúscula 1 número e
                          1 caracter especial
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                  <div class="col-6">
                    <validation-provider
                      name="Confirme a senha"
                      rules="required|password:@Senha"
                      v-slot="validationContext"
                      id="password_confirmation-input-text"
                    >
                      <b-form-group
                        label="Confirme a senha"
                        label-for="password_confirmation-input"
                      >
                        <b-form-input
                          id="password_confirmation-input"
                          name="password_confirmation-input"
                          type="password"
                          label="Confirme a senha"
                          :state="getValidationState(validationContext)"
                          placeholder="Ex: Senha@123"
                          v-model="member.passwordConfirmation"
                          aria-describedby="password_confirmation-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback
                          id="password_confirmation-live-feedback"
                        >
                          {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>

                <div class="row justify-content-center align-items-center">
                  <div class="col-12 align-self-center"></div>
                </div>
              </div>
            </div>
            <div class="row" v-if="isSuperuser">
              <div class="col-12">
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.roles variant="info">
                        Grupos
                      </b-button>
                    </b-card-header>
                    <b-collapse
                      id="roles"
                      visible
                      accordion="roles"
                      role="tabpanel"
                    >
                      <b-card-body>
                        <b-card-text>
                          <div class="row">
                            <b-card
                              no-body
                              class="col-3 ml-2 mr-2 p-1 card-teacher"
                              v-for="role in roles"
                              :key="role.id"
                            >
                              <b-row no-gutters>
                                <b-col md="12">
                                  <b-row
                                    v-b-tooltip.hover
                                    :title="role.name"
                                  >
                                    <b-col md="12">
                                      {{role.alias | truncate(30) }}
                                    </b-col>
                                  </b-row>
                                  <b-row>
                                    <b-col md="12">
                                      <b-form-checkbox
                                        v-model="role.selected"
                                        name="check-button"
                                        switch
                                        size="lg"
                                      >
                                      </b-form-checkbox>
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                            </b-card>
                          </div>
                        </b-card-text>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </div>
            </div>
          </form>
        </b-overlay>
        <template v-slot:modal-footer="{ ok, cancel }">
          <button
            class="btn btn-success btn-sm"
            @click="ok()"
            :disabled="invalid"
          >
            Salvar
          </button>
          <b-button size="sm" variant="danger" @click="cancel()">
            Sair
          </b-button>
        </template>
      </b-modal>
    </ValidationObserver>
  </div>
</template>
<script>
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';

export default {
  components: {},
  props: ['textButton', 'oldMember', 'id', 'variant'],
  data() {
    return {
      initialImage: null,
      pathImages: this.$store.state.paths.pathImages,
      face: require('@/assets/img/face-0.jpg'),
      user: this.$store.state.auth.user,
      show: false,
      url: 'user/',
      roles: [],
      member: {
        id: null,
        username: null,
        name: null,
        password: null,
        email: null,
        is_staff: true,
        is_superuser: false,
        roles: [],
        user_permissions: []
      },
      selectedroles: [],
      relevanceOptions: [
        { value: 6, text: 6 },
        { value: 5, text: 5 },
        { value: 4, text: 4 },
        { value: 3, text: 3 },
        { value: 2, text: 2 },
        { value: 1, text: 1 }
      ]
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    authUser() {
      if (this.loggedIn) {
        return this.$store.state.auth.user;
      } else {
        return {};
      }
    },
    isSuperuser() {
      if (this.loggedIn) {
        if (this.$store.state.auth.user.is_superuser) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    setMember() {
      if (this.oldMember !== 'null') {
        this.member = Object.assign({}, this.oldMember);
      }
      this.getroles();
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
    async createMember() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.member);
        this.member = response.data;
        this.notifyVue('top', 'center', 'Cadastro efetuado', 'success');
        this.$emit('createMember', await response.data);
        this.show = false;
      } catch (error) {
        if (error.response.data.password) {
          error.response.data.password.forEach(passwordErro => {
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
    async updateMember() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.member.id}/`,
          this.member
        );
        this.member = response.data;

        this.notifyVue('top', 'center', 'Cadastro atualizado', 'success');
        this.$emit('updateMember', await response.data);
        this.show = false;
      } catch (error) {
        if (error.response.data.password) {
          error.response.data.password.forEach(passwordErro => {
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
    handleOk() {
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.selectedroles = [];
      this.roles.forEach(group => {
        if (group.selected) {
          this.selectedroles.push(group.id);
        }
      });

      if (this.selectedroles.length > 0) {
        this.member.roles = this.selectedroles;

        if (this.member.id) {
          this.updateMember();
        } else {
          this.createMember();
        }
        this.$nextTick(() => {
          // this.$bvModal.hide(`modal-xl-${this.id}`);
        });
      } else {
        this.notifyVue('top', 'center', 'Selecione, no minimo grupo', 'danger');
        this.show = false;
      }
    },
    async getroles() {
      const response = await this.$axios.get('role/?limit=100');
      this.roles = await response.data;
      console.log(this.roles);
      this.roles.forEach(role => {
        role.selected = false;
      });
      this.member.roles.forEach(memberGroup => {
        this.roles.forEach(group => {
          if (group.id === memberGroup.id) {
            group.selected = true;
          }
        });
      });
    },
    async checkEmail() {
      const response = await this.$axios.get(
        `auth/users/check-email/?email=${this.member.email}`
      );
      const status = await response.data.status;

      if (status) {
        this.notifyVue('top', 'center', 'Email já cadastrado', 'danger');
      }
    },
    async updateImage() {
      const response = await this.$axios.get(`${this.url}${this.member.id}/`);
      this.member = response.data;
    }
  }
};
</script>
<style></style>
