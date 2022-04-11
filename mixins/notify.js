import NotificationTemplate from '~/components/Notifications/NotificationTemplate';

export default {
  data() {
    return {};
  },
  methods: {
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
  }
}
