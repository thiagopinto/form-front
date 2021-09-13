<template>
  <div class="row justify-content-md-center">
    <div class="col-xl-4 col-lg-5 col-md-6">
      <user-card :user="user" @changeUser="getUser"> </user-card>
      <div class="row">
        <div class="col-6 text-center">
          <UserForm
            textButton="Editar"
            :oldMember="user"
            :id="user.id"
            variant="primary"
            @updateMember="getUser"
          ></UserForm>
        </div>
        <div class="col-6 text-center">
          <b-button variant="danger" @click="logout">Logout</b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserForm from '~/components/Forms/UserForm.vue';
import UserCard from '~/components/Cards/SimpleUserCard';
export default {
  name: 'Profile',
  data() {
    return {
      user: {
      }
    };
  },
  components: {
    UserForm,
    UserCard
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/auth/login');
    }
  },
  methods: {
    async getUser() {
      try {
        const response = await this.$axios.get(
          `/me/`
        );
        this.user = await response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      await this.$auth.logout();
    }
  },
  created() {
    if (this.currentUser) {
      this.getUser();
    }
  }
};
</script>
