<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            @input="getUsers"
            class="pagination-danger"
          ></b-pagination>
        </div>
        <div class="col-sm-12 col-md-2">
          <UserForm
            textButton="Cadastar"
            oldMember="null"
            id="new"
            variant="primary"
            @createMember="getUsers"
          ></UserForm>
        </div>
        <div class="col-sm-12 col-md-4">
          <div class="input-group">
            <input
              type="text"
              v-model="search"
              @input="searchHandler"
              class="form-control"
            />
            <div class="input-group-append">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <b-table
              id="table-users"
              striped
              hover
              :fields="fields"
              :items="listUsers"
              :busy="isBusy"
              primary-key="id"
              :tbody-transition-props="transProps"
            >
              <template v-slot:cell(id)="data">
                {{ data.item.id }}
              </template>
              <template v-slot:cell(name)="data">
                {{ data.item.name }}
              </template>
              <template v-slot:cell(email)="data">
                {{ data.item.email }}
              </template>
              <template v-slot:cell(edit)="data">
                <UserForm
                  textButton="Editar"
                  :oldMember="data.item"
                  :id="data.item.id"
                  variant="primary"
                  @updateMember="getUsers"
                ></UserForm>
              </template>
              <template v-slot:cell(delete)="data">
                <ConfirmDelete
                  :item="data.item"
                  url="users/"
                  @deletItem="getUsers"
                ></ConfirmDelete>
              </template>
            </b-table>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserForm from '~/components/Forms/UserForm.vue';
import ConfirmDelete from '~/components/Forms/ConfirmDelete';

export default {
  components: {
    UserForm,
    ConfirmDelete
  },
  data() {
    return {
      isBusy: false,
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'email', label: 'E-mail', sortable: true },
        { key: 'edit', label: 'Editar' },
        { key: 'delete', label: 'Excluir' }
      ],
      transProps: {
        // Transition name
        name: 'flip-list'
      },
      listUsers: [],
      listGroups: [],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      pathImages: this.$store.state.paths.pathImages
    };
  },
  async fetch() {
    const responseGroups = await this.$axios.get(`role/`);
    this.listGroups = await responseGroups.data;

    this.isBusy = !this.isBusy;
    const responseUsers = await this.$axios.get(
      `user/${this.genPage()}${this.genSearch()}`
    );
    this.listUsers = await responseUsers.data.data;
    this.totalRows = await responseUsers.data.total;
    this.isBusy = !this.isBusy;
  },
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
    this.welcomeMessage();
  },
  mounted() {
    if (!this.isSuperuser) {
      this.$router.push('/');
    }
    this.getUsers();
    this.getGroups();
  },
  methods: {
    async userDelete(userId) {
      try {
        await this.$axios.delete(`user/${userId}/`);
        this.getUsers();
      } catch (error) {
        console.error(error);
      }
    },
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Equipe');
    },
    async getUsers() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(
        `user/${this.genPage()}${this.genSearch()}`
      );
      console.log(response.data.data);
      this.listUsers = await response.data.data;
      this.totalRows = await response.data.total;
      this.isBusy = !this.isBusy;
    },
    async getGroups() {
      const response = await this.$axios.get(`role/`);
      this.listGroups = await response.data;
    },
    genPage() {
      return `?per_page=${this.perPage}&page=${this.currentPage}`;
    },
    genSearch() {
      if (this.search.length > 3) {
        return `&search=${this.search}`;
      } else {
        return '';
      }
    },
    searchHandler() {
      this.getUsers();
    }
  }
};
</script>
<style>
table#table-users .flip-list-move {
  transition: transform 1s;
}
</style>
