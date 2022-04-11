<template>
  <div id="app">
    <notifications></notifications>
    <nuxtjs-bootstrap-sidebar
      :initShow.sync="initialShow"
      :links.sync="links"
      :fa="true"
      theme="paper-theme"
      align="left"
      @sidebarChanged="onSidebarChanged"
    >
      <template v-slot:logo>
        <b-img :src="logoMini" alt="Circle image"></b-img>
        <div class="logo-title">
          <h2>DVS</h2>
        </div>
      </template>
      <template v-slot:footer> </template>
      <template v-slot:navbar>
        <b-navbar-brand class="text-danger">{{ title }}</b-navbar-brand>
        <b-navbar-nav class="ml-auto mr-0" v-if="loggedIn">
          <b-nav-item class="text-danger d-inline mt-0 mb-0">
            <b-dropdown variant="outline-danger" size="sm" class="m-0">
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em> Equipe </em>
              </template>
              <b-dropdown-item to="/users">Usuários</b-dropdown-item>
            </b-dropdown>
            <nuxt-link to="/auth/profile">
              <div class="card d-inline text-danger">
                <em class="pl-1">{{ authUser.name }} </em>
                <div class="author d-inline">
                  <img
                    class="avatar border-white d-inline p-0 m-0"
                    :src="face"
                    :alt="authUser.name"
                  />
                </div>
              </div>
            </nuxt-link>
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto mr-0" v-else>
          <b-nav-item to="/auth/login" class="text-danger">Login</b-nav-item>
        </b-navbar-nav>
      </template>

      <template v-slot:content>
        <transition name="bounce">
          <Nuxt @welcomeMessage="setMessage" />
        </transition>
      </template>
    </nuxtjs-bootstrap-sidebar>
  </div>
</template>

<script>
import NuxtjsBootstrapSidebar from 'nuxtjs-bootstrap-sidebar2';

export default {
  name: 'default',
  components: {
    NuxtjsBootstrapSidebar,
  },
  computed: {
    title() {
      return this.$store.state.layout.title;
    },
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
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      message: 'DVS',
      logoMini: require('@/assets/img/logo-mini.png'),
      face: require('@/assets/img/face-0.jpg'),
      initialShow: false,
      links: [
        { name: 'Home', href: { name: 'index' }, faIcon: ['fas', 'home'] },
        {
          name: 'Declaração de Óbito',
          href: { name: 'do' },
          faIcon: ['fas', 'cross'],
        },
        {
          name: 'Declaração de Nascido',
          href: { name: 'dn' },
          faIcon: ['fas', 'star'],
        },
        {
          name: 'Unidades de saúde',
          href: { name: 'health_unit' },
          faIcon: ['fas', 'hospital'],
        },
        {
          name: 'Sim',
          href: { name: 'sim' },
          faIcon: ['fas', 'chart-pie'],
        },
        {
          name: 'Sinasc',
          href: { name: 'sinasc' },
          faIcon: ['fas', 'chart-pie'],
        },
        {
          name: 'Datasets',
          href: { name: 'datasets' },
          faIcon: ['fas', 'database'],
        },
      ],
      categorysGroups: null,
    };
  },
  methods: {
    onSidebarChanged() {},
    setMessage(data) {
      this.message = data.message;
    },
  },
  async fetch() {},
};
</script>
