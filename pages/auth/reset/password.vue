<template>
  <div>
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6">
          <b-card class="text-center">
            <b-overlay :show="show" rounded="sm">
              <b-form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                  id="input-group-email"
                  label="E-mail:"
                  label-for="input-email"
                >
                  <b-form-input
                    v-model="email"
                    type="email"
                    required
                    placeholder="exemplo@exemplo.com"
                  ></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary"
                  >Recuperar Senha</b-button
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
import NotificationTemplate from "~/components/Notifications/NotificationTemplate";

export default {
  components: {},
  data() {
    return {
      email: null,
      show: false,
      url: "forgot-password"
    };
  },
  created: function() {
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Recuperar senha');
    },
    async activeUser() {
      try {
        await this.$axios.post(
          `${this.url}`,
          {
            email: this.email
          },
          {
            timeout: 30000
          }
        );

        this.notifyVue("top", "center", "Email enviado", "success");
        this.show = false;
      } catch (error) {
        this.notifyVue(
          "top",
          "center",
          JSON.stringify(error.response.data),
          "danger"
        );
      }
    },
    notifyVue(verticalAlign, horizontalAlign, message, type) {
      this.$notify({
        component: NotificationTemplate,
        icon: "fas fa-exclamation-circle",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        message: message,
        type: type
      });
    },
    handleSubmit() {
      this.activeUser();
      this.$nextTick(() => {});
    }
  }
};
</script>
<style></style>
