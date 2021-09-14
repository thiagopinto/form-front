<template>
  <div>
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6">
          <b-card class="text-center">
            <b-overlay :show="show" rounded="sm">
              <b-form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                  id="input-group-uid"
                  label="UID:"
                  label-for="input-uid"
                >
                  <b-form-input v-model="uid" disabled></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-token"
                  label="Token:"
                  label-for="input-token"
                >
                  <b-form-input v-model="token" disabled></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary"
                  >Ativar Usuário</b-button
                >
              </b-form>
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
      uid: null,
      token: null,
      show: false,
      url: 'auth/users/activation/'
    };
  },
  created: function() {
    this.uid = this.$route.params.uid;
    this.token = this.$route.params.token;
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$emit('welcomeMessage', { message: 'Ativar usuário' });
    },
    async activeUser() {
      try {
        await this.$axios.post(
          `${this.url}`,
          {
            uid: this.uid,
            token: this.token
          },
          {
            timeout: 30000
          }
        );

        this.notifyVue('top', 'center', 'Usuário Ativado', 'success');
      } catch (error) {
        this.notifyVue(
          'top',
          'center',
          JSON.stringify(error.response.data),
          'danger'
        );
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
      this.activeUser();
      this.$nextTick(() => {
        this.show = false;
      });
    }
  }
};
</script>
<style></style>
