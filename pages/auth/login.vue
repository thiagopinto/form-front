<template>
  <div class="row align-items-center justify-content-center">
    <div class="col-lg-4 col-md-12 align-self-center">
      <validation-observer v-slot="{ invalid }">
        <b-form @submit.stop.prevent="userLogin">
          <b-card class="card-user" :img-src="background">
            <template v-slot:header>
              <!--
              <b-img
                thumbnail
                :src="face"
                :alt="user.first_name"
                @error="imgUrlAlt"
                rounded="circle"
                width="150"
              >
              </b-img>
              -->
            </template>
            <b-card-body>
              <validation-provider
                name="Email"
                :rules="{ required: true, email: true }"
                v-slot="validationContext"
              >
                <b-form-group
                  id="email-input-group"
                  label="Name"
                  label-for="email-input"
                >
                  <b-form-input
                    id="email-input"
                    name="email-input"
                    v-model="user.email"
                    :state="getValidationState(validationContext)"
                    aria-describedby="email-live-feedback"
                  ></b-form-input>

                  <b-form-invalid-feedback id="email-live-feedback">{{
                    validationContext.errors[0]
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>

              <validation-provider
                name="Password"
                :rules="{ required: true }"
                v-slot="validationContext"
              >
                <b-form-group
                  id="password-input-group"
                  label="Password"
                  label-for="password-input"
                >
                  <b-form-input
                    id="password-input"
                    name="password-input"
                    type="password"
                    v-model="user.password"
                    :state="getValidationState(validationContext)"
                    aria-describedby="password-live-feedback"
                  ></b-form-input>

                  <b-form-invalid-feedback id="password-live-feedback">{{
                    validationContext.errors[0]
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-card-body>

            <hr />
            <div class="text-center">
              <div class="row justify-content-md-center">
                <div class="col-6">
                  <b-button class="ml-2" @click="resetForm()">Limpar</b-button>
                </div>
                <div class="col-6">
                  <button
                    class="btn btn-primary"
                    type="submit"
                    :disabled="invalid"
                  >
                    Entrar
                  </button>
                </div>
              </div>
              <div class="row justify-content-md-center">
                <div class="col-12">
                  <b-button variant="danger" to="/auth/reset/password"
                    >Recuperar senha!</b-button
                  >
                </div>
              </div>
            </div>
          </b-card>
        </b-form>
      </validation-observer>
    </div>
  </div>
</template>
<script>
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';
const applicationToken = process.env.APPLICATION_TOKEN;
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      loading: false,
      message: '',
      face: require('@/assets/img/face-0.jpg'),
      background: require('@/assets/img/background.png'),
      isActiveFlip: false
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
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/auth/profile');
    }
  },
  methods: {
    notifyVue(verticalAlign, horizontalAlign, message) {
      this.$notify({
        component: NotificationTemplate,
        icon: 'fas fa-exclamation-circle',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        message: message,
        type: 'danger'
      });
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.user.email = '';
      this.user.password = '';

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },

    async userLogin() {
      try {
        await this.$auth.loginWith('laravelSanctum', {
          data: {
            application_token: applicationToken,
            email: this.user.email,
            password: this.user.password
          }
        });
      } catch (error) {
        error.response.data.errors.email.forEach(passwordErro => {
          this.notifyVue('top', 'center', passwordErro, 'danger');
        });
      }
    },

    imgUrlAlt(event) {
      event.target.src = this.face;
    }
  }
};
</script>

<style></style>
