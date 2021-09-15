<template>
  <div>
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6">
          <b-card class="text-center">
            <b-overlay :show="show" rounded="sm">
              <ValidationObserver v-slot="{ invalid }">
                <b-form ref="form" @submit.stop.prevent>
                  <b-form-group
                    id="input-group-token"
                    label="Token:"
                    label-for="input-token"
                  >
                    <b-form-input v-model="token" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group
                    id="input-group-email"
                    label="E-mail:"
                    label-for="input-email"
                  >
                    <b-form-input v-model="email" disabled></b-form-input>
                  </b-form-group>

                  <div class="row">
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
                            v-model="password"
                            aria-describedby="password-live-feedback"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback id="password-live-feedback">
                            {{ validationContext.errors[0] }}, a senha deve ter
                            no mínimo 8 caracteres 1 minúscula 1 maiúscula 1
                            número e 1 caracter especial
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
                            v-model="password_confirmation"
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

                  <button
                    class="btn btn-success btn-sm"
                    @click="handleSubmit"
                    :disabled="invalid"
                  >
                    Alterar senha
                  </button>
                </b-form>
              </ValidationObserver>
            </b-overlay>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';

export default {
  components: {},
  data() {
    return {
      token: null,
      email: null,
      password: null,
      password_confirmation: null,
      show: false,
      url: 'reset-password/'
    };
  },
  created: function() {
    this.token = this.$route.params.token;
    this.email = this.$route.params.email;
    this.welcomeMessage();
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Recuperar Senha...');
    },
    async activeUser() {
      try {
        await this.$axios.post(
          `${this.url}`,
          {
            token: this.token,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation
          },
          {
            timeout: 30000
          }
        );

        this.notifyVue('top', 'center', 'Senha alterada', 'success');
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
    notifyVue(verticalAlign, horizontalAlign, message, type) {
      this.$notify({
        component: NotificationTemplate,
        icon: 'fas fa-exclamation-circle',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        message: message,
        type: type
      });
    },
    handleSubmit() {
      this.show = true;

      this.activeUser();
      this.$nextTick(() => {});
    }
  }
};
</script>
<style></style>
