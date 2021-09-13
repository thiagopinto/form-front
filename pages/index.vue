<template>
  <div class="row justify-content-center">
    <div class="col-sm-12 col-md-6 col-lg-4">
      <b-button to="do" block variant="danger" size="lg"
        ><font-awesome-icon :icon="['fas', 'cross']" size="4x" />
        <div>Daclaração de Óbito</div>
      </b-button>
    </div>
    <div class="col-sm-12 col-md-6 col-lg-4">
      <b-button to="dn" block variant="info" size="lg"
        ><font-awesome-icon :icon="['fas', 'star']" size="4x" />
        <div>Daclaração de Nascido</div>
      </b-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      imagePath: process.env.BASE_URL + 'img/news',
      pathImages: this.$store.state.paths.pathImages,
      limit: 6,
      name: 'Home'
    };
  },
  async fetch() {},
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    }
  },
  created: function() {
    this.$store.commit('layout/CHANGE_NAV_TITLE', 'Controle de formulários');
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/auth/login');
    }
  },
  methods: {}
};
</script>
<style>
.overflow-auto {
  height: 120vh;
}

.featured {
  background-color: rgba(245, 89, 61, 0.1);
  opacity: 1;
  color: #f5593d;
  border-radius: 5px;
}
</style>
